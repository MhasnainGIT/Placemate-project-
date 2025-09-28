import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { Calendar, Building, Briefcase, CheckCircle, XCircle, Clock } from 'lucide-react'

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'rejected':
                return <XCircle className="h-4 w-4 text-red-600" />;
            case 'pending':
            default:
                return <Clock className="h-4 w-4 text-gray-600" />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (allAppliedJobs.length <= 0) {
        return (
            <div className="w-full">
                {/* Desktop View */}
                <div className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm">
                    <Table>
                        <TableCaption className="text-gray-600 py-8">
                            <div className="flex flex-col items-center space-y-2">
                                <Briefcase className="h-8 w-8 text-gray-400" />
                                <span className="text-lg font-medium">No applications yet</span>
                                <span className="text-sm">You haven't applied to any jobs. Start exploring opportunities!</span>
                            </div>
                        </TableCaption>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="font-semibold text-gray-700">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Date</span>
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700">
                                    <div className="flex items-center space-x-2">
                                        <Briefcase className="h-4 w-4" />
                                        <span>Job Role</span>
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700">
                                    <div className="flex items-center space-x-2">
                                        <Building className="h-4 w-4" />
                                        <span>Company</span>
                                    </div>
                                </TableHead>
                                <TableHead className="text-right font-semibold text-gray-700">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody></TableBody>
                    </Table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="text-center space-y-4">
                        <Briefcase className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
                            <p className="text-sm text-gray-600 mt-1">You haven't applied to any jobs. Start exploring opportunities!</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Desktop View */}
            <div className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <Table>
                    <TableCaption className="text-gray-600 py-4">
                        A list of your applied jobs ({allAppliedJobs.length} total)
                    </TableCaption>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-gray-700">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Date</span>
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                                <div className="flex items-center space-x-2">
                                    <Briefcase className="h-4 w-4" />
                                    <span>Job Role</span>
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                                <div className="flex items-center space-x-2">
                                    <Building className="h-4 w-4" />
                                    <span>Company</span>
                                </div>
                            </TableHead>
                            <TableHead className="text-right font-semibold text-gray-700">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allAppliedJobs.map((appliedJob, index) => (
                            <TableRow
                                key={appliedJob._id}
                                className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                            >
                                <TableCell className="font-medium text-gray-700">
                                    {formatDate(appliedJob?.createdAt)}
                                </TableCell>
                                <TableCell className="font-medium text-gray-900">
                                    {appliedJob.job?.title || 'N/A'}
                                </TableCell>
                                <TableCell className="text-gray-700">
                                    {appliedJob.job?.company?.name || 'N/A'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        {getStatusIcon(appliedJob?.status)}
                                        <Badge
                                            className={`${appliedJob?.status === "rejected"
                                                    ? 'bg-red-100 text-red-800 border-red-200'
                                                    : appliedJob.status === 'pending'
                                                        ? 'bg-gray-100 text-gray-800 border-gray-200'
                                                        : 'bg-green-100 text-green-800 border-green-200'
                                                } border`}
                                            variant="secondary"
                                        >
                                            {appliedJob.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Applied Jobs</h3>
                    <p className="text-sm text-gray-600">{allAppliedJobs.length} applications total</p>
                </div>

                {allAppliedJobs.map((appliedJob, index) => (
                    <div
                        key={appliedJob._id}
                        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-medium text-gray-900 truncate">
                                    {appliedJob.job?.title || 'N/A'}
                                </h4>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Building className="h-4 w-4 text-gray-400" />
                                    <p className="text-sm text-gray-600 truncate">
                                        {appliedJob.job?.company?.name || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-2">
                                {getStatusIcon(appliedJob?.status)}
                                <Badge
                                    className={`${appliedJob?.status === "rejected"
                                            ? 'bg-red-100 text-red-800 border-red-200'
                                            : appliedJob.status === 'pending'
                                                ? 'bg-gray-100 text-gray-800 border-gray-200'
                                                : 'bg-green-100 text-green-800 border-green-200'
                                        } border text-xs`}
                                    variant="secondary"
                                >
                                    {appliedJob.status.toUpperCase()}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>Applied on {formatDate(appliedJob?.createdAt)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AppliedJobTable