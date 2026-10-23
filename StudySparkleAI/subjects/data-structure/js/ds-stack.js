"use strict";

/* ==========================================
   STUDYSPARK AI - STACK NOTES
   Interactive Visualizations and Navigation
========================================== */

/* ---------- Reading Progress ---------- */

const readingProgress = document.getElementById("readingProgress");
const topicProgress = document.getElementById("topicProgress");
const topicProgressBar = document.getElementById("topicProgressBar");
const progressLabel = document.getElementById("progressLabel");
const topButton = document.getElementById("topButton");

function updateReadingProgress() {
  const documentHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const scrollPercent = documentHeight > 0
    ? Math.min(100, Math.max(0, window.scrollY / documentHeight * 100))
    : 0;

  readingProgress.style.width = scrollPercent + "%";

  if (topButton) {
    topButton.classList.toggle("visible", window.scrollY > 400);
  }
}

window.addEventListener("scroll", updateReadingProgress, {
  passive: true
});

updateReadingProgress();

if (topButton) {
  topButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}


/* ---------- Reveal Animations ---------- */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08
  });

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}


/* ---------- Sidebar Navigation ---------- */

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const openSidebarButton = document.getElementById("openSidebar");
const closeSidebarButton = document.getElementById("closeSidebar");
const topicNav = document.getElementById("topicNav");
const topicSearch = document.getElementById("topicSearch");

function openSidebar() {
  if (!sidebar || !sidebarOverlay) return;

  sidebar.classList.add("open");
  sidebarOverlay.classList.add("visible");
  document.body.style.overflow = "hidden";

  if (openSidebarButton) {
    openSidebarButton.setAttribute("aria-expanded", "true");
  }
}

function closeSidebar() {
  if (!sidebar || !sidebarOverlay) return;

  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("visible");
  document.body.style.overflow = "";

  if (openSidebarButton) {
    openSidebarButton.setAttribute("aria-expanded", "false");
  }
}

if (openSidebarButton) {
  openSidebarButton.addEventListener("click", openSidebar);
}

if (closeSidebarButton) {
  closeSidebarButton.addEventListener("click", closeSidebar);
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener("click", closeSidebar);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSidebar();
  }

  if (
    event.key === "/" &&
    !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
  ) {
    event.preventDefault();

    if (topicSearch) {
      topicSearch.focus();
    }
  }
});

const topicLinks = Array.from(
  document.querySelectorAll(".topic-link")
);

const topicSections = topicLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setActiveTopic(sectionId) {
  topicLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === "#" + sectionId;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  const visibleTopics = topicLinks.filter((link) => {
    return !link.classList.contains("hidden-by-search");
  });

  const activeIndex = visibleTopics.findIndex((link) => {
    return link.getAttribute("href") === "#" + sectionId;
  });

  const progress = visibleTopics.length > 0 && activeIndex >= 0
    ? Math.round(((activeIndex + 1) / visibleTopics.length) * 100)
    : 0;

  if (topicProgress) {
    topicProgress.textContent = progress + "%";
  }

  if (topicProgressBar) {
    topicProgressBar.style.width = progress + "%";
  }

  if (progressLabel) {
    if (progress === 0) {
      progressLabel.textContent = "Start your learning journey";
    } else if (progress >= 100) {
      progressLabel.textContent = "All topics explored!";
    } else {
      progressLabel.textContent = "Keep going — you're making progress!";
    }
  }
}

topicLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) return;

    event.preventDefault();

    history.replaceState(null, "", link.getAttribute("href"));

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    setActiveTopic(target.id);
    closeSidebar();
  });
});

if ("IntersectionObserver" in window && topicSections.length > 0) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleEntries = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visibleEntries.length > 0) {
      setActiveTopic(visibleEntries[0].target.id);
    }
  }, {
    rootMargin: "-15% 0px -65% 0px",
    threshold: [0, 0.1, 0.25, 0.5]
  });

  topicSections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

