const express = require("express");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const JUDGE0_URL = (
  process.env.JUDGE0_API_URL || "https://ce.judge0.com"
).replace(/\/+$/, "");

const JUDGE0_AUTH_TOKEN = process.env.JUDGE0_AUTH_TOKEN;

app.disable("x-powered-by");
app.use(express.json({ limit: "64kb" }));

// API rate limit
app.use(
  "/api/",
  rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
      error: "Too many requests. Please try again after one minute."
    }
  })
);

// Serve existing frontend files
app.use(express.static(__dirname));

// Judge0 language IDs
const LANGUAGE_IDS = {
  c: 50,
  cpp: 54,
  java: 62,
  python: 71,
  javascript: 63,
  php: 68
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Judge0 API request helper
async function judge0Request(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(JUDGE0_AUTH_TOKEN
      ? { "X-Auth-Token": JUDGE0_AUTH_TOKEN }
      : {}),
    ...options.headers
  };

  return fetch(url, {
    ...options,
    headers,
    signal: AbortSignal.timeout(10000)
  });
}

// =====================================
// GEMINI AI - EXPLAIN CODE / AI CHAT
// =====================================
app.post("/api/chat", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(503).json({
        error: "Gemini API key is missing. Please configure GEMINI_API_KEY in .env."
      });
    }

    const { messages, instructions } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Please enter a question."
      });
    }

    const validMessages = messages
      .filter(
        (message) =>
          message &&
          ["user", "assistant"].includes(message.role) &&
          typeof message.content === "string" &&
          message.content.trim()
      )
      .slice(-12)
      .map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content.slice(0, 6000) }]
      }));

    if (
      validMessages.length === 0 ||
      validMessages[validMessages.length - 1].role !== "user"
    ) {
      return res.status(400).json({
        error: "A valid user question is required."
      });
    }

    const systemPrompt =
      typeof instructions === "string"
        ? instructions.slice(0, 4000)
        : "You are StudySpark AI, a helpful educational assistant. Explain programming concepts simply with examples.";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        MODEL
      )}:generateContent`,
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
      console.error("Gemini API error:", response.status);

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

    return res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error.message);

    return res.status(500).json({
      error: "Unable to connect to AI. Please try again."
    });
  }
});

// =====================================
// RUN CODE - JUDGE0 EXECUTION API
// =====================================
app.post("/api/run", async (req, res) => {
  try {
    const { language, code, stdin = "" } = req.body || {};

    if (
      typeof language !== "string" ||
      !Object.prototype.hasOwnProperty.call(LANGUAGE_IDS, language)
    ) {
      return res.status(400).json({
        error:
          "Unsupported language. C, C++, Java, Python, JavaScript and PHP are supported."
      });
    }

    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        error: "Please enter some code before running it."
      });
    }

    if (code.length > 20000) {
      return res.status(413).json({
        error: "Code must not exceed 20,000 characters."
      });
    }

    if (typeof stdin !== "string" || stdin.length > 10000) {
      return res.status(413).json({
        error: "Input must not exceed 10,000 characters."
      });
    }

    // Submit code to Judge0
    const createResponse = await judge0Request(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
      {
        method: "POST",
        body: JSON.stringify({
          source_code: code,
          language_id: LANGUAGE_IDS[language],
          stdin,
          cpu_time_limit: 3,
          wall_time_limit: 8,
          memory_limit: 128000
        })
      }
    );

    const created = await createResponse.json();

    if (!createResponse.ok || !created.token) {
      console.error(
        "Judge0 submission error:",
        createResponse.status,
        created
      );

      return res.status(502).json({
        error:
          "Could not submit code. The execution service may be unavailable."
      });
    }

    // Check execution result
    let result = null;

    for (let attempt = 0; attempt < 20; attempt++) {
      await sleep(1000);

      const resultResponse = await judge0Request(
        `${JUDGE0_URL}/submissions/${encodeURIComponent(
          created.token
        )}?base64_encoded=false&fields=stdout,stderr,compile_output,message,status,time,memory`
      );

      if (!resultResponse.ok) {
        throw new Error(
          `Judge0 returned HTTP ${resultResponse.status}`
        );
      }

      result = await resultResponse.json();

      // Status 1 = In Queue, 2 = Processing
      if (result.status && ![1, 2].includes(result.status.id)) {
        break;
      }
    }

    if (!result || !result.status || [1, 2].includes(result.status.id)) {
      return res.status(504).json({
        error: "Execution took too long. Please try again."
      });
    }

    return res.json({
      output: result.stdout || "",
      stderr: result.stderr || "",
      compileOutput: result.compile_output || "",
      message: result.message || "",
      status: result.status.description || "Completed",
      time: result.time || null,
      memory: result.memory || null
    });
  } catch (error) {
    console.error("Code execution error:", error.message);

    return res.status(502).json({
      error:
        "Code execution service is unavailable. Check your internet connection and try again."
    });
  }
});

// =====================================
// START SERVER
// =====================================
app.listen(PORT, () => {
  console.log(`StudySparkleAI running at http://localhost:${PORT}`);
  console.log("Code execution API: /api/run");
  console.log("AI explanation API: /api/chat");

  if (!API_KEY) {
    console.warn(
      "Warning: GEMINI_API_KEY is missing. AI chat will not work until configured."
    );
  }
});