import React, { useState } from 'react';
import { AppState } from './types';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import CellExplorer from './CellExplorer';
import StudyNotes from './StudyNotes';
import Quiz from './Quiz';
import AITutor from './AITutor';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [state, setState] = useState<AppState>('landing');

  const renderContent = () => {
    switch (state) {
      case 'landing':
        return <LandingPage onNavigate={setState} />;
      case 'dashboard':
        return <Dashboard onNavigate={setState} />;
      case 'explorer':
        return <CellExplorer onBack={() => setState('dashboard')} />;
      case 'notes':
        return <StudyNotes onBack={() => setState('dashboard')} />;
      case 'quiz':
        return <Quiz onBack={() => setState('dashboard')} />;
      case 'tutor':
        return <AITutor onBack={() => setState('dashboard')} />;
      default:
        return <LandingPage onNavigate={setState} />;
    }
  };

  return (
    <main className="min-h-screen bg-brand-bg text-white selection:bg-brand-cyan selection:text-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
