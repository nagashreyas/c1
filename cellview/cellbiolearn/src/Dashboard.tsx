import React from 'react';
import { motion } from 'motion/react';
import { AppState } from './types';
import { Box, BookOpen, BrainCircuit, CheckSquare, Menu } from 'lucide-react';

interface DashboardProps {
  onNavigate: (state: AppState) => void;
}

const CATEGORIES = [
  {
    id: 'explorer',
    title: '3D Cell Explorer',
    description: 'Interactive 3D models of cells with labeled organelles',
    icon: Box,
    color: 'text-brand-cyan',
    bgColor: 'bg-brand-cyan/10'
  },
  {
    id: 'notes',
    title: 'Study Notes',
    description: 'Comprehensive notes on cell structure and organelles',
    icon: BookOpen,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10'
  },
  {
    id: 'tutor',
    title: 'AI Tutor',
    description: 'Ask questions and get instant explanations',
    icon: BrainCircuit,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10'
  },
  {
    id: 'quiz',
    title: 'Practice Quiz',
    description: 'Test your knowledge with syllabus-based quizzes',
    icon: CheckSquare,
    color: 'text-brand-cyan',
    bgColor: 'bg-brand-cyan/10'
  }
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="min-h-screen bg-brand-bg p-6 md:p-12">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-cyan rounded-lg flex items-center justify-center">
            <Box className="w-5 h-5 text-black" />
          </div>
          <h2 className="text-2xl font-display font-bold">CellBio<span className="text-brand-cyan">Learn</span></h2>
        </div>
        <button className="p-2 glass rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-12">
          Everything You Need to <br />
          <span className="text-white/40">Master Cell Biology</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onNavigate(cat.id as AppState)}
              className="flex items-start gap-6 p-8 glass rounded-2xl text-left hover:bg-white/10 transition-colors group"
            >
              <div className={`p-4 rounded-xl ${cat.bgColor} ${cat.color} group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{cat.title}</h3>
                <p className="text-white/50 leading-relaxed">{cat.description}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
