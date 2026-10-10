
const express = require("express");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (!API_KEY) {
  console.error("GEMINI_API_KEY .env file madhe nahi!");
  process.exit(1);
}

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

app.use(
  "/api/",
  rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false
  })
);

// Existing frontend files serve karne
app.use(express.static(__dirname));

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, instructions } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Please enter a question."
      });
    }

    const validMessages = messages
      .filter(
        (m) =>
          m &&
          ["user", "assistant"].includes(m.role) &&
          typeof m.content === "string" &&
          m.content.trim()
      )
      .slice(-12)
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content.slice(0, 6000) }]
      }));

    if (
      !validMessages.length ||
      validMessages[validMessages.length - 1].role !== "user"
    ) {
      return res.status(400).json({
        error: "A valid user question is required."
      });
    }

    const systemPrompt =
      typeof instructions === "string"
        ? instructions.slice(0, 4000)
        : "You are StudySpark AI, a helpful educational assistant. Explain topics simply with examples.";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: validMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200
          }
        }),
        signal: AbortSignal.timeout(45000)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini error status:", response.status);
console.error(JSON.stringify(data, null, 2));

      if (response.status === 429) {
        return res.status(429).json({
          error: "AI usage limit reached. Please try again later."
        });
      }

      return res.status(502).json({
        error: "Gemini service error. Please try again."
      });
    }

    const reply = (data.candidates?.[0]?.content?.parts || [])
      .map((part) => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      return res.status(502).json({
        error: "AI returned no answer. Please try again."
      });
    }

    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error.message);

    res.status(500).json({
      error: "Unable to connect to AI. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`StudySpark AI running at http://localhost:${PORT}`);
});