import React, { useState } from 'react';
import { motion } from 'motion/react';
import { STUDY_NOTES } from './constants';
import { ArrowLeft, Book, ChevronRight } from 'lucide-react';

interface StudyNotesProps {
  onBack: () => void;
}

export default function StudyNotes({ onBack }: StudyNotesProps) {
  const [selectedNote, setSelectedNote] = useState(STUDY_NOTES[0]);

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <header className="p-6 border-b border-white/10 flex items-center gap-4">
        <button onClick={onBack} className="p-2 glass rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-display font-bold">Study <span className="text-brand-cyan">Notes</span></h1>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-80 border-r border-white/10 p-6 overflow-y-auto bg-brand-card/50">
          <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Engineering Biology Syllabus</h2>
          <div className="space-y-2">
            {STUDY_NOTES.map(note => (
              <button
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${selectedNote.id === note.id ? 'bg-brand-cyan text-black font-bold' : 'glass hover:bg-white/10 text-white/60'}`}
              >
                <div className="flex items-center gap-3">
                  <Book className="w-4 h-4" />
                  <span className="text-sm text-left">{note.title}</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto">
          <motion.div
            key={selectedNote.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-brand-cyan/10 text-brand-cyan text-xs font-bold uppercase tracking-wider mb-4">
              {selectedNote.category}
            </span>
            <h2 className="text-4xl font-display font-bold mb-8">{selectedNote.title}</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-white/70 leading-relaxed whitespace-pre-wrap">
                {selectedNote.content}
              </p>
            </div>
            
            <div className="mt-12 p-8 glass rounded-2xl border-l-4 border-brand-cyan">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-brand-cyan" />
                Key Takeaway
              </h4>
              <p className="text-white/60 italic">
                Understanding these fundamental concepts is crucial for 4th-semester engineering students specializing in AIML and Biotechnology.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
