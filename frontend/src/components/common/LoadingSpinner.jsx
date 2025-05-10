// src/components/common/LoadingSpinner.jsx
import React from 'react';
import "../../css/Profile.css";

const LoadingSpinner = ({ size = 'default', fullPage = false }) => {
  // Size variants
  const sizes = {
    small: 'h-5 w-5',
    default: 'h-10 w-10',
    large: 'h-16 w-16'
  };
  
  const spinnerSize = sizes[size] || sizes.default;
  
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-40">
        <div className={`${spinnerSize} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`}></div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center py-8">
      <div className={`${spinnerSize} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;