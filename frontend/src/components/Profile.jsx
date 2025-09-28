import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, User, FileText, Code, Download, ExternalLink } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    const isResume = user?.profile?.resume;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Profile Header Card */}
                <div className='bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 mb-8'>
                    <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6'>
                        <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1'>
                            {/* Avatar */}
                            <div className="relative">
                                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 ring-4 ring-gray-100">
                                    <AvatarImage
                                        src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"}
                                        alt="Profile"
                                    />
                                </Avatar>
                                <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-md border border-gray-200">
                                    <User className="h-4 w-4 text-gray-600" />
                                </div>
                            </div>

                            {/* User Info */}
                            <div className='text-center sm:text-left flex-1'>
                                <div className="mb-4">
                                    <h1 className='font-bold text-2xl sm:text-3xl text-gray-900 mb-2'>
                                        {user?.fullname || 'User Name'}
                                    </h1>
                                    {user?.profile?.bio ? (
                                        <p className="text-gray-600 text-base leading-relaxed max-w-2xl">
                                            {user.profile.bio}
                                        </p>
                                    ) : (
                                        <p className="text-gray-400 italic">
                                            Add a bio to tell employers about yourself
                                        </p>
                                    )}
                                </div>

                                {/* Contact Information */}
                                <div className='space-y-3'>
                                    <div className='flex items-center justify-center sm:justify-start space-x-3 text-gray-600'>
                                        <Mail className="h-5 w-5 text-gray-500" />
                                        <span className="break-all">{user?.email}</span>
                                    </div>
                                    {user?.phoneNumber && (
                                        <div className='flex items-center justify-center sm:justify-start space-x-3 text-gray-600'>
                                            <Contact className="h-5 w-5 text-gray-500" />
                                            <span>{user.phoneNumber}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <Button
                            onClick={() => setOpen(true)}
                            className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white self-center lg:self-start"
                        >
                            <Pen className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                    </div>
                </div>

                {/* Skills and Resume Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Skills Card */}
                    <div className='bg-white border border-gray-200 rounded-2xl shadow-sm p-6'>
                        <div className="flex items-center space-x-2 mb-4">
                            <Code className="h-5 w-5 text-[#6A38C2]" />
                            <h2 className='font-bold text-xl text-gray-900'>Skills</h2>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            {user?.profile?.skills?.length > 0 ? (
                                user.profile.skills.map((item, index) => (
                                    <Badge
                                        key={index}
                                        className="bg-purple-50 text-[#6A38C2] border-purple-200 hover:bg-purple-100 transition-colors duration-200 px-3 py-1"
                                    >
                                        {item}
                                    </Badge>
                                ))
                            ) : (
                                <div className="text-center py-8 w-full">
                                    <Code className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-400 text-sm">
                                        No skills added yet. Update your profile to showcase your expertise.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resume Card */}
                    <div className='bg-white border border-gray-200 rounded-2xl shadow-sm p-6'>
                        <div className="flex items-center space-x-2 mb-4">
                            <FileText className="h-5 w-5 text-[#6A38C2]" />
                            <h2 className='font-bold text-xl text-gray-900'>Resume</h2>
                        </div>
                        {isResume ? (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <FileText className="h-8 w-8 text-green-600" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-green-800 truncate">
                                            {user?.profile?.resumeOriginalName || 'Resume.pdf'}
                                        </p>
                                        <p className="text-sm text-green-600">Ready for applications</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 hover:border-[#6A38C2] hover:text-[#6A38C2]"
                                        onClick={() => window.open(user?.profile?.resume, '_blank')}
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        View Resume
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 hover:border-[#6A38C2] hover:text-[#6A38C2]"
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = user?.profile?.resume;
                                            link.download = user?.profile?.resumeOriginalName || 'resume.pdf';
                                            link.click();
                                        }}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-400 text-sm mb-4">
                                    No resume uploaded. Add your resume to improve job applications.
                                </p>
                                <Button
                                    onClick={() => setOpen(true)}
                                    variant="outline"
                                    className="hover:border-[#6A38C2] hover:text-[#6A38C2]"
                                >
                                    Upload Resume
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Applied Jobs Section */}
                <div className='bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8'>
                    <div className="flex items-center space-x-2 mb-6">
                        <FileText className="h-5 w-5 text-[#6A38C2]" />
                        <h2 className='font-bold text-xl text-gray-900'>Applied Jobs</h2>
                    </div>
                    <AppliedJobTable />
                </div>

                {/* Profile Completion Indicator */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mt-8">
                    <h3 className="font-semibold text-lg text-gray-900 mb-4">Profile Completion</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Basic Information</span>
                            <span className="text-sm font-medium text-green-600">✓ Complete</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Skills</span>
                            <span className={`text-sm font-medium ${user?.profile?.skills?.length > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                                {user?.profile?.skills?.length > 0 ? '✓ Complete' : '! Add skills'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Resume</span>
                            <span className={`text-sm font-medium ${isResume ? 'text-green-600' : 'text-orange-600'}`}>
                                {isResume ? '✓ Complete' : '! Upload resume'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Bio</span>
                            <span className={`text-sm font-medium ${user?.profile?.bio ? 'text-green-600' : 'text-orange-600'}`}>
                                {user?.profile?.bio ? '✓ Complete' : '! Add bio'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile