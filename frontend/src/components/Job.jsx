import React, { useState } from 'react'
import { Button } from './ui/button'
import { Bookmark, MapPin, Calendar, Users, DollarSign, Building2, BookmarkCheck } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

// Added isSelected prop for visual feedback in the Jobs list
const Job = ({ job, isSelected }) => { 
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        const days = Math.floor(timeDifference / (1000 * 24 * 60 * 60));
        
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        return `${days} days ago`;
    }

    const handleSaveJob = (e) => {
        e.stopPropagation();
        setIsSaved(!isSaved);
        // Here you would typically make an API call to save/unsave the job
    }

    const handleCardClick = () => {
        navigate(`/description/${job?._id}`);
    }

    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    return (
        <div 
            // FIX: Added min-h-[420px] to enforce uniform box size
            className={`group p-6 rounded-xl shadow-sm bg-white border border-gray-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 h-full min-h-[420px] 
                ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500 shadow-xl' : 'hover:shadow-lg hover:border-gray-300'}`}
            onClick={handleCardClick}
        >
            {/* Header */}
            <div className='flex items-start justify-between mb-4'>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{daysAgoFunction(job?.createdAt)}</span>
                </div>
                <Button 
                    variant="ghost" 
                    className={`rounded-full p-2 h-9 w-9 hover:scale-110 transition-all duration-200 ${
                        isSaved ? 'text-[#6A38C2] bg-purple-50' : 'text-gray-400 hover:text-[#6A38C2]'
                    }`}
                    size="sm"
                    onClick={handleSaveJob}
                >
                    {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                </Button>
            </div>

            {/* Company Info */}
            <div className='flex items-center gap-4 mb-4'>
                <div className="relative group-hover:scale-105 transition-transform duration-200">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                        {job?.company?.logo ? (
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={job.company.logo} alt={job?.company?.name} />
                            </Avatar>
                        ) : (
                            <Building2 className="h-8 w-8 text-gray-400" />
                        )}
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className='font-semibold text-lg text-gray-900 truncate group-hover:text-[#6A38C2] transition-colors duration-200'>
                        {job?.company?.name || 'Company Name'}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{job?.location || 'India'}</span>
                    </div>
                </div>
            </div>

            {/* Job Title and Description */}
            <div className="mb-4 flex-grow"> {/* flex-grow helps push the buttons to the bottom if content is short */}
                <h2 className='font-bold text-xl text-gray-900 mb-2 group-hover:text-[#6A38C2] transition-colors duration-200'>
                    {job?.title || 'Job Title'}
                </h2>
                <p className='text-sm text-gray-600 leading-relaxed'>
                    {truncateText(job?.description, 120) || 'Job description not available'}
                </p>
            </div>

            {/* Job Details Badges */}
            <div className='flex flex-wrap gap-2 mb-5'>
                {job?.position && (
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors duration-200 text-xs font-medium px-3 py-1">
                        <Users className="h-3 w-3 mr-1" />
                        {job.position} Positions
                    </Badge>
                )}
                {job?.jobType && (
                    <Badge className="bg-red-50 text-[#F83002] border-red-200 hover:bg-red-100 transition-colors duration-200 text-xs font-medium px-3 py-1">
                        {job.jobType}
                    </Badge>
                )}
                {job?.salary && (
                    <Badge className="bg-purple-50 text-[#7209b7] border-purple-200 hover:bg-purple-100 transition-colors duration-200 text-xs font-medium px-3 py-1">
                        <DollarSign className="h-3 w-3 mr-1" />
                        ₹{job.salary}LPA
                    </Badge>
                )}
            </div>

            {/* Action Buttons */}
            <div className='flex gap-3 mt-auto'> {/* mt-auto ensures this section is always at the bottom */}
                <Button 
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/description/${job?._id}`);
                    }}
                    variant="outline" 
                    className="flex-1 hover:border-[#6A38C2] hover:text-[#6A38C2] transition-colors duration-200"
                >
                    View Details
                </Button>
                <Button 
                    onClick={handleSaveJob}
                    className={`flex-1 transition-all duration-200 ${
                        isSaved 
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                            : 'bg-[#7209b7] hover:bg-[#5f32ad] text-white hover:scale-105'
                    }`}
                >
                    {isSaved ? 'Saved' : 'Save Job'}
                </Button>
            </div>

            {/* Additional Info (Mobile) */}
            <div className="sm:hidden mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Applied: {job?.applications?.length || 0}</span>
                <span>Experience: {job?.experience || 'N/A'} yrs</span>
            </div>
        </div>
    )
}

export default Job