if (topicSearch) {
  topicSearch.addEventListener("input", () => {
    const query = topicSearch.value.trim().toLowerCase();

    topicLinks.forEach((link) => {
      const matches = link.textContent.toLowerCase().includes(query);
      link.classList.toggle("hidden-by-search", !matches);
    });

    document.querySelectorAll(".nav-group-title").forEach((heading) => {
      let next = heading.nextElementSibling;
      let hasVisibleLink = false;

      while (next && !next.classList.contains("nav-group-title")) {
        if (
          next.classList.contains("topic-link") &&
          !next.classList.contains("hidden-by-search")
        ) {
          hasVisibleLink = true;
        }

        next = next.nextElementSibling;
      }

      heading.style.display = hasVisibleLink ? "" : "none";
    });
  });
}


/* ---------- Copy Code Buttons ---------- */

document.querySelectorAll("[data-copy-code]").forEach((button) => {
  button.addEventListener("click", async () => {
    const codeCard = button.closest(".code-card");
    const codeElement = codeCard?.querySelector("pre code");

    if (!codeElement) return;

    const code = codeElement.textContent;

    try {
      await navigator.clipboard.writeText(code);
      button.textContent = "Copied! ✓";
    } catch (error) {
      const temporary = document.createElement("textarea");

      temporary.value = code;
      temporary.style.position = "fixed";
      temporary.style.opacity = "0";

      document.body.appendChild(temporary);
      temporary.select();

      const copied = document.execCommand("copy");
      temporary.remove();

      button.textContent = copied ? "Copied! ✓" : "Select code to copy";
    }

    window.setTimeout(() => {
      button.textContent = "Copy code";
    }, 1600);
  });
});


/* ==========================================
   1. INTERACTIVE STACK VISUALIZER
========================================== */

const stack = [];
const MAX_STACK_SIZE = 8;

const stackContainer = document.getElementById("stackContainer");
const stackValue = document.getElementById("stackValue");
const stackMessage = document.getElementById("stackMessage");
const topPointer = document.getElementById("topPointer");
const stackSize = document.getElementById("stackSize");
const stackTopIndex = document.getElementById("stackTopIndex");
const stackTopValue = document.getElementById("stackTopValue");

function showStackMessage(message, type = "") {
  if (!stackMessage) return;

  stackMessage.textContent = message;
  stackMessage.className = "lab-message";

  if (type === "success") {
    stackMessage.classList.add("success-message");
  }

  if (type === "error") {
    stackMessage.classList.add("error-message");
  }
}

function renderStack(highlightTop = false) {
  if (!stackContainer) return;

  stackContainer.replaceChildren();

  if (stack.length === 0) {
    const emptyState = document.createElement("div");

    emptyState.className = "empty-state";
    emptyState.textContent =
      "Your stack is empty. Push an element to begin.";

    stackContainer.appendChild(emptyState);
  } else {
    stack.forEach((value, index) => {
      const item = document.createElement("div");

      item.className = "stack-item";

      if (index === stack.length - 1) {
        item.classList.add("is-top");

        if (highlightTop) {
          item.style.animation = "blockGlow 1s ease 2";
        }
      }

      const indexLabel = document.createElement("span");
      indexLabel.className = "stack-index";
      indexLabel.textContent = "IDX " + index;

      const valueLabel = document.createElement("span");
      valueLabel.textContent = value;

      item.append(indexLabel, valueLabel);
      stackContainer.appendChild(item);
    });
  }

  const topIndex = stack.length - 1;
  const topValue = stack.length > 0
    ? stack[stack.length - 1]
    : "—";

  if (topPointer) {
    topPointer.textContent = "TOP = " + topIndex;
  }

  if (stackSize) {
    stackSize.textContent = stack.length;
  }

  if (stackTopIndex) {
    stackTopIndex.textContent = topIndex;
  }

  if (stackTopValue) {
    stackTopValue.textContent = topValue;
  }
}

