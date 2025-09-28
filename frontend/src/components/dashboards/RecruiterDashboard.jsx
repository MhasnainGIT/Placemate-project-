import React from 'react';
import Navbar from '../shared/Navbar';

const RecruiterDashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Recruiter Dashboard</h1>
        <p className="text-gray-600 mb-6">Post opportunities, view applicants, schedule interviews, and submit evaluations.</p>
        <div className="rounded-md border p-4 bg-white">
          <p className="text-sm text-gray-700">Use Admin menu to manage companies and jobs.</p>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
