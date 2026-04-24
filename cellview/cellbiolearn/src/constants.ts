import { CellData, Note, QuizQuestion } from './types';

export const ANIMAL_CELL: CellData = {
  type: 'animal',
  organelles: [
    {
      id: 'nucleus',
      name: 'Nucleus',
      description: 'The control center of the cell, containing genetic material (DNA). It controls all cell activities.',
      position: [0, 0, 0],
      color: '#7c5fff'
    },
    {
      id: 'mitochondria',
      name: 'Mitochondria',
      description: 'The powerhouse of the cell, where ATP (energy) is produced through cellular respiration.',
      position: [1.8, -0.5, 1.2],
      color: '#ff6b6b'
    },
    {
      id: 'golgi',
      name: 'Golgi Apparatus',
      description: 'Modifies, sorts, and packages proteins and lipids for secretion or delivery to other organelles.',
      position: [-1.5, -1.2, 0.8],
      color: '#ffa94d'
    },
    {
      id: 'er',
      name: 'Rough Endoplasmic Reticulum',
      description: 'A membrane network studded with ribosomes that synthesises and folds proteins.',
      position: [0.5, -1.8, -0.5],
      color: '#ffd166'
    },
    {
      id: 'smoothEr',
      name: 'Smooth Endoplasmic Reticulum',
      description: 'A tubular membrane network without ribosomes; makes lipids and detoxifies chemicals.',
      position: [-0.6, -1.4, 1.5],
      color: '#ffb86b'
    },
    {
      id: 'ribosome',
      name: 'Ribosomes',
      description: 'Tiny particles of RNA and protein that assemble amino acids into proteins.',
      position: [1.4, 1.0, -1.4],
      color: '#ffe066'
    },
    {
      id: 'peroxisome',
      name: 'Peroxisome',
      description: 'Breaks down fatty acids and detoxifies hydrogen peroxide using oxidative enzymes.',
      position: [-1.7, -0.2, 1.4],
      color: '#fcc419'
    },
    {
      id: 'centrosome',
      name: 'Centrosome',
      description: 'A pair of perpendicular centrioles that organise microtubules during cell division.',
      position: [0.1, 1.9, 1.3],
      color: '#a5d8ff'
    },
    {
      id: 'cytoskeleton',
      name: 'Cytoskeleton',
      description: 'A network of microtubules and filaments that gives the cell shape and enables transport.',
      position: [1.7, -1.3, -1.0],
      color: '#74c0fc'
    },
    {
      id: 'lysosome',
      name: 'Lysosome',
      description: 'Contains digestive enzymes to break down waste materials and cellular debris.',
      position: [-1.8, 1.5, -0.5],
      color: '#e056fd'
    },
    {
      id: 'vesicle-1',
      name: 'Vesicle',
      description: 'Small membrane-bound sacs that move products into, out of, and within a cell.',
      position: [1.2, 1.8, 0.5],
      color: '#dfe6e9'
    },
    {
      id: 'vesicle-2',
      name: 'Vesicle',
      description: 'Small membrane-bound sacs that move products into, out of, and within a cell.',
      position: [-0.8, -1.5, -1.5],
      color: '#b2bec3'
    },
    {
      id: 'vesicle-3',
      name: 'Vesicle',
      description: 'Small membrane-bound sacs that move products into, out of, and within a cell.',
      position: [2.2, 0.2, -0.8],
      color: '#dfe6e9'
    }
  ]
};

export const PLANT_CELL: CellData = {
  type: 'plant',
  organelles: [
    // Plants typically lack centrosomes — filter that out from the shared list
    ...ANIMAL_CELL.organelles.filter((o) => o.id !== 'centrosome'),
    {
      id: 'plasmodesmata',
      name: 'Plasmodesmata',
      description: 'Tiny channels through the cell wall that connect neighbouring plant cells.',
      position: [0, 2.6, 0],
      color: '#a9e34b'
    },
    {
      id: 'chloroplast',
      name: 'Chloroplast',
      description: 'The site of photosynthesis, converting light energy into chemical energy (glucose).',
      position: [1.8, 1.2, 0],
      color: '#51cf66'
    },
    {
      id: 'vacuole',
      name: 'Large Central Vacuole',
      description: 'Stores water, nutrients, and waste products; maintains turgor pressure in plant cells.',
      position: [-1, 0.5, -1.5],
      color: '#74c0fc'
    },
    {
      id: 'cellwall',
      name: 'Cell Wall',
      description: 'A rigid outer layer made of cellulose that provides structural support and protection.',
      position: [0, 0, -2.5],
      color: '#69db7c'
    }
  ]
};

