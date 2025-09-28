import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
    MapPin,
    Briefcase,
    Calendar,
    DollarSign,
    Users,
    Clock,
    Building2,
    CheckCircle,
    Loader2,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isInitiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isInitiallyApplied);
    const [isLoading, setIsLoading] = useState(false);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const applyJobHandler = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });

            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] }
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to apply for job');
        } finally {
            setIsLoading(false);
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    if (!singleJob) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <Loader2 className="h-6 w-6 animate-spin text-[#6A38C2]" />
                    <span className="text-gray-600">Loading job details...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-6 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Jobs
                </Button>

                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
                    <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6'>
                        <div className="flex-1">
                            <div className="flex items-start space-x-4 mb-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <Building2 className="h-8 w-8 text-gray-600" />
                                </div>
                                <div>
                                    <h1 className='font-bold text-2xl sm:text-3xl text-gray-900 mb-2'>
                                        {singleJob?.title}
                                    </h1>
                                    <p className="text-gray-600 text-lg">
                                        {singleJob?.company?.name}
                                    </p>
                                </div>
                            </div>

                            <div className='flex flex-wrap gap-3 mb-6'>
                                <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 text-sm font-medium">
                                    {singleJob?.position || singleJob?.postion} Positions
                                </Badge>
                                <Badge className="bg-red-50 text-[#F83002] border-red-200 px-3 py-1 text-sm font-medium">
                                    {singleJob?.jobType}
                                </Badge>
                                <Badge className="bg-purple-50 text-[#7209b7] border-purple-200 px-3 py-1 text-sm font-medium">
                                    ₹{singleJob?.salary}LPA
                                </Badge>
                            </div>
                        </div>

                        {/* Apply Button */}
                        <div className="flex-shrink-0">
                            <Button
                                onClick={isApplied ? null : applyJobHandler}
                                disabled={isApplied || isLoading}
                                className={`w-full sm:w-auto px-8 py-3 text-base font-medium transition-all duration-200 ${isApplied
                                        ? 'bg-gray-100 text-gray-600 cursor-not-allowed hover:bg-gray-100'
                                        : 'bg-[#7209b7] hover:bg-[#5f32ad] text-white hover:scale-105'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Applying...
                                    </>
                                ) : isApplied ? (
                                    <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Already Applied
                                    </>
                                ) : (
                                    'Apply Now'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Job Details Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                    <div className="border-b border-gray-200 pb-4 mb-6">
                        <h2 className='text-xl font-bold text-gray-900 flex items-center'>
                            <Briefcase className="h-5 w-5 mr-2 text-[#6A38C2]" />
                            Job Description
                        </h2>
                    </div>

                    <div className='space-y-6'>
                        {/* Key Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className='flex items-start space-x-3'>
                                    <Briefcase className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className='font-semibold text-gray-900'>Role:</span>
                                        <p className='text-gray-700 mt-1'>{singleJob?.title}</p>
                                    </div>
                                </div>

                                <div className='flex items-start space-x-3'>
                                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className='font-semibold text-gray-900'>Location:</span>
                                        <p className='text-gray-700 mt-1'>{singleJob?.location}</p>
                                    </div>
                                </div>

                                <div className='flex items-start space-x-3'>
                                    <Clock className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className='font-semibold text-gray-900'>Experience:</span>
                                        <p className='text-gray-700 mt-1'>{singleJob?.experience} years</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className='flex items-start space-x-3'>
                                    <DollarSign className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className='font-semibold text-gray-900'>Salary:</span>
                                        <p className='text-gray-700 mt-1'>₹{singleJob?.salary}LPA</p>
                                    </div>
                                </div>

                                <div className='flex items-start space-x-3'>
                                    <Users className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className='font-semibold text-gray-900'>Total Applicants:</span>
                                        <p className='text-gray-700 mt-1'>{singleJob?.applications?.length || 0}</p>
                                    </div>
                                </div>

                                <div className='flex items-start space-x-3'>
                                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className='font-semibold text-gray-900'>Posted Date:</span>
                                        <p className='text-gray-700 mt-1'>{formatDate(singleJob?.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        {singleJob?.description && (
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className='font-semibold text-gray-900 mb-3 text-lg'>Description:</h3>
                                <div className='prose max-w-none'>
                                    <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
                                        {singleJob.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Requirements Section (if available) */}
                        {singleJob?.requirements && (
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className='font-semibold text-gray-900 mb-3 text-lg'>Requirements:</h3>
                                <div className='prose max-w-none'>
                                    <p className='text-gray-700 leading-relaxed'>
                                        {singleJob.requirements}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDescription;