import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { Briefcase, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);
    const navigate = useNavigate();

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
            {/* Header Section */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center space-x-3 mb-4">
                    <TrendingUp className="h-6 w-6 text-[#6A38C2]" />
                    <h1 className='text-3xl md:text-4xl font-bold text-gray-900'>
                        <span className='text-[#6A38C2]'>Latest & Top </span>
                        Job Openings
                    </h1>
                </div>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Discover exciting career opportunities from top companies. 
                    Fresh jobs posted daily.
                </p>
            </div>

            {/* Jobs Grid */}
            {allJobs.length <= 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
                        <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No jobs available
                        </h3>
                        <p className="text-gray-600 mb-6">
                            We're currently updating our job listings. 
                            Check back soon for exciting new opportunities!
                        </p>
                        <Button 
                            onClick={() => window.location.reload()}
                            variant="outline"
                            className="hover:border-[#6A38C2] hover:text-[#6A38C2]"
                        >
                            Refresh Page
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Jobs Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
                        {allJobs.slice(0, 6).map((job) => (
                            <LatestJobCards key={job._id} job={job} />
                        ))}
                    </div>

                    {/* View All Jobs Button */}
                    {allJobs.length > 6 && (
                        <div className="text-center">
                            <Button 
                                onClick={() => navigate('/jobs')}
                                className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white px-8 py-3 text-base font-medium hover:scale-105 transition-all duration-200"
                            >
                                View All {allJobs.length} Jobs
                            </Button>
                        </div>
                    )}

                    {/* Stats Section */}
                    <div className="mt-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-[#6A38C2] mb-1">
                                    {allJobs.length}+
                                </div>
                                <div className="text-sm md:text-base text-gray-600">Active Jobs</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-[#F83002] mb-1">
                                    200+
                                </div>
                                <div className="text-sm md:text-base text-gray-600">Companies</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">
                                    1000+
                                </div>
                                <div className="text-sm md:text-base text-gray-600">Job Seekers</div>
                            </div>
                            <div>
                                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                                    95%
                                </div>
                                <div className="text-sm md:text-base text-gray-600">Success Rate</div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default LatestJobs