import React, { useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
    const { user } = useAuth(); // Get the logged-in user from AuthContext

  return (
    <div className="p-2 space-y-6">
      {/* Greeting Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.username || 'Staff'}!
        </h1>
        <p className="mt-2 text-sm">
          Here's an overview of your current statistics.
        </p>
      </div>
</div>)
};

export default Dashboard;
