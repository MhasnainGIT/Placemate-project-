import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    fieldOfStudy: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    description: { type: String }
});

const experienceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    description: { type: String }
});

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    level: { type: Number, min: 1, max: 5, default: 3 },
    verified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const userSchema = new mongoose.Schema({
    // Basic Information
    fullName: {
        type: String,
        required: [true, 'Full name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    role: {
        type: String,
        enum: ['student', 'placement_cell_staff', 'recruiter'],
        required: [true, 'User role is required']
    },
    
    // Common Profile Fields
    profile: {
        bio: { type: String, maxlength: 500 },
        dateOfBirth: { type: Date },
        gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
        profilePhoto: { type: String },
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
            pincode: String
        },
        socialLinks: {
            linkedin: String,
            github: String,
            portfolio: String
        },
        // Student Specific
        studentId: { type: String, sparse: true },
        rollNumber: { type: String },
        mentorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        academicInfo: {
            program: { type: String },
            department: { type: String },
            semester: { type: Number, min: 1, max: 12 },
            cgpa: { type: Number, min: 0, max: 10 },
            backlogs: { type: Number, min: 0 }
        },
        education: [educationSchema],
        projects: [{
            title: String,
            description: String,
            technologies: [String],
            githubLink: String,
            demoLink: String
        }],
        skills: [skillSchema],
        resume: {
            url: String,
            originalName: String,
            lastUpdated: Date
        },
        // Placement Cell Staff Specific
        placementDepartment: { type: String },
        // Recruiter Specific
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            sparse: true
        },
        position: { type: String },
        // Staff/Recruiter permissions
        permissions: [{
            type: String,
            enum: ['manage_users', 'manage_opportunities', 'view_reports', 'send_notifications']
        }]
    },
    
    // Account Status
    isEmailVerified: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    
    // Preferences
    notificationPreferences: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        jobAlerts: { type: Boolean, default: true }
    },
    
    // Security
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    // MFA
    mfaEnabled: { type: Boolean, default: false },
    mfaMethod: { type: String, enum: ['email', 'totp'], default: 'email' },
    mfaSecret: { type: String }, // for TOTP
    mfaOTP: { type: String },
    mfaOTPExpires: { type: Date },
    
    // Audit Fields
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ 'profile.studentId': 1 }, { sparse: true });
userSchema.index({ 'profile.company': 1 }, { sparse: true });
userSchema.index({ role: 1 });

// Virtual for user's full name
userSchema.virtual('fullNameFormatted').get(function() {
    return this.fullName;
});

// Virtual for user's role-based profile completion status
userSchema.virtual('profileCompletion').get(function() {
    let completion = 0;
    const requiredFields = ['fullName', 'email', 'phoneNumber'];
    
    // Check basic fields
    requiredFields.forEach(field => {
        if (this[field]) completion += 15; // 45% for basic info
    });
    
    // Check role-specific fields
    if (this.role === 'student') {
        if (this.profile?.academicInfo?.department) completion += 15;
        if (this.profile?.academicInfo?.semester) completion += 10;
        if (this.profile?.education?.length > 0) completion += 15;
        if (this.profile?.skills?.length > 0) completion += 15;
    } else if (this.role === 'recruiter' && this.profile?.company) {
        completion += 40;
    } else if (this.role === 'placement_cell_staff' && this.profile?.placementDepartment) {
        completion += 40; // Basic completion for placement cell staff
    }
    
    return Math.min(100, completion);
});

// Pre-save hook to update isProfileComplete
userSchema.pre('save', function(next) {
    this.isProfileComplete = this.profileCompletion >= 80;
    next();
});

export const User = mongoose.model('User', userSchema);