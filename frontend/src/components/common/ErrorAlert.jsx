import React from "react";
import { AlertTriangle } from "lucide-react";

const ErrorAlert = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4 flex items-start">
      <AlertTriangle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
      <div>{message}</div>
    </div>
  );
};

export default ErrorAlert;