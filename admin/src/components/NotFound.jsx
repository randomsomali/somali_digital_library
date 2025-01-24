// src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="mt-4 text-gray-600">The page you're looking for doesn't exist.</p>
      <button
        onClick={() => navigate('/staff')}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;
