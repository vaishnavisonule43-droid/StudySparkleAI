"use strict";

const API_URL = "/api/chat";

const form = document.getElementById("chatForm");
const questionInput = document.getElementById("question");
const messages = document.getElementById("messages");
const welcomeScreen = document.getElementById("welcomeScreen");
const typingRow = document.getElementById("typingRow");
const sendBtn = document.getElementById("sendBtn");
const sendIcon = document.getElementById("sendIcon");
const charCount = document.getElementById("charCount");
const errorNotice = document.getElementById("errorNotice");
const connectionStatus = document.getElementById("connectionStatus");
const sidebar = document.getElementById("sidebar");

let conversation = [];
let isWaiting = false;
let requestController = null;

/* =========================================
   SYSTEM INSTRUCTIONS
========================================= */

const SYSTEM_INSTRUCTIONS = `
You are StudySpark AI, an intelligent, friendly, accurate, and helpful AI assistant.

Your goal is to provide clear, natural, well-structured answers similar in readability to a modern AI assistant.

GENERAL RULES
- Answer the user's actual question directly.
- Explain concepts in a clear and logical order.
- Match the requested language, tone, length, and level.
- Use simple explanations for beginners when needed.
- Give examples when they improve understanding.
- Avoid unnecessary introductions and repeated information.
- Ask a clarifying question only when necessary.
- Never invent facts, sources, URLs, calculations, or results.
- Be honest about uncertainty and limitations.

MARKDOWN FORMATTING
Use valid Markdown to make answers easy to read.

Use:
- # for a main heading when appropriate.
- ## for major sections.
- ### for subsections.
- **Bold** for important terms.
- *Italic* for emphasis.
- Bullet lists for related points.
- Numbered lists for ordered steps.
- Markdown tables for useful comparisons.
- Horizontal rules when helpful.
- Inline code for variables, commands, and functions.
- Fenced code blocks with the correct language identifier.
- Blockquotes when useful.
- LaTeX notation for mathematical formulas when appropriate.

Formatting requirements:
- Keep paragraphs readable and reasonably short.
- Leave blank lines between sections.
- Do not put the entire answer in one paragraph.
- Do not use headings unnecessarily.
- Do not put normal explanations inside code blocks.
- Avoid excessive emojis.
- Use tables only when they improve clarity.
- Use correct Markdown syntax.

LANGUAGE
- Respond in the language the user uses or requests.
- For Marathi questions, answer naturally in Marathi.
- For Marathi-English questions, natural Marathi-English is acceptable.
- For simple English requests, use easy English.
- Preserve technical terms and programming keywords.
- Explain difficult technical words in simple language when helpful.

EDUCATIONAL QUESTIONS
When appropriate, explain:
1. Definition.
2. Simple meaning.
3. How it works.
4. Example.
5. Important points.
6. Advantages, disadvantages, or applications when relevant.

Teach step by step.
Explain why a concept is important, not only what it means.
Use familiar examples and analogies.
Do not force the same structure onto every answer.

PROGRAMMING QUESTIONS
Support C, C++, Java, Python, JavaScript, PHP, SQL, HTML, CSS, and other programming languages.

When a complete program is requested, provide:
- Complete code in a correctly labelled code block.
- Sample output when useful.
- Step-by-step explanation when requested or appropriate.

Programming rules:
- Use correct syntax and indentation.
- Include necessary setup, imports, and headers.
- Respect the requested language and environment.
- Keep beginner examples simple.
- Explain errors and fixes clearly.
- Do not claim code was tested unless it actually was.
- When modifying existing code, preserve unrelated working features.
- Explain important lines when the user is learning.

MATHEMATICS
- Identify given values and what must be calculated.
- Show the formula when appropriate.
- Substitute values correctly.
- Solve step by step.
- Include units when relevant.
- Check calculations and signs.
- Use readable mathematical notation.
- Use LaTeX for equations when appropriate.
- Do not invent missing values.

SCIENCE AND TECHNICAL SUBJECTS
- Define concepts accurately.
- Explain how they work.
- Explain technical terms.
- Include formulas, units, examples, and applications when useful.
- Distinguish facts from assumptions.

TABLES AND COMPARISONS
- Use clear column headings.
- Keep table cells concise.
- Use consistent terminology.
- Never invent missing values.
- Use bullet lists instead when a table would be difficult to read.

STUDY NOTES AND EXAM PREPARATION
Provide simple notes, definitions, questions and answers, MCQs, viva questions, revision summaries, and worked examples when requested.
Use easy language and clear points.
Match the requested exam marks or length.
Do not guarantee exam marks or claim questions will definitely appear.

WRITING AND TRANSLATION
Help with grammar, rewriting, reports, assignments, emails, summaries, and translations.
Preserve the intended meaning and follow the requested tone and format.
Do not add unsupported information.

CURRENT INFORMATION
- Do not claim to have searched the internet unless a search was performed.
- Do not invent citations or references.
- Mention uncertainty when information cannot be verified.
- Use provided documents and code when relevant.

CONVERSATION CONTEXT
- Use relevant earlier messages available in the conversation.
- Preserve requirements when revising an answer.
- Do not ask again for information already provided.
- Simplify when requested and expand when asked for detail.

FINAL QUALITY
Before answering, check accuracy, clarity, structure, language, calculations, and formatting.
Adapt the answer to the user's question instead of forcing one template on every response.

The final answer should be natural, accurate, helpful, and easy to read.
`;

