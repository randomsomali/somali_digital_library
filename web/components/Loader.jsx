// src/components/Loader.jsx
import React from 'react';

const Loader = () => {
    return (
    <div className="flex h-screen items-center justify-center bg-gray-100 relative">
      <div className="absolute w-16 h-16 border-4 border-transparent rounded-full">
        <div className="absolute inset-0 border-4 border-transparent border-l-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 border-4 border-transparent border-l-blue-500 rounded-full animate-spin delay-100"></div>
        <div className="absolute inset-0 border-4 border-transparent border-l-blue-500 rounded-full animate-spin delay-200"></div>
      </div>
    </div>
  );
};
export default Loader;