function pushStack() {
  if (!stackValue) return;

  const value = stackValue.value.trim();

  if (!value) {
    showStackMessage(
      "Please enter a value before pushing.",
      "error"
    );

    stackValue.focus();
    return;
  }

  if (stack.length >= MAX_STACK_SIZE) {
    showStackMessage(
      "STACK OVERFLOW! Capacity is 8. Remove an element before pushing another.",
      "error"
    );

    return;
  }

  stack.push(value);

  stackValue.value = "";

  renderStack();

  showStackMessage(
    value + " pushed successfully. TOP is now " +
    (stack.length - 1) + ".",
    "success"
  );

  stackValue.focus();
}

function popStack() {
  if (stack.length === 0) {
    showStackMessage(
      "STACK UNDERFLOW! Cannot pop from an empty stack.",
      "error"
    );

    return;
  }

  const removedValue = stack.pop();

  renderStack();

  showStackMessage(
    removedValue + " popped successfully. " +
    "The stack now contains " + stack.length + " item(s).",
    "success"
  );
}

function peekStack() {
  if (stack.length === 0) {
    showStackMessage(
      "Stack is empty. There is no top element to peek.",
      "error"
    );

    return;
  }

  renderStack(true);

  showStackMessage(
    "PEEK: The top element is " +
    stack[stack.length - 1] +
    ". No element was removed.",
    "success"
  );
}

function resetStack() {
  stack.length = 0;

  if (stackValue) {
    stackValue.value = "";
  }

  renderStack();

  showStackMessage(
    "Stack reset successfully. TOP = -1."
  );
}

document.getElementById("pushStack")?.addEventListener(
  "click",
  pushStack
);

document.getElementById("popStack")?.addEventListener(
  "click",
  popStack
);

document.getElementById("peekStack")?.addEventListener(
  "click",
  peekStack
);

document.getElementById("resetStack")?.addEventListener(
  "click",
  resetStack
);

if (stackValue) {
  stackValue.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      pushStack();
    }
  });
}

renderStack();


/* ==========================================
   2. POSTFIX EXPRESSION EVALUATOR
   Supports space-separated integer operands.
========================================== */

const postfixInput = document.getElementById("postfixInput");
const postfixResult = document.getElementById("postfixResult");
const postfixSteps = document.getElementById("postfixSteps");

function setResult(element, message, type = "") {
  if (!element) return;

  element.textContent = message;
  element.classList.remove("result-good", "result-bad");

  if (type === "good") {
    element.classList.add("result-good");
  }

  if (type === "bad") {
    element.classList.add("result-bad");
  }
}

function createTableCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

function addTableRow(tableBody, values) {
  const row = document.createElement("tr");

  values.forEach((value) => {
    row.appendChild(createTableCell(String(value)));
  });

  tableBody.appendChild(row);
}