/* =========================================
   SAFE MARKDOWN RENDERING
========================================= */

// Convert Markdown to safe HTML.
// If the libraries are unavailable, use plain text.

function renderMarkdown(text) {
    try {
        if (
            !window.marked ||
            typeof window.marked.parse !== "function" ||
            !window.DOMPurify
        ) {
            return null;
        }

        // Convert Markdown into HTML
        const rawHTML = window.marked.parse(text);

        // Make HTML safe
        const safeHTML = window.DOMPurify.sanitize(rawHTML);

        // Create temporary container
        const container = document.createElement("div");
        container.innerHTML = safeHTML;

        // Add colorful code highlighting
        if (window.hljs) {
            container.querySelectorAll("pre code").forEach((block) => {
                window.hljs.highlightElement(block);
            });
        }

        return container.innerHTML;

    } catch (error) {
        console.error("Markdown error:", error);
        return null;
    }
}

/* =========================================
   ADD CHAT MESSAGE
========================================= */

function addMessage(role, text, animate = false) {
  const message = document.createElement("article");
  message.className = `message ${role}`;

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = role === "user" ? "You" : "✦";

  const content = document.createElement("div");
  content.className = "message-content";

  const name = document.createElement("div");
  name.className = "message-name";
  name.textContent = role === "user" ? "You" : "StudySpark AI";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";

  content.append(name, bubble);
  message.append(avatar, content);
  messages.appendChild(message);

  // User messages remain plain text.
  // Assistant messages support safe Markdown.


if (animate && role === "assistant") {
  typeText(bubble, text);
} else if (role === "assistant") {
  const html = renderMarkdown(text);

  if (html !== null) {
    bubble.innerHTML = html;
  } else {
    bubble.textContent = text;
  }
} else {
  bubble.textContent = text;
}



  // Copy Answer button
  if (role === "assistant") {
    const tools = document.createElement("div");
    tools.className = "message-tools";

    const copyButton = document.createElement("button");
    copyButton.className = "message-tool";
    copyButton.type = "button";
    copyButton.textContent = "Copy answer";

    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(text);

        copyButton.textContent = "Copied!";

        setTimeout(() => {
          copyButton.textContent = "Copy answer";
        }, 1600);
      } catch (error) {
        console.error("Copy failed:", error);
        copyButton.textContent = "Copy unavailable";
      }
    });

    tools.appendChild(copyButton);
    content.appendChild(tools);
  }

  scrollToLatest();

  return bubble;
}

/* =========================================
   ANIMATED AI RESPONSE
========================================= */

// Reveal the response as plain text first.
// Render Markdown only after the complete response is shown.

function typeText(element, text) {
  let index = 0;
  const step = 3;

  function renderChunk() {
    index = Math.min(index + step, text.length);

    // Show plain text during animation.
    element.textContent = text.slice(0, index);

    scrollToLatest();

    if (index < text.length) {
      requestAnimationFrame(renderChunk);
      return;
    }

    // Render Markdown after the complete response.
    const html = renderMarkdown(text);

    if (html !== null) {
      element.innerHTML = html;
    } else {
      element.textContent = text;
    }

    scrollToLatest();
  }

  renderChunk();
}


/* =========================================
   SCROLL TO LATEST MESSAGE
========================================= */

function scrollToLatest() {
  requestAnimationFrame(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth"
    });
  });
}

/* =========================================
   ERROR HANDLING
========================================= */

function showError(message) {
  errorNotice.textContent = message;
  errorNotice.hidden = false;
}

function hideError() {
  errorNotice.textContent = "";
  errorNotice.hidden = true;
}

/* =========================================
   WAITING / LOADING STATE
========================================= */

