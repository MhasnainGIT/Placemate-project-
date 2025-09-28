import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, Filter, Briefcase, X, MapPin } from 'lucide-react';
import { Button } from './ui/button';

// Placeholder for the Job Details Panel (Right Sidebar) - Keep it commented out
// to achieve the two-column layout (Filter | Job List)
const JobDetailsPlaceholder = () => (
    <div className='hidden lg:block w-full h-[calc(100vh-80px)] sticky top-8 p-4 bg-white rounded-xl shadow-lg border border-gray-200 overflow-y-auto'>
        <div className='flex items-center justify-center h-full text-center text-gray-500'>
            <MapPin className="h-6 w-6 mr-2" />
            Select a job to view details.
        </div>
    </div>
);

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    // State to hold the ID of the currently selected job for the detail panel
    const [selectedJobId, setSelectedJobId] = useState(null);

    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase())
            })
            setFilterJobs(filteredJobs)
        } else {
            setFilterJobs(allJobs)
        }
    }, [allJobs, searchedQuery]);

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Header (No changes needed) */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Search className="h-6 w-6 text-indigo-600" />
                            <div>
                                <h1 className='font-bold text-3xl text-gray-900'>
                                    Available Jobs
                                </h1>
                                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                                    <span className="font-semibold text-indigo-600">{filterJobs.length}</span> {filterJobs.length === 1 ? 'job' : 'jobs'} found
                                    {searchedQuery && <span className="text-gray-500"> for "<span className='font-medium'>{searchedQuery}</span>"</span>}
                                </p>
                            </div>
                        </div>

                        {/* Mobile Filter Toggle Button */}
                        <Button
                            variant="outline"
                            onClick={toggleFilter}
                            className="sm:hidden mt-4 w-full justify-center items-center space-x-2 text-indigo-600 border-indigo-200 bg-white hover:bg-indigo-50"
                        >
                            <Filter className="h-4 w-4" />
                            <span>Filters</span>
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid: Filter (1 column) | Job List (3 columns) */}
                {/* FIX 1: Changed grid to 4 columns on large screens to properly split 1/3 (Filter/List) */}
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>

                    {/* 1. Desktop Filter Sidebar - Occupies 1 column */}
                    <div className='hidden lg:block lg:col-span-1'>
                        <div className="sticky top-8">
                            <FilterCard />
                        </div>
                    </div>

                    {/* 2. Mobile Filter Overlay (Kept as is - assumed usage) */}
                    {/* <FilterCard isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} /> */}

                    {/* 3. Job List (Main Content Area) */}
                    {/* FIX 2: Occupies the remaining 3 columns (4 - 1 = 3). This removes the empty space. */}
                    <div className='lg:col-span-3'>
                        {filterJobs.length <= 0 ? (
                            /* Empty State (Kept as is) */
                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                <div className="bg-white rounded-xl border border-gray-200 shadow-xl p-8 max-w-lg w-full text-center">
                                    <Briefcase className="h-16 w-16 text-indigo-400 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        No jobs found
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {searchedQuery
                                            ? `We couldn't find any jobs matching "${searchedQuery}". Try different keywords or check your filters.`
                                            : "No jobs are currently available. Check back later for new opportunities or clear your filters."
                                        }
                                    </p>
                                    <Button onClick={() => setFilterJobs(allJobs)} variant="outline" className='text-indigo-600 hover:bg-indigo-50'>
                                        Clear Search/Filters
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // FIX 3: Inner grid for Job Cards now uses md:grid-cols-3. 
                            // Since this div is wide (lg:col-span-3), 3 columns will be displayed on medium screens and up.
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {filterJobs.map((job) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.05 }}
                                        key={job?._id}
                                        className="h-full cursor-pointer"
                                        onClick={() => setSelectedJobId(job?._id)} // Handle selection
                                    >
                                        <Job job={job} isSelected={selectedJobId === job?._id} />
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Pagination/Load More Info (Kept as is) */}
                        {filterJobs.length > 0 && (
                            <div className="text-center mt-8">
                                <p className="text-gray-600 text-sm">
                                    Showing <span className='font-semibold'>{filterJobs.length}</span> results.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* 4. Job Details Panel (Commented out to prevent empty space) */}
                    {/* If you wanted a 3-column layout (Filter | List | Details), 
                    you would use lg:grid-cols-5 and span 1, 3, and 1, or lg:grid-cols-12 and span 3, 6, and 3. */}
                    {/* <div className='hidden xl:block xl:col-span-1'>
                        <JobDetailsPlaceholder />
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Jobs