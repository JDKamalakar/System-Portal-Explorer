import { GoogleGenAI } from "@google/genai";

export const getPortalExplanation = async (portalType: string): Promise<string> => {
  try {
    // Initialize inside the function to ensure process.env.API_KEY is accessed at runtime
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain how the web browser triggers a system-level "${portalType}" dialog. 
      Mention technologies like XDG Desktop Portals for Linux, macOS permissions, and Windows API wrappers. 
      Keep it professional, technical, and concise.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "I'm sorry, I couldn't generate an explanation at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI service. Please ensure API_KEY is configured.";
  }
};

export const chatWithPortalExpert = async (message: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: "You are a world-class systems engineer specializing in Web APIs and Desktop Portals (XDG, Wayland, macOS, Windows). Explain complex system interaction concepts simply.",
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to get response from AI.";
  }
};
