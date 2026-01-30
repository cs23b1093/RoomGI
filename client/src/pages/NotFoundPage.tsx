import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
          <div className="text-6xl mb-4">🏠</div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-2">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <p className="text-sm text-gray-500 font-mono bg-gray-100 px-3 py-2 rounded-md break-all">
            {location.pathname}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {user ? (
            <>
              <button
                onClick={handleGoHome}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
              >
                Go to Dashboard
              </button>
              
              <button
                onClick={handleGoBack}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-md transition-colors duration-200"
              >
                Go Back
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
              >
                Login to Continue
              </button>
              
              <button
                onClick={handleGoBack}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-md transition-colors duration-200"
              >
                Go Back
              </button>
            </>
          )}
        </div>

        {/* Helpful Links */}
        {user && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Looking for something specific?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="/properties"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium py-2 px-4 border border-blue-200 hover:border-blue-300 rounded-md transition-colors duration-200"
              >
                Browse Properties
              </a>
              <a
                href="/properties/map"
                className="text-green-600 hover:text-green-800 text-sm font-medium py-2 px-4 border border-green-200 hover:border-green-300 rounded-md transition-colors duration-200"
              >
                Map View
              </a>
            </div>
            
            {user.role === 'owner' && (
              <div className="mt-3">
                <a
                  href="/owner/dashboard"
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium py-2 px-4 border border-purple-200 hover:border-purple-300 rounded-md transition-colors duration-200 inline-block"
                >
                  My Properties
                </a>
              </div>
            )}
          </div>
        )}

        {/* Common Issues */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Common issues:
          </p>
          <div className="text-xs text-gray-400 space-y-1">
            <p>• The page may have been moved or deleted</p>
            <p>• Check the URL for typos</p>
            <p>• You may not have permission to access this page</p>
            {!user && <p>• Some pages require login</p>}
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-xs text-gray-400">
          <p>
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;