import React from 'react';
import Navbar from '../shared/Navbar';
import AppliedJobTable from '../AppliedJobTable';

const StudentDashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
        <p className="text-gray-600 mb-6">Browse AI-recommended opportunities, update profile, and track your applications.</p>
        <AppliedJobTable />
      </div>
    </div>
  );
};

export default StudentDashboard;
