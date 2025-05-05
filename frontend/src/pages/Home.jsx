import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Skill Hub</h1>
      <p className="text-lg text-gray-700 mb-6">
        Connect, share skills, and grow your professional network.
      </p>

      <div className="space-x-4">
        <Link
          to="/register"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </Link>
        <Link
          to="/login"
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home;
