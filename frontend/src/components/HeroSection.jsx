import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search, TrendingUp } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (e) => {
        e.preventDefault();
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchJobHandler(e);
        }
    }

    return (
        <div className='relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50'>
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-red-600/5"></div>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

            <div className='relative text-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24'>
                <div className='max-w-4xl mx-auto'>
                    {/* Badge */}
                    <div className="flex justify-center mb-8">
                        <div className='inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-red-50 to-purple-50 border border-red-100 text-[#F83002] font-medium text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-300'>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            <span>No. 1 Job Hunt Website</span>
                        </div>
                    </div>

                    {/* Main heading */}
                    <div className='mb-8'>
                        <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4'>
                            Search, Apply & <br className="hidden sm:block" />
                            Get Your{' '}
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-[#9333EA]'>
                                Dream Jobs & Internships
                            </span>
                        </h1>
                        <p className='text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed'>
                            Discover thousands of job opportunities with all the information you need.
                            Start your career journey with us today.
                        </p>
                    </div>

                    {/* Search bar */}
                    <form onSubmit={searchJobHandler} className='max-w-2xl mx-auto'>
                        <div className='flex flex-col sm:flex-row w-full shadow-2xl border border-gray-200 rounded-2xl bg-white p-2 items-center gap-2 hover:shadow-3xl transition-all duration-300'>
                            <div className="flex-1 w-full">
                                <input
                                    type="text"
                                    placeholder='Search by job title, company, or keywords...'
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className='outline-none border-none w-full px-4 py-3 sm:py-4 text-base sm:text-lg placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-purple-100 transition-all duration-200'
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-[#6A38C2] to-[#7c3aed] hover:from-[#5b30a6] hover:to-[#6d28d9] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                                <Search className='h-5 w-5 sm:mr-2' />
                                <span className="hidden sm:inline">Search Jobs</span>
                            </Button>
                        </div>
                    </form>

                    {/* Quick suggestions */}
                    <div className="mt-8 hidden sm:block">
                        <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {['Frontend Developer', 'Backend Developer', 'Data Science', 'UI/UX Designer'].map((term) => (
                                <button
                                    key={term}
                                    onClick={() => {
                                        setQuery(term);
                                        dispatch(setSearchedQuery(term));
                                        navigate("/browse");
                                    }}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-[#6A38C2] hover:text-[#6A38C2] transition-colors duration-200"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-[#6A38C2] mb-1">10K+</div>
                            <div className="text-sm sm:text-base text-gray-600">Active Jobs</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-[#F83002] mb-1">5K+</div>
                            <div className="text-sm sm:text-base text-gray-600">Companies</div>
                        </div>
                        <div className="text-center col-span-2 sm:col-span-1">
                            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">50K+</div>
                            <div className="text-sm sm:text-base text-gray-600">Success Stories</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection