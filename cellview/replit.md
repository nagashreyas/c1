# CellBioLearn

Interactive 3D cell biology learning platform with 3D models, AI tutoring, and study materials for engineering students.

## Tech Stack
- React 19 + TypeScript
- Vite 6 (dev/build)
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Three Fiber + drei + three.js (3D scenes)
- Motion (animations)
- Google GenAI (`@google/genai`) for the AI Tutor (Gemini)

## Project Layout
- `cellbiolearn/` – Vite React app
  - `src/` – components (`App.tsx`, `LandingPage.tsx`, `Dashboard.tsx`, `CellExplorer.tsx`, `StudyNotes.tsx`, `Quiz.tsx`, `AITutor.tsx`, `gemini.ts`, etc.)
  - `vite.config.ts` – dev server bound to `0.0.0.0:5000` with `allowedHosts: true` for the Replit proxy preview
  - `index.html` – Vite entry point

## Replit Setup
- Workflow `Start application` runs `cd cellbiolearn && npm run dev` and serves the frontend on port 5000.
- Deployment is configured as a static site:
  - Build: `cd cellbiolearn && npm install && npm run build`
  - Public dir: `cellbiolearn/dist`

## Environment Variables
- `GEMINI_API_KEY` – optional. Required only for the AI Tutor feature; the rest of the app works without it. Vite reads it via `loadEnv` and exposes it as `process.env.GEMINI_API_KEY`.
