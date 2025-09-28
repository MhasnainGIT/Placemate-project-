import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Search, Briefcase } from 'lucide-react';

const Browse = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, [dispatch])

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-2">
                        <Search className="h-6 w-6 text-[#F83002]" />
                        <h1 className='font-bold text-2xl sm:text-3xl text-gray-900'>
                            Search Results
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        {allJobs.length} {allJobs.length === 1 ? 'job' : 'jobs'} found
                    </p>
                </div>

                {/* Jobs Grid */}
                {allJobs.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                        {allJobs.map((job) => (
                            <Job key={job._id} job={job} />
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
                            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No jobs found
                            </h3>
                            <p className="text-gray-600 mb-6">
                                We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms.
                            </p>
                            <div className="space-y-2 text-sm text-gray-500">
                                <p>• Try different keywords</p>
                                <p>• Check your spelling</p>
                                <p>• Use more general terms</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Browse