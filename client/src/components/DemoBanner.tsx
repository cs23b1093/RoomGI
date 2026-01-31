import React from 'react';
import { motion } from 'framer-motion';

export const DemoBanner: React.FC = () => {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 text-center relative overflow-hidden"
    >
      <motion.div
        animate={{ x: [-20, 20, -20] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-white/10 transform -skew-x-12"
      />
      <div className="relative z-10 flex items-center justify-center gap-2">
        <motion.span
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-lg"
        >
          🚀
        </motion.span>
        <span className="font-semibold">
          Hackathon Demo Mode - Real-time features active!
        </span>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2 h-2 bg-green-400 rounded-full"
        />
      </div>
    </motion.div>
  );
};