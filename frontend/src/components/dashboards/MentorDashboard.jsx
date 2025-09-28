import React from 'react';
import Navbar from '../shared/Navbar';

const MentorDashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Mentor Dashboard</h1>
        <p className="text-gray-600 mb-6">Review flagged applications, approve/decline, and provide student guidance.</p>
        <div className="rounded-md border p-4 bg-white">
          <p className="text-sm text-gray-700">Coming soon: Exception-based review queue and mentor tools.</p>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
