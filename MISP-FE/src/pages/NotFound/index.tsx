import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-50 dark:bg-gray-950 font-sans">
      <div className="w-16 h-16 rounded-2xl bg-lime-500/10 text-[#84cc16] flex items-center justify-center mb-4 border border-[#84cc16]/20">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
        404
      </h1>
      <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-2">
        Page Not Found
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#84cc16] hover:bg-[#72b012] text-[#143234] text-sm font-bold transition-all shadow-md shadow-[#84cc16]/20"
      >
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