function evaluatePostfix() {
  if (!postfixInput || !postfixResult || !postfixSteps) return;

  postfixSteps.replaceChildren();

  const expression = postfixInput.value.trim();

  if (!expression) {
    setResult(
      postfixResult,
      "Please enter a postfix expression.",
      "bad"
    );
    return;
  }

  const tokens = expression.split(/\s+/);
  const values = [];
  const allowedOperators = new Set(["+", "-", "*", "/", "%"]);

  for (const token of tokens) {
    if (!/^-?\d+$/.test(token) && !allowedOperators.has(token)) {
      setResult(
        postfixResult,
        "Invalid token: " + token +
        ". Use integers and +, -, *, /, % with spaces.",
        "bad"
      );
      return;
    }
  }

  const steps = [];
  let invalidMessage = "";

  for (const token of tokens) {
    if (/^-?\d+$/.test(token)) {
      values.push(Number(token));

      steps.push({
        symbol: token,
        action: "Push operand " + token,
        stack: values.join(", ")
      });

      continue;
    }

    if (values.length < 2) {
      invalidMessage =
        "Invalid expression: operator '" + token +
        "' does not have two operands.";

      break;
    }

    const right = values.pop();
    const left = values.pop();
    let result;

    switch (token) {
      case "+":
        result = left + right;
        break;

      case "-":
        result = left - right;
        break;

      case "*":
        result = left * right;
        break;

      case "/":
        if (right === 0) {
          invalidMessage = "Division by zero is not allowed.";
        } else {
          result = left / right;
        }
        break;

      case "%":
        if (right === 0) {
          invalidMessage = "Remainder by zero is not allowed.";
        } else {
          result = left % right;
        }
        break;
    }

    if (invalidMessage) break;

    if (!Number.isFinite(result)) {
      invalidMessage = "The expression produced an invalid number.";
      break;
    }

    values.push(result);

    steps.push({
      symbol: token,
      action: left + " " + token + " " + right + " = " + result,
      stack: values.join(", ")
    });
  }

  if (invalidMessage) {
    setResult(postfixResult, invalidMessage, "bad");
    return;
  }

  if (values.length !== 1) {
    setResult(
      postfixResult,
      "Invalid expression: too many operands or missing operators.",
      "bad"
    );
    return;
  }

  steps.forEach((step, index) => {
    addTableRow(postfixSteps, [
      index + 1,
      step.symbol,
      step.action,
      step.stack || "Empty"
    ]);
  });

  setResult(
    postfixResult,
    "Final Result = " + values[0],
    "good"
  );
}

document.getElementById("evaluatePostfix")?.addEventListener(
  "click",
  evaluatePostfix
);

document.getElementById("resetPostfix")?.addEventListener(
  "click",
  () => {
    if (postfixInput) {
      postfixInput.value = "2 3 + 4 *";
    }

    if (postfixSteps) {
      postfixSteps.replaceChildren();
      addTableRow(postfixSteps, [
        "—",
        "—",
        "Click Evaluate to see the steps",
        "—"
      ]);
    }

    setResult(postfixResult, "Ready to evaluate.");
  }
);


/* ==========================================
   3. INFIX TO POSTFIX CONVERTER
   Supports single-character operands.
========================================== */

const infixInput = document.getElementById("infixInput");
const infixResult = document.getElementById("infixResult");
const infixSteps = document.getElementById("infixSteps");

const operatorPrecedence = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "%": 2,
  "^": 3
};

function isOperator(character) {
  return Object.prototype.hasOwnProperty.call(
    operatorPrecedence,
    character
  );
}

function shouldPopOperator(stackOperator, currentOperator) {
  const topPrecedence = operatorPrecedence[stackOperator];
  const currentPrecedence = operatorPrecedence[currentOperator];

  if (topPrecedence > currentPrecedence) {
    return true;
  }

  if (topPrecedence < currentPrecedence) {
    return false;
  }

  // Exponentiation is right-associative.
  return currentOperator !== "^";
}

