import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: '10mb' }));

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, userContext } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY environment variable is not configured. Please add it to your Settings > Secrets panel." 
        });
      }

      // Initialize Google GenAI on the server side securely
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Construct a highly detailed system instruction incorporating user's real Firestore database context!
      const systemInstruction = `You are the "Nexus AI Companion", a beautifully designed, highly intelligent personal study assistant built for the Nexus Planner application.
Your mission is to help the user optimize their focus, study schedule, habits, and exam plans with highly personalized guidance.
The user's profile is:
- Name: ${userContext?.userFullName || 'Kashak'}
- Focus Time Completed: ${Math.floor((userContext?.focusTimeMinutes || 272) / 60)}h ${(userContext?.focusTimeMinutes || 272) % 60}m
- Streak: ${userContext?.studyStreakDays || 7} Days

Here is the user's real-time workspace data from Firebase Firestore:
---
TASKS (To-Do List):
${JSON.stringify(userContext?.tasks || [])}

CALENDAR EVENTS:
${JSON.stringify(userContext?.events || [])}

HABITS (Habit Tracker):
${JSON.stringify(userContext?.habits || [])}

JOURNAL ENTRIES:
${JSON.stringify(userContext?.journalEntries || [])}

REMINDERS:
${JSON.stringify(userContext?.reminders || [])}
---

CORE CAPABILITIES & RESPONDING RULES:
1. GROUND ON WORKSPACE DATA: You MUST customize every plan, task breakdown, habit tracker encouragement, and advice using their actual current tasks, calendar events, habits, and journal entries. DO NOT provide generic pre-written answers when real-time data is available.
2. PERSONALIZED PLANNING:
   - "Plan my day" / "Create a study plan": Generate a comprehensive study schedule. Suggest best times based on high-priority tasks and calendar deadlines.
   - "Summarize notes": Analyze notes, extract concise revision points, and list actionable next steps.
   - "Explain a topic": Provide intuitive explanations (supports both 'simple' mode and 'detailed math/theory' mode).
   - "Generate Quiz": Create flashcards, MCQs, or revision questions with beautiful, clear visual formatting.
   - "Optimize My Day": Analyze completed vs missed tasks, adjust the timeline, and suggest Pomodoro break intervals (e.g., 25 mins focus, 5 mins break).
3. DROPPING PRODUCTIVITY & ACHIEVEMENT CHEERING: If the user feels down, has low focus time, or missed tasks, motivate them using their ${userContext?.studyStreakDays || 7}-day study streak as leverage. "Greatness is made in quiet sessions. You have kept this up for ${userContext?.studyStreakDays || 7} days!" Celebrate small wins when tasks are completed.
4. CHAT HISTORY MEMORY: Use the provided chat history to ensure follow-up responses make sense and build on previous contexts.
5. BEAUTIFUL MD FORMATTING: Format every response elegantly with headers, bullets, italic quotes, bold highlights, emojis, tables, and spacing. This matches the beautiful, premium, organic theme (Nexus Planner) shown in the user interfaces.
`;

      // Map chat messages to role/parts format for GenAI contents parameter
      const formattedHistory = (history || []).map((h: any) => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      }));

      // Append current user message
      const contents = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini API server-side call failed:", err);
      res.status(500).json({ error: err.message || "An error occurred inside the Nexus AI engine." });
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
