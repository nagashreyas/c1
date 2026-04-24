import React from 'react';
import { motion } from 'motion/react';
import { AppState } from './types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (state: AppState) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-cyan/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-[128px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-8">
          <Sparkles className="w-4 h-4 text-brand-cyan" />
          <span className="text-xs font-medium tracking-wider uppercase">AI-Powered Biology Platform</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 tracking-tight leading-none">
          Cell Biology <br />
          <span className="text-gradient">Learning</span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
          Master cell structure, organelles, and cellular processes with interactive 3D models, 
          AI-powered tutoring, and comprehensive study materials for AIML engineering students.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="px-8 py-4 bg-brand-cyan text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform"
          >
            Explore 3D Cell
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => onNavigate('tutor')}
            className="px-8 py-4 glass text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
          >
            Ask AI Tutor
          </button>
        </div>
      </motion.div>

      {/* Floating Elements (Visual Polish) */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-[15%] w-12 h-12 glass rounded-xl rotate-12"
      />
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-40 left-[10%] w-16 h-16 glass rounded-full opacity-50"
      />
    </div>
  );
}
