import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 mb-6">
              Find Your
              <br />
              <span className="text-4xl md:text-6xl">Perfect Vibe ✨</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              No cap, we're serving the realest property reviews. 
              <br />
              <span className="font-semibold text-purple-600">Transparency hits different here 💯</span>
            </p>

            {/* User Greeting */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-md mx-auto border border-white/20 shadow-lg">
              <div className="text-lg text-gray-700">
                Hey <span className="font-bold text-purple-600">{user?.email?.split('@')[0]}</span>! 👋
              </div>
              <div className="text-sm text-gray-500 mt-1">
                You're vibing as a <span className="font-semibold capitalize text-blue-600">{user?.role}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => navigate('/properties')}
                className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center gap-2">
                  🏠 Browse Properties
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
              
              <button
                onClick={() => navigate('/properties/map')}
                className="group bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-200"
              >
                <span className="flex items-center gap-2">
                  🗺️ Map View
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="text-4xl mb-4">🔥</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Real Reviews Only</h3>
            <p className="text-gray-600">
              No fake reviews, no sus landlords. Just straight facts from real tenants who've been there.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Deposit Transparency</h3>
            <p className="text-gray-600">
              See who actually got their deposit back. Because we're tired of landlords keeping our money.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Vibe Check Areas</h3>
            <p className="text-gray-600">
              Find your tribe! Filter by nightlife, safety, food scene, and student-friendly vibes.
            </p>
          </div>
        </div>

        {/* Role-specific Content */}
        {user?.role === 'owner' ? (
          <div className="mt-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-8 border border-blue-200/30">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Ready to List Your Property? 🏡
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                Join the transparent rental revolution. Build trust with honest listings.
              </p>
              <button
                onClick={() => navigate('/owner/dashboard')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Go to Dashboard ✨
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-16 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl p-8 border border-green-200/30">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Ready to Find Your Next Home? 🔍
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                Browse verified properties with real reviews from actual tenants.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/properties')}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Browsing 🏠
                </button>
                <button
                  onClick={() => navigate('/properties/map')}
                  className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 border border-gray-200"
                >
                  Explore Map 🗺️
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-lg mb-4">
            Join thousands of students and young professionals finding their perfect space
          </p>
          <div className="flex justify-center items-center gap-8 text-sm text-gray-400">
            <span>✨ Verified Reviews</span>
            <span>💯 Real Transparency</span>
            <span>🔥 No Cap Zone</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;