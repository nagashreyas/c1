export interface Organelle {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
  color: string;
}

export interface CellData {
  type: 'animal' | 'plant';
  organelles: Organelle[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type AppState = 'landing' | 'dashboard' | 'explorer' | 'notes' | 'quiz' | 'tutor';
