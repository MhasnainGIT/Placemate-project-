import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Eye, EyeOff, RefreshCcw } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const [mfaRequired, setMfaRequired] = useState(false);
    const [otp, setOtp] = useState("");
    const [pendingEmail, setPendingEmail] = useState("");
    const [pendingRole, setPendingRole] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const validate = useMemo(() => ({
        email: (v) => /\S+@\S+\.\S+/.test(v) || 'Enter a valid email',
        password: (v) => (v?.length >= 8) || 'Password must be at least 8 characters',
        role: (v) => (['student', 'recruiter', 'placement_cell_staff', 'mentor'].includes(v)) || 'Select a role',
        otp: (v) => (/^\d{6}$/.test(v)) || 'Enter 6-digit OTP',
    }), []);

    const runValidation = (payload, isMFA = false) => {
        const e = {};
        if (!validate.email(payload.email)) e.email = 'Enter a valid email';
        if (!isMFA) {
            if (!validate.password(payload.password)) e.password = 'Password must be at least 8 characters';
            if (!validate.role(payload.role)) e.role = 'Select a role';
        } else {
            if (!validate.otp(payload.otp)) e.otp = 'Enter 6-digit OTP';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!runValidation(input)) return;
        try {
            dispatch(setLoading(true));
            const roleMapped = input.role === 'mentor' ? 'placement_cell_staff' : input.role;
            const res = await axios.post(`${USER_API_END_POINT}/login`, { ...input, role: roleMapped }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data?.mfaRequired) {
                setMfaRequired(true);
                setPendingEmail(input.email);
                setPendingRole(roleMapped);
                toast.success(res.data.message || 'MFA required. Check email for OTP.');
                return;
            }
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                const role = res.data.user?.role;
                if (role === 'student') navigate('/dashboard/student');
                else if (role === 'recruiter') navigate('/dashboard/recruiter');
                else if (role === 'placement_cell_staff') navigate('/dashboard/placement');
                else navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Login failed');
        } finally {
            dispatch(setLoading(false));
        }
    }

    const verifyMFA = async (e) => {
        e.preventDefault();
        if (!runValidation({ otp }, true)) return;
        try {
            dispatch(setLoading(true));
            const roleMapped = pendingRole || (input.role === 'mentor' ? 'placement_cell_staff' : input.role);
            const res = await axios.post(`${USER_API_END_POINT}/mfa/verify`, {
                email: pendingEmail,
                role: roleMapped,
                otp,
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.data?.success) {
                dispatch(setUser(res.data?.user));
                const role = res.data?.user?.role;
                if (role === 'student') navigate('/dashboard/student');
                else if (role === 'recruiter') navigate('/dashboard/recruiter');
                else if (role === 'placement_cell_staff') navigate('/dashboard/placement');
                else navigate('/');
                toast.success(res.data.message || 'Logged in');
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'MFA verification failed');
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <form
                        onSubmit={mfaRequired ? verifyMFA : submitHandler}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6"
                    >
                        <div className="text-center">
                            <h1 className="font-bold text-2xl text-gray-900">Login</h1>
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
                                disabled={loading || mfaRequired}
                                className="w-full"
                            />
                            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                        </div>

                        {/* Password Field */}
                        {!mfaRequired && (
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
                                        autoComplete="current-password"
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
                        )}

                        {/* Role Selection */}
                        {!mfaRequired && (
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
                        )}

                        {/* OTP Field for MFA */}
                        {mfaRequired && (
                            <div className="space-y-3">
                                <Label htmlFor="otp" className="text-sm font-medium text-gray-700">Enter OTP</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="6-digit code"
                                    maxLength={6}
                                    className="w-full text-center tracking-widest"
                                    disabled={loading}
                                />
                                {errors.otp && <p className="text-red-600 text-sm">{errors.otp}</p>}

                                <div className="text-center">
                                    <button
                                        type="button"
                                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                                        disabled={loading}
                                    >
                                        <RefreshCcw size={16} className="mr-1" />
                                        Resend OTP
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4">
                            {loading ? (
                                <Button className="w-full" disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full">
                                    {mfaRequired ? 'Verify OTP' : 'Login'}
                                </Button>
                            )}
                        </div>

                        {/* Sign up link */}
                        <div className="text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login