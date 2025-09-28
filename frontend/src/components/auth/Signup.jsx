import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2, Eye, EyeOff, Upload } from 'lucide-react';

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [fileName, setFileName] = useState('');
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
        setFileName(file ? file.name : '');
    };

    const validate = () => {
        const e = {};
        if (!input.fullname?.trim()) e.fullname = 'Full name is required';
        if (!/\S+@\S+\.\S+/.test(input.email)) e.email = 'Enter a valid email';
        if (!/^\d{10}$/.test(input.phoneNumber)) e.phoneNumber = 'Enter a valid 10-digit phone number';
        if (!input.password || input.password.length < 8) e.password = 'Password must be at least 8 characters';
        if (!['student', 'recruiter', 'placement_cell_staff', 'mentor'].includes(input.role)) e.role = 'Select a role';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        const formData = new FormData();
        const roleMapped = input.role === 'mentor' ? 'placement_cell_staff' : input.role;
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", roleMapped);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong!";
            toast.error(message);
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <div className="w-full max-w-lg">
                    <form
                        onSubmit={submitHandler}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6"
                    >
                        <div className="text-center">
                            <h1 className="font-bold text-2xl text-gray-900">Sign Up</h1>
                        </div>

                        {/* Full Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="fullname" className="text-sm font-medium text-gray-700">Full Name</Label>
                            <Input
                                id="fullname"
                                type="text"
                                value={input.fullname}
                                name="fullname"
                                onChange={changeEventHandler}
                                placeholder="Enter your full name"
                                disabled={loading}
                                className="w-full"
                            />
                            {errors.fullname && <p className="text-red-600 text-sm">{errors.fullname}</p>}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={input.email}
                                name="email"
                                onChange={changeEventHandler}
                                placeholder="Enter your email"
                                disabled={loading}
                                className="w-full"
                            />
                            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                        </div>

                        {/* Phone Number Field */}
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                type="text"
                                value={input.phoneNumber}
                                name="phoneNumber"
                                onChange={changeEventHandler}
                                placeholder="Enter your phone number"
                                disabled={loading}
                                className="w-full"
                                maxLength={10}
                            />
                            {errors.phoneNumber && <p className="text-red-600 text-sm">{errors.phoneNumber}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={input.password}
                                    name="password"
                                    onChange={changeEventHandler}
                                    placeholder="Enter your password"
                                    disabled={loading}
                                    className="w-full pr-10"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700">Role</Label>
                            <RadioGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={input.role === 'student'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer w-4 h-4"
                                        disabled={loading}
                                        id="student"
                                    />
                                    <Label htmlFor="student" className="cursor-pointer text-sm">Student</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        checked={input.role === 'recruiter'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer w-4 h-4"
                                        disabled={loading}
                                        id="recruiter"
                                    />
                                    <Label htmlFor="recruiter" className="cursor-pointer text-sm">Recruiter</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="mentor"
                                        checked={input.role === 'mentor'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer w-4 h-4"
                                        disabled={loading}
                                        id="mentor"
                                    />
                                    <Label htmlFor="mentor" className="cursor-pointer text-sm">Mentor</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="placement_cell_staff"
                                        checked={input.role === 'placement_cell_staff'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer w-4 h-4"
                                        disabled={loading}
                                        id="placement_cell_staff"
                                    />
                                    <Label htmlFor="placement_cell_staff" className="cursor-pointer text-sm">Placement Cell Staff</Label>
                                </div>
                            </RadioGroup>
                            {errors.role && <p className="text-red-600 text-sm">{errors.role}</p>}
                        </div>

                        {/* Profile Picture Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="profile" className="text-sm font-medium text-gray-700">Profile Picture</Label>
                            <div className="flex items-center space-x-3">
                                <div className="flex-1">
                                    <input
                                        id="profile"
                                        accept="image/*"
                                        type="file"
                                        onChange={changeFileHandler}
                                        className="hidden"
                                        disabled={loading}
                                    />
                                    <label
                                        htmlFor="profile"
                                        className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <Upload size={18} className="mr-2 text-gray-500" />
                                        <span className="text-sm text-gray-600">
                                            {fileName || 'Choose profile picture'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                            {fileName && (
                                <p className="text-sm text-green-600">Selected: {fileName}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            {loading ? (
                                <Button className="w-full" disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full" disabled={loading}>
                                    Sign Up
                                </Button>
                            )}
                        </div>

                        {/* Login link */}
                        <div className="text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                                Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;