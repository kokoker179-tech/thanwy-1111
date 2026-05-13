import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  app.post("/api/chat", async (req, res) => {
    const { message } = req.body;
  
    if (!process.env.GEMINI_API_KEY) {
       res.status(500).json({ error: "Gemini API key is missing" });
       return;
    }
  
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a helpful assistant for a graduation ceremony at "كنيسه الملاك روفائيل". 
          
          General Information:
          - Event Description: لم يتم كتابة وصف حتي الآن
          - Date: لم يحدد بعد
          - Location: لم يحدد بعد
          - Time: لم يحدد بعد
  
          Instructions:
          - Please respond naturally and diversify your responses.
          - Use the General Information provided to answer user questions about the graduation ceremony.
          - IMPORTANT: If the user asks about the website owner, developer, who programmed the site, or similar questions, answer that the developer is "kerolos sfwat" and mention that he is a very skilled and professional programmer.
          User said: ${message}`,
      });
  
      res.json({ text: response.text });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Failed to communicate with AI" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
