import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QUIZ_QUESTIONS } from './constants';
import { ArrowLeft, CheckCircle2, XCircle, RefreshCcw, Trophy } from 'lucide-react';

interface QuizProps {
  onBack: () => void;
}

export default function Quiz({ onBack }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === QUIZ_QUESTIONS[currentQuestion].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full glass p-12 rounded-3xl text-center"
        >
          <div className="w-24 h-24 bg-brand-cyan/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Trophy className="w-12 h-12 text-brand-cyan" />
          </div>
          <h2 className="text-4xl font-display font-bold mb-2">Quiz Complete!</h2>
          <p className="text-white/60 mb-8">Great job on finishing the Engineering Biology quiz.</p>
          
          <div className="text-6xl font-display font-bold text-brand-cyan mb-12">
            {score} / {QUIZ_QUESTIONS.length}
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={resetQuiz}
              className="w-full py-4 bg-brand-cyan text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              <RefreshCcw className="w-5 h-5" />
              Try Again
            </button>
            <button 
              onClick={onBack}
              className="w-full py-4 glass text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen bg-brand-bg p-6 md:p-12 flex flex-col items-center">
      <header className="w-full max-w-3xl flex justify-between items-center mb-12">
        <button onClick={onBack} className="p-2 glass rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-sm font-bold text-white/40 uppercase tracking-widest">
          Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
        </div>
      </header>

      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full mb-12 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            className="h-full bg-brand-cyan"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-display font-bold leading-tight">{question.question}</h2>

            <div className="grid grid-cols-1 gap-4">
              {question.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === question.correctAnswer;
                const showResult = isAnswered;

                let stateClasses = "glass hover:bg-white/5";
                if (showResult) {
                  if (isCorrect) stateClasses = "bg-green-500/20 border-green-500/50 text-green-400";
                  else if (isSelected) stateClasses = "bg-red-500/20 border-red-500/50 text-red-400";
                  else stateClasses = "opacity-40 glass";
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleOptionClick(idx)}
                    className={`w-full p-6 rounded-2xl text-left transition-all flex items-center justify-between border ${stateClasses}`}
                  >
                    <span className="text-lg font-medium">{option}</span>
                    {showResult && isCorrect && <CheckCircle2 className="w-6 h-6" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6" />}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 glass rounded-2xl border-l-4 border-brand-cyan"
              >
                <p className="text-white/70 italic leading-relaxed">
                  <span className="font-bold text-brand-cyan not-italic mr-2">Explanation:</span>
                  {question.explanation}
                </p>
                <button 
                  onClick={handleNext}
                  className="mt-6 px-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform"
                >
                  {currentQuestion === QUIZ_QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