function setWaiting(waiting) {
  isWaiting = waiting;

  typingRow.hidden = !waiting;
  sendBtn.disabled = waiting;
  questionInput.disabled = waiting;

  sendIcon.textContent = waiting ? "…" : "↑";

  connectionStatus.textContent = waiting
    ? "Thinking..."
    : "AI assistant";

  scrollToLatest();
}

/* =========================================
   INPUT CHARACTER COUNT
========================================= */

function updateCharCount() {
  charCount.textContent = `${questionInput.value.length} / 6000`;
}

/* =========================================
   AUTO RESIZE INPUT
========================================= */

function resizeInput() {
  questionInput.style.height = "auto";

  questionInput.style.height =
    Math.min(questionInput.scrollHeight, 170) + "px";
}

/* =========================================
   START NEW CHAT
========================================= */

function startNewChat() {
  if (isWaiting && requestController) {
    requestController.abort();
  }

  conversation = [];

  messages.replaceChildren();

  welcomeScreen.hidden = false;

  questionInput.value = "";

  updateCharCount();
  resizeInput();
  hideError();
  setWaiting(false);

  questionInput.focus();

  sidebar.classList.remove("open");
}

/* =========================================
   SEND QUESTION TO AI
========================================= */

async function askAI(question) {
  const cleanedQuestion = question.trim();

  if (!cleanedQuestion || isWaiting) {
    return;
  }

  hideError();

  welcomeScreen.hidden = true;

  // Display the user's question.
  addMessage("user", cleanedQuestion);

  questionInput.value = "";

  updateCharCount();
  resizeInput();

  // Add the question to conversation history.
  conversation.push({
    role: "user",
    content: cleanedQuestion
  });

  // Keep the conversation history limited.
  conversation = conversation.slice(-20);

  requestController = new AbortController();

  setWaiting(true);

  try {
    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        instructions: SYSTEM_INSTRUCTIONS,
        messages: conversation
      }),

      signal: requestController.signal
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.error ||
        "The AI service could not answer right now."
      );
    }

    if (
      typeof data.reply !== "string" ||
      !data.reply.trim()
    ) {
      throw new Error(
        "The AI returned an empty answer. Please try again."
      );
    }

    // Save the AI response in conversation history.
    conversation.push({
      role: "assistant",
      content: data.reply
    });

    // Display the response with animation and Markdown.
    addMessage("assistant", data.reply, true);

  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }

    console.error("StudySpark AI request failed:", error);

    showError(
      error.message ||
      "Unable to connect to the AI service. Check your connection and try again."
    );

    // Remove the failed user question from history.
    conversation.pop();

  } finally {
    requestController = null;

    setWaiting(false);

    questionInput.focus();
  }
}

/* =========================================
   CHAT FORM SUBMISSION
========================================= */

form.addEventListener("submit", (event) => {
  event.preventDefault();

  askAI(questionInput.value);
});

/* =========================================
   INPUT EVENTS
========================================= */

questionInput.addEventListener("input", () => {
  updateCharCount();
  resizeInput();
});

questionInput.addEventListener("keydown", (event) => {
  if (
    event.key === "Enter" &&
    !event.shiftKey
  ) {
    event.preventDefault();
    form.requestSubmit();
  }
});

/* =========================================
   SUGGESTED PROMPTS
========================================= */

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    questionInput.value = button.dataset.prompt;

    updateCharCount();
    resizeInput();

    form.requestSubmit();
  });
});

/* =========================================
   NEW CHAT BUTTON
========================================= */

document
  .getElementById("newChatBtn")
  .addEventListener("click", startNewChat);

/* =========================================
   CLEAR CHAT BUTTON
========================================= */

document
  .getElementById("clearChatBtn")
  .addEventListener("click", () => {
    if (!messages.children.length) {
      startNewChat();
      return;
    }

    if (
      confirm(
        "Clear this conversation and start a new one?"
      )
    ) {
      startNewChat();
    }
  });

/* =========================================
   ASSISTANT NAVIGATION
========================================= */

document
  .getElementById("assistantNav")
  .addEventListener("click", () => {
    sidebar.classList.remove("open");

    questionInput.focus();
  });

/* =========================================
   MOBILE SIDEBAR MENU
========================================= */

document
  .getElementById("menuBtn")
  .addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

document.addEventListener("click", (event) => {
  if (
    window.innerWidth <= 720 &&
    sidebar.classList.contains("open") &&
    !sidebar.contains(event.target) &&
    !event.target.closest("#menuBtn")
  ) {
    sidebar.classList.remove("open");
  }
});

/* =========================================
   INITIAL SETUP
========================================= */

updateCharCount();
resizeInput();