function convertInfix() {
  if (!infixInput || !infixResult || !infixSteps) return;

  infixSteps.replaceChildren();

  const expression = infixInput.value.replace(/\s+/g, "");

  if (!expression) {
    setResult(infixResult, "Please enter an infix expression.", "bad");
    return;
  }

  const tokens = Array.from(expression);

  if (!tokens.every((character) => {
    return /^[a-zA-Z0-9]$/.test(character) ||
      isOperator(character) ||
      character === "(" ||
      character === ")";
  })) {
    setResult(
      infixResult,
      "Unsupported character. Use single-character operands, operators and parentheses.",
      "bad"
    );
    return;
  }

  const operatorStack = [];
  const output = [];
  const steps = [];

  let previousType = "start";
  let invalidMessage = "";

  function record(symbol, action) {
    steps.push({
      symbol,
      action,
      stack: operatorStack.join(" "),
      output: output.join(" ")
    });
  }

  for (const token of tokens) {
    const isOperand = /^[a-zA-Z0-9]$/.test(token);

    if (isOperand) {
      if (
        previousType === "operand" ||
        previousType === "right"
      ) {
        invalidMessage =
          "Missing operator between adjacent operands or groups.";
        break;
      }

      output.push(token);
      previousType = "operand";
      record(token, "Add operand to output");
      continue;
    }

    if (token === "(") {
      if (
        previousType === "operand" ||
        previousType === "right"
      ) {
        invalidMessage = "Missing operator before '('.";
        break;
      }

      operatorStack.push(token);
      previousType = "left";
      record(token, "Push opening parenthesis");
      continue;
    }

    if (token === ")") {
      if (
        previousType === "start" ||
        previousType === "operator" ||
        previousType === "left"
      ) {
        invalidMessage = "Unexpected closing parenthesis.";
        break;
      }

      let foundOpening = false;

      while (operatorStack.length > 0) {
        const top = operatorStack.pop();

        if (top === "(") {
          foundOpening = true;
          break;
        }

        output.push(top);
      }

      if (!foundOpening) {
        invalidMessage = "Mismatched closing parenthesis.";
        break;
      }

      previousType = "right";
      record(token, "Pop until matching '('");
      continue;
    }

    if (isOperator(token)) {
      if (
        previousType === "start" ||
        previousType === "operator" ||
        previousType === "left"
      ) {
        invalidMessage =
          "Missing operand before operator '" + token + "'.";
        break;
      }

      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "(" &&
        shouldPopOperator(
          operatorStack[operatorStack.length - 1],
          token
        )
      ) {
        output.push(operatorStack.pop());
      }

      operatorStack.push(token);
      previousType = "operator";
      record(token, "Handle precedence, then push operator");
    }
  }

  if (!invalidMessage && (
    previousType === "operator" ||
    previousType === "left" ||
    previousType === "start"
  )) {
    invalidMessage = "Expression ends with a missing operand or is incomplete.";
  }

  if (!invalidMessage) {
    while (operatorStack.length > 0) {
      const top = operatorStack.pop();

      if (top === "(") {
        invalidMessage = "Mismatched opening parenthesis.";
        break;
      }

      output.push(top);
      record("END", "Pop remaining operator " + top);
    }
  }

  if (invalidMessage) {
    setResult(infixResult, invalidMessage, "bad");
    return;
  }

  steps.forEach((step, index) => {
    addTableRow(infixSteps, [
      step.symbol,
      step.action,
      step.stack || "Empty",
      step.output || "Empty"
    ]);
  });

  setResult(
    infixResult,
    "Postfix Expression: " + output.join(" "),
    "good"
  );
}

document.getElementById("convertInfix")?.addEventListener(
  "click",
  convertInfix
);

document.getElementById("resetInfix")?.addEventListener(
  "click",
  () => {
    if (infixInput) {
      infixInput.value = "A+B*C";
    }

    if (infixSteps) {
      infixSteps.replaceChildren();
      addTableRow(infixSteps, [
        "—",
        "Click Convert to see the steps",
        "—",
        "—"
      ]);
    }

    setResult(infixResult, "Enter an expression and convert it.");
  }
);


/* ==========================================
   4. BALANCED PARENTHESES CHECKER
========================================== */

const bracketInput = document.getElementById("bracketInput");
const bracketResult = document.getElementById("bracketResult");
const bracketSteps = document.getElementById("bracketSteps");