export const STUDY_NOTES: Note[] = [
  {
    id: '1',
    title: 'Introduction to Cell Biology',
    category: 'Unit 1',
    content: `🔹 What is a Cell?
• The cell is the basic structural and functional unit of life.
• All living organisms are made of cells.

🔹 Cell Theory
1. All living organisms are composed of cells.
2. Cell is the basic unit of life.
3. All cells arise from pre-existing cells.

⸻

🔹 Types of Cells

1. Prokaryotic Cells
• No nucleus (DNA free in cytoplasm).
• No membrane-bound organelles.
• Example: Bacteria.

2. Eukaryotic Cells
• True nucleus present.
• Membrane-bound organelles.
• Example: Plant & Animal cells.

⸻

🔹 Cell Structure (Important for Exams)

1. Cell Membrane
• Semi-permeable membrane made of phospholipid bilayer.
• Function: Controls entry/exit of substances.

2. Nucleus
• Contains DNA and controls cell activities.

3. Cytoplasm
• Jelly-like fluid; site of metabolic reactions.

🔹 Differences: Plant vs Animal Cells
• Cell Wall: Present in Plant, Absent in Animal.
• Chloroplast: Present in Plant, Absent in Animal.
• Vacuole: Large in Plant, Small/Absent in Animal.`
  },
  {
    id: '2',
    title: 'Biomolecules: Proteins and Enzymes',
    category: 'Unit 2',
    content: `🔹 What are Biomolecules?
• Organic molecules in living organisms: Carbohydrates, Lipids, Proteins, Nucleic acids.

⸻

🔹 Proteins
• Structure: Made of amino acids linked by peptide bonds.
• Levels of Structure:
  1. Primary – sequence of amino acids.
  2. Secondary – alpha helix / beta sheet.
  3. Tertiary – 3D structure.
  4. Quaternary – multiple chains.

🔹 Functions of Proteins
• Structural (collagen), Transport (hemoglobin), Defense (antibodies), Hormones (insulin), Enzymes (catalysis).

⸻

🔹 Enzymes (VERY IMPORTANT)
• Definition: Biological catalysts that speed up reactions.
• Properties: Highly specific, work at optimum temp & pH, not consumed in reactions.

🔹 Mechanism of Enzyme Action
• Lock and Key Model: Enzyme fits substrate like a lock and key.
• Induced Fit Model: Enzyme changes shape to fit substrate.

🔹 Factors Affecting Enzyme Activity
• Temperature, pH, Substrate/Enzyme concentration.

🔹 Enzyme Inhibition
• Competitive: Inhibitor competes with substrate.
• Non-competitive: Binds elsewhere.`
  },
  {
    id: '3',
    title: 'Metabolism and Energy Transfer',
    category: 'Unit 3',
    content: `🔹 What is Metabolism?
• Sum of all chemical reactions in the body.

1. Catabolism: Breakdown of molecules, releases energy (e.g., Glucose → CO₂ + energy).
2. Anabolism: Building complex molecules, requires energy.

⸻

🔹 ATP (Energy Currency)
• Adenosine Triphosphate: Stores and transfers energy.
• Reaction: ATP → ADP + Energy.

🔹 Cellular Respiration
1. Glycolysis: Occurs in cytoplasm; Glucose → Pyruvate.
2. Krebs Cycle: Occurs in mitochondria; produces CO₂, ATP.
3. Electron Transport Chain: Produces large amount of ATP.

⸻

🔹 Photosynthesis (in plants)
• Occurs in chloroplast; converts light energy → chemical energy.

🔹 Key Points for Exams
• ATP is main energy carrier.
• Enzymes control metabolism.
• Mitochondria = energy production.`
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which organelle is known as the "Powerhouse of the Cell"?',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Apparatus'],
    correctAnswer: 1,
    explanation: 'Mitochondria produce ATP through cellular respiration, providing energy for the cell.'
  },
  {
    id: 'q2',
    question: 'What is the primary function of the Chloroplast in plant cells?',
    options: ['Protein Synthesis', 'Waste Disposal', 'Photosynthesis', 'DNA Storage'],
    correctAnswer: 2,
    explanation: 'Chloroplasts capture light energy to produce glucose through photosynthesis.'
  },
  {
    id: 'q3',
    question: 'Which of the following is a characteristic of Prokaryotic cells?',
    options: ['Presence of a Nucleus', 'Membrane-bound organelles', 'Circular DNA', 'Large size'],
    correctAnswer: 2,
    explanation: 'Prokaryotes have circular DNA and lack a membrane-bound nucleus.'
  }
];
