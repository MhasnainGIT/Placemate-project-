import React from 'react';
import Navbar from '../shared/Navbar';

const PlacementDashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Placement Cell Dashboard</h1>
        <p className="text-gray-600 mb-6">Monitor applications, placements, and unplaced students. Manage alerts and certificates.</p>
        <div className="rounded-md border p-4 bg-white">
          <p className="text-sm text-gray-700">Coming soon: Analytics, alerts, and certificate issuance tools.</p>
        </div>
      </div>
    </div>
  );
};

export default PlacementDashboard;
