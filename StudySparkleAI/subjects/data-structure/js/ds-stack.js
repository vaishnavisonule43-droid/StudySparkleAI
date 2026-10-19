document.addEventListener("DOMContentLoaded", () => {
  const CAPACITY = 5;

  const stackVisual = document.getElementById("stackVisual");
  const stackValue = document.getElementById("stackValue");
  const pushBtn = document.getElementById("pushBtn");
  const popBtn = document.getElementById("popBtn");
  const peekBtn = document.getElementById("peekBtn");
  const nextStepBtn = document.getElementById("nextStepBtn");
  const playAnimationBtn = document.getElementById("playAnimationBtn");
  const resetBtn = document.getElementById("resetBtn");
  const stackStatus = document.getElementById("stackStatus");
  const stackSize = document.getElementById("stackSize");
  const topElement = document.getElementById("topElement");

  if (
    !stackVisual || !stackValue || !pushBtn || !popBtn ||
    !peekBtn || !nextStepBtn || !playAnimationBtn ||
    !resetBtn || !stackStatus || !stackSize || !topElement
  ) {
    console.error("Stack visualizer: One or more HTML elements are missing.");
    return;
  }

  let stack = [];
  let animationTimer = null;
  let pendingSteps = [];
  let pendingIndex = 0;
  let isPlaying = false;

  function setStatus(message) {
    stackStatus.textContent = message;
  }

  function stopAnimation() {
    if (animationTimer !== null) {
      clearInterval(animationTimer);
      animationTimer = null;
    }

    isPlaying = false;
    playAnimationBtn.textContent = "▶ Play Animation";
  }

  function clearPendingSteps() {
    stopAnimation();
    pendingSteps = [];
    pendingIndex = 0;
  }

  function renderStack(animateTop = false) {
    stackVisual.innerHTML = "";

    if (stack.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-message";
      empty.textContent = "Stack is empty";
      stackVisual.appendChild(empty);
    } else {
      stack.forEach((value, index) => {
        const item = document.createElement("div");
        item.className = "stack-item";
        item.textContent = String(value);
        item.setAttribute("aria-label", "Stack value " + value);

        if (index === stack.length - 1) {
          item.classList.add("is-top");

          if (animateTop) {
            item.style.animation = "none";
            void item.offsetWidth;
            item.style.animation = "";
          }
        } else {
          item.style.animationDelay = `${index * 40}ms`;
        }

        stackVisual.appendChild(item);
      });
    }

    stackSize.textContent = String(stack.length);
    topElement.textContent =
      stack.length > 0 ? String(stack[stack.length - 1]) : "None";
  }

  function readValue() {
    const rawValue = stackValue.value.trim();

    if (rawValue === "") {
      setStatus("Please enter a value first.");
      stackValue.focus();
      return null;
    }

    return rawValue;
  }

  function pushValue(value) {
    if (stack.length >= CAPACITY) {
      setStatus("Stack Overflow! The stack is full.");
      return false;
    }

    stack.push(value);
    renderStack(true);
    setStatus("Pushed " + value + " onto the stack.");
    return true;
  }

  function popValue() {
    if (stack.length === 0) {
      setStatus("Stack Underflow! The stack is empty.");
      return false;
    }

    const removed = stack.pop();
    renderStack(true);
    setStatus("Popped " + removed + " from the stack.");
    return true;
  }

  function peekValue() {
    if (stack.length === 0) {
      setStatus("Stack is empty. There is no top element.");
      return;
    }

    setStatus("Top element is " + stack[stack.length - 1] + ".");
    renderStack(true);
  }

  pushBtn.addEventListener("click", () => {
    clearPendingSteps();

    const value = readValue();
    if (value === null) return;

    pushValue(value);
  });

  popBtn.addEventListener("click", () => {
    clearPendingSteps();
    popValue();
  });

  peekBtn.addEventListener("click", () => {
    clearPendingSteps();
    peekValue();
  });

  function prepareDemo() {
    clearPendingSteps();

    // A fresh sequence makes the animation predictable.
    stack = [];
    renderStack();

    pendingSteps = [
      { type: "push", value: 10 },
      { type: "push", value: 20 },
      { type: "push", value: 30 },
      { type: "peek" },
      { type: "pop" },
      { type: "push", value: 40 }
    ];

    pendingIndex = 0;
    setStatus("Demo ready. Select Next Step or Play Animation.");
  }

  function runNextStep() {
    if (pendingSteps.length === 0) {
      prepareDemo();
    }

    if (pendingIndex >= pendingSteps.length) {
      stopAnimation();
      setStatus("Animation complete. Press Reset to start again.");
      return false;
    }

    const step = pendingSteps[pendingIndex];
    pendingIndex++;

    if (step.type === "push") {
      pushValue(step.value);
    } else if (step.type === "pop") {
      popValue();
    } else if (step.type === "peek") {
      peekValue();
    }

    if (pendingIndex >= pendingSteps.length) {
      setStatus("Animation complete. Press Reset to start again.");
      stopAnimation();
    }

    return true;
  }

  nextStepBtn.addEventListener("click", () => {
    stopAnimation();
    runNextStep();
  });

  playAnimationBtn.addEventListener("click", () => {
    if (isPlaying) {
      stopAnimation();
      setStatus("Animation paused.");
      return;
    }

    if (pendingSteps.length === 0 || pendingIndex >= pendingSteps.length) {
      prepareDemo();
    }

    isPlaying = true;
    playAnimationBtn.textContent = "⏸ Pause Animation";
    setStatus("Playing stack animation...");

    animationTimer = setInterval(() => {
      if (pendingIndex >= pendingSteps.length) {
        stopAnimation();
        setStatus("Animation complete. Press Reset to start again.");
        return;
      }

      runNextStep();
    }, 1100);
  });

  resetBtn.addEventListener("click", () => {
    clearPendingSteps();
    stack = [];
    renderStack();
    setStatus("Reset complete. Stack is empty.");
  });

  renderStack();
  setStatus("Ready to start. Enter a value and press Push.");
});