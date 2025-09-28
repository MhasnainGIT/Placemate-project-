import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { MapPin, Building2, Users, DollarSign, Briefcase, ArrowRight } from 'lucide-react'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    return (
        <div
            onClick={() => navigate(`/description/${job._id}`)}
            className='group relative p-6 rounded-xl shadow-sm bg-white border border-gray-200 cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden'
        >
            {/* Gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
                {/* Company Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all duration-200">
                            <Building2 className="h-6 w-6 text-gray-600 group-hover:text-[#6A38C2]" />
                        </div>
                        <div className="min-w-0">
                            <h2 className='font-semibold text-lg text-gray-900 group-hover:text-[#6A38C2] transition-colors duration-200 truncate'>
                                {job?.company?.name || 'Company Name'}
                            </h2>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{job?.location || 'India'}</span>
                            </div>
                        </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-[#6A38C2] group-hover:translate-x-1 transition-all duration-200" />
                </div>

                {/* Job Details */}
                <div className="mb-4">
                    <h3 className='font-bold text-xl text-gray-900 mb-2 group-hover:text-[#6A38C2] transition-colors duration-200'>
                        {job?.title || 'Job Title'}
                    </h3>
                    <p className='text-sm text-gray-600 leading-relaxed line-clamp-2'>
                        {truncateText(job?.description, 120) || 'Job description not available'}
                    </p>
                </div>

                {/* Job Badges */}
                <div className='flex flex-wrap gap-2'>
                    {job?.position && (
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors duration-200 text-xs font-medium px-3 py-1">
                            <Users className="h-3 w-3 mr-1" />
                            {job.position} Positions
                        </Badge>
                    )}
                    {job?.jobType && (
                        <Badge className="bg-red-50 text-[#F83002] border-red-200 hover:bg-red-100 transition-colors duration-200 text-xs font-medium px-3 py-1">
                            <Briefcase className="h-3 w-3 mr-1" />
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

                {/* Additional Info for Mobile */}
                <div className="sm:hidden mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>Applications: {job?.applications?.length || 0}</span>
                    <span>Experience: {job?.experience || 'N/A'} yrs</span>
                </div>
            </div>
        </div>
    )
}

export default LatestJobCards