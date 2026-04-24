import { GoogleGenAI } from "@google/genai";

// Replit AI Integrations: works without your own API key when both env vars are set
// on the workspace. The integrations endpoint is server-side only (localhost), so the
// browser reaches it through the Vite proxy at `/_ai/gemini`.
const aiIntegrationsKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "";
const aiIntegrationsConfigured = !!process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;
const userKey = process.env.GEMINI_API_KEY || "";

const useAiIntegrations = aiIntegrationsConfigured && !!aiIntegrationsKey;

const ai = new GoogleGenAI(
  useAiIntegrations
    ? {
        apiKey: aiIntegrationsKey,
        httpOptions: {
          apiVersion: "",
          baseUrl:
            (typeof window !== "undefined" ? window.location.origin : "") +
            "/_ai/gemini",
        },
      }
    : { apiKey: userKey }
);

export async function askTutor(question: string) {
  if (!useAiIntegrations && !userKey) {
    return "The AI Tutor is not configured yet. Please add a Gemini API key to enable it.";
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: question,
      config: {
        maxOutputTokens: 8192,
        systemInstruction: `You are an expert Cell Biology Tutor for engineering students.
        Your goal is to explain complex biological concepts in a way that is easy to understand,
        often using analogies related to engineering, computer science, or AIML.
        Keep your answers concise, engaging, and professional.
        If the user asks about something unrelated to biology or engineering, politely redirect them to the subject.`,
      },
    });
    return response.text || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while connecting to the AI Tutor. Please try again in a moment.";
  }
}
