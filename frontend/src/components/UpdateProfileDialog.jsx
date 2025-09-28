import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, Upload, X, User, Mail, Phone, FileText, Code, Camera } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import { Textarea } from './ui/textarea';

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const [fileName, setFileName] = useState('');

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber?.toString() || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills || [],
        file: null,
    });

    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileChangeHandler = (e) => {
        const file = e.target.files[0];
        if (file) {
            setInput({ ...input, file });
            setFileName(file.name);
        } else {
            console.error("No file selected");
        }
    };

    const removeFile = () => {
        setInput({ ...input, file: null });
        setFileName('');
        document.getElementById('file').value = '';
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills.join(', '));
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setOpen(false);
            } else {
                toast.error('Update failed: ' + res.data.message);
            }
        } catch (error) {
            console.error("Error details:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                        <User className="h-6 w-6 mr-2 text-[#6A38C2]" />
                        Update Profile
                    </DialogTitle>
                    <p className="text-sm text-gray-600">
                        Keep your profile information up to date to improve your job search experience.
                    </p>
                </DialogHeader>

                <form onSubmit={submitHandler}>
                    <div className="space-y-6 py-4">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="fullname" className="text-sm font-semibold text-gray-700 flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                Full Name
                            </Label>
                            <Input
                                id="fullname"
                                name="fullname"
                                type="text"
                                value={input.fullname}
                                onChange={changeEventHandler}
                                placeholder="Enter your full name"
                                className="w-full"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center">
                                <Mail className="h-4 w-4 mr-2" />
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                placeholder="Enter your email"
                                className="w-full"
                                required
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700 flex items-center">
                                <Phone className="h-4 w-4 mr-2" />
                                Phone Number
                            </Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="text"
                                value={input.phoneNumber}
                                onChange={changeEventHandler}
                                placeholder="Enter your phone number"
                                className="w-full"
                                maxLength={10}
                            />
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <Label htmlFor="bio" className="text-sm font-semibold text-gray-700 flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Professional Bio
                            </Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                value={input.bio}
                                onChange={changeEventHandler}
                                placeholder="Tell us about yourself, your experience, and career goals..."
                                className="w-full min-h-[80px] resize-none"
                                maxLength={500}
                            />
                            <p className="text-xs text-gray-500">
                                {input.bio.length}/500 characters
                            </p>
                        </div>

                        {/* Skills */}
                        <div className="space-y-2">
                            <Label htmlFor="skills" className="text-sm font-semibold text-gray-700 flex items-center">
                                <Code className="h-4 w-4 mr-2" />
                                Skills
                            </Label>
                            <Input
                                id="skills"
                                name="skills"
                                type="text"
                                value={input.skills.join(', ')}
                                onChange={(e) =>
                                    setInput({
                                        ...input,
                                        skills: e.target.value.split(',').map(skill => skill.trim()),
                                    })
                                }
                                placeholder="e.g., JavaScript, React, Node.js, Python"
                                className="w-full"
                            />
                            <p className="text-xs text-gray-500">
                                Separate skills with commas
                            </p>
                        </div>

                        {/* Resume Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="file" className="text-sm font-semibold text-gray-700 flex items-center">
                                <Upload className="h-4 w-4 mr-2" />
                                Resume (PDF)
                            </Label>
                            
                            {!fileName ? (
                                <div className="relative">
                                    <input
                                        id="file"
                                        name="file"
                                        type="file"
                                        accept="application/pdf"
                                        onChange={fileChangeHandler}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="file"
                                        className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#6A38C2] hover:bg-purple-50 transition-colors duration-200"
                                    >
                                        <div className="text-center">
                                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium text-[#6A38C2]">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">PDF files only (max 5MB)</p>
                                        </div>
                                    </label>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <FileText className="h-5 w-5 text-green-600" />
                                        <span className="text-sm text-green-800 font-medium truncate">
                                            {fileName}
                                        </span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={removeFile}
                                        className="text-green-600 hover:text-green-800 hover:bg-green-100"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="w-full sm:w-auto order-2 sm:order-1"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto bg-[#6A38C2] hover:bg-[#5b30a6] order-1 sm:order-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Profile'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;