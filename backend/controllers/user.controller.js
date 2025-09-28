import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendEmailOTP } from "../utils/mfa.js";

// Register User
export const register = async (req, res) => {
    try {
        const { fullName, fullname, email, phoneNumber, password, role } = req.body;
        const resolvedFullName = fullName || fullname; // support legacy field
        
        // Check for missing fields
        if (!resolvedFullName || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        // Role-specific minimal validations
        if (role === 'student') {
            // For Phase 1, just ensure rollNumber presence if provided later; skip strict here
        } else if (role === 'placement_cell_staff') {
            // could require placementDepartment later
        } else if (role === 'recruiter') {
            // company linkage often set later by admin
        } else {
            return res.status(400).json({ message: 'Invalid role', success: false });
        }

        // Check for file upload (optional)
        const file = req.file;
        let profilePhotoUrl = "";
        if (file) {
            try {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                profilePhotoUrl = cloudResponse.secure_url;
            } catch (uploadError) {
                console.log("File upload error:", uploadError);
                // Continue without profile photo if upload fails
            }
        }

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        await User.create({
            fullName: resolvedFullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: profilePhotoUrl,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Verify MFA OTP and issue session
export const verifyMFA = async (req, res) => {
    try {
        const { email, role, otp } = req.body;
        if (!email || !role || !otp) {
            return res.status(400).json({ message: 'Missing parameters', success: false });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found', success: false });
        }
        if (!['placement_cell_staff', 'recruiter'].includes(user.role)) {
            return res.status(400).json({ message: 'MFA not required for this role', success: false });
        }
        if (role !== user.role) {
            return res.status(400).json({ message: "Account doesn't exist with current role.", success: false });
        }
        if (!user.mfaOTP || !user.mfaOTPExpires || user.mfaOTPExpires < new Date()) {
            return res.status(400).json({ message: 'OTP expired or not generated', success: false });
        }
        const isValid = await bcrypt.compare(otp, user.mfaOTP);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid OTP', success: false });
        }
        // clear OTP
        user.mfaOTP = undefined;
        user.mfaOTPExpires = undefined;
        await user.save();

        const tokenData = { userId: user._id };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        const safeUser = {
            _id: user._id,
            fullName: user.fullName || user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${safeUser.fullName}`,
            user: safeUser,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

// Login User
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        // Compare password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        // Check if role matches
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            });
        }

        // Enforce MFA for placement_cell_staff and recruiter
        if (['placement_cell_staff', 'recruiter'].includes(user.role)) {
            try {
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const salt = await bcrypt.genSalt(10);
                const hashedOTP = await bcrypt.hash(otp, salt);
                user.mfaOTP = hashedOTP;
                user.mfaOTPExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
                user.mfaEnabled = true;
                await user.save();
                await sendEmailOTP(user.email, otp);
            } catch (err) {
                console.log('MFA setup error:', err);
                return res.status(500).json({ message: 'Unable to initiate MFA', success: false });
            }
            return res.status(200).json({
                message: 'MFA required. OTP sent to registered email.',
                mfaRequired: true,
                success: true
            });
        }

        // Create JWT token for student (no MFA)
        const tokenData = { userId: user._id };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        const safeUser = {
            _id: user._id,
            fullName: user.fullName || user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${safeUser.fullName}`,
            user: safeUser,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Logout User
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Update Profile
export const updateProfile = async (req, res) => {
    try {
        const { fullName, fullname, email, phoneNumber, bio, skills } = req.body;
        const resolvedFullName = fullName || fullname;
        
        // Check if user is authenticated
        const userId = req.id;  // from authentication middleware
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Handle file upload for profile photo and resume
        let profilePhotoUrl = user.profile?.profilePhoto; // default to existing photo
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhotoUrl = cloudResponse.secure_url;  // Update profile photo URL
        }

        // Handle skills array if present
        let skillsArray = [];
        if (skills) {
            skillsArray = skills.split(",");
        }

        // Update user profile fields
        if (resolvedFullName) user.fullName = resolvedFullName;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        user.profile = user.profile || {};
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;
        user.profile.profilePhoto = profilePhotoUrl;

        // If resume file is provided, upload it to Cloudinary
        if (req.file && req.file.fieldname === 'resume') {
            const resumeFileUri = getDataUri(req.file);
            const cloudResumeResponse = await cloudinary.uploader.upload(resumeFileUri.content);
            user.profile.resume = cloudResumeResponse.secure_url;  // Save resume URL
            user.profile.resumeOriginalName = req.file.originalname;  // Save original resume name
        }

        await user.save();

        user = {
            _id: user._id,
            fullName: user.fullName || user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
