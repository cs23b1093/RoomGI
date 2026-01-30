import React from 'react';

interface LoadingPageProps {
  message?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ 
  message = "Loading..." 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        {/* Loading Animation */}
        <div className="mb-8">
          <div className="relative">
            {/* Spinning House Icon */}
            <div className="text-6xl mb-4 animate-bounce">🏠</div>
            
            {/* Loading Spinner */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {message}
          </h2>
          <p className="text-gray-600 text-sm">
            Please wait while we load your content
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;