function checkBrackets() {
  if (!bracketInput || !bracketResult || !bracketSteps) return;

  bracketSteps.replaceChildren();

  const expression = bracketInput.value;
  const stack = [];

  const openingBrackets = new Set(["(", "[", "{"]);

  const matchingBracket = {
    ")": "(",
    "]": "[",
    "}": "{"
  };

  const messages = [];
  let error = "";

  for (let index = 0; index < expression.length; index++) {
    const character = expression[index];
    const position = index + 1;

    if (openingBrackets.has(character)) {
      stack.push({
        value: character,
        position
      });

      messages.push(
        "Position " + position + ": opening '" +
        character + "' → PUSH. Stack: " +
        stack.map((item) => item.value).join(" ") 
      );

      continue;
    }

    if (
      Object.prototype.hasOwnProperty.call(
        matchingBracket,
        character
      )
    ) {
      if (stack.length === 0) {
        error =
          "Unexpected closing bracket '" + character +
          "' at position " + position + ".";

        messages.push(error);
        break;
      }

      const top = stack[stack.length - 1];

      if (top.value !== matchingBracket[character]) {
        error =
          "Mismatch at position " + position +
          ": '" + character + "' cannot close '" +
          top.value + "' from position " + top.position + ".";

        messages.push(error);
        break;
      }

      stack.pop();

      messages.push(
        "Position " + position + ": '" + character +
        "' matches '" + top.value + "' → POP. Stack: " +
        (stack.map((item) => item.value).join(" ") || "Empty")
      );
    }
  }

  if (!error && stack.length > 0) {
    const top = stack[stack.length - 1];

    error =
      "Unclosed bracket '" + top.value +
      "' from position " + top.position + ".";

    messages.push(error);
  }

  if (messages.length === 0 && !error) {
    messages.push("No brackets were found in the expression.");
  }

  messages.forEach((message, index) => {
    const item = document.createElement("li");
    item.textContent = "Step " + (index + 1) + ": " + message;
    bracketSteps.appendChild(item);
  });

  if (error) {
    setResult(
      bracketResult,
      "NOT BALANCED — " + error,
      "bad"
    );
  } else {
    setResult(
      bracketResult,
      "BALANCED — all brackets match in the correct order.",
      "good"
    );
  }
}

document.getElementById("checkBrackets")?.addEventListener(
  "click",
  checkBrackets
);

document.getElementById("resetBrackets")?.addEventListener(
  "click",
  () => {
    if (bracketInput) {
      bracketInput.value = "{[a+(b*c)]}";
    }

    if (bracketSteps) {
      bracketSteps.replaceChildren();
    }

    setResult(
      bracketResult,
      "Ready to check brackets."
    );
  }
);


/* ==========================================
   5. STACK QUIZ
========================================== */

const stackQuiz = document.getElementById("stackQuiz");
const quizResult = document.getElementById("quizResult");

if (stackQuiz && quizResult) {
  const correctAnswers = {
    q1: "b",
    q2: "c",
    q3: "c",
    q4: "a",
    q5: "b",
    q6: "c"
  };

  stackQuiz.addEventListener("submit", (event) => {
    event.preventDefault();

    let score = 0;
    let unanswered = 0;

    Object.entries(correctAnswers).forEach(([name, answer]) => {
      const selected = stackQuiz.querySelector(
        'input[name="' + name + '"]:checked'
      );

      if (!selected) {
        unanswered++;
      } else if (selected.value === answer) {
        score++;
      }
    });

    if (unanswered > 0) {
      quizResult.textContent =
        "You scored " + score + "/6 so far. Please answer all " +
        unanswered + " remaining question(s).";

      return;
    }

    const percentage = Math.round((score / 6) * 100);

    let message;

    if (score === 6) {
      message = "Excellent! All answers are correct.";
    } else if (score >= 4) {
      message = "Good work! Review the topics you missed.";
    } else {
      message = "Keep practicing. Read the notes and try again.";
    }

    quizResult.textContent =
      "Your score: " + score + "/6 (" + percentage + "%). " + message;
  });

  stackQuiz.addEventListener("reset", () => {
    window.setTimeout(() => {
      quizResult.textContent = "";
    }, 0);
  });
}


/* ---------- Initial state ---------- */

if (topicLinks.length > 0) {
  const initialId = window.location.hash
    ? window.location.hash.slice(1)
    : "introduction";

  const initialSection = document.getElementById(initialId);

  if (initialSection && topicSections.includes(initialSection)) {
    setActiveTopic(initialId);
  } else {
    setActiveTopic("introduction");
  }
}