(() => {
  "use strict";

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  // Reading progress
  const progress = $("#readingProgress");
  const sidebar = $("#sidebar");
  const overlay = $("#sidebarOverlay");
  const links = $$("#topicNav a");
  const sections = $$(".card[data-topic]");

  function updateProgress() {
    const max =
      document.documentElement.scrollHeight - innerHeight;

    progress.style.width =
      `${max > 0 ? Math.max(0, Math.min(100, scrollY / max * 100)) : 0}%`;
  }

  addEventListener("scroll", updateProgress, {
    passive: true
  });

  addEventListener("resize", updateProgress);

  updateProgress();

  // Animate notes when they enter the screen
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    $$(".reveal").forEach(element => {
      revealObserver.observe(element);
    });

    // Highlight the current sidebar topic
    const sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          links.forEach(link => {
            link.classList.toggle(
              "active",
              link.hash === `#${entry.target.id}`
            );
          });

          const index = sections.indexOf(entry.target);

          if (index >= 0) {
            $("#progressLabel").textContent =
              `${index + 1} of ${sections.length} topics`;

            $("#topicProgress").style.width =
              `${(index + 1) / sections.length * 100}%`;
          }
        });
      },
      {
        rootMargin: "-18% 0px -68% 0px"
      }
    );

    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  } else {
    $$(".reveal").forEach(element => {
      element.classList.add("visible");
    });
  }

  // Mobile sidebar
  function setSidebar(open) {
    sidebar.classList.toggle("open", open);
    overlay.classList.toggle("open", open);

    document.body.style.overflow =
      open ? "hidden" : "";
  }

  $("#openSidebar")?.addEventListener("click", () => {
    setSidebar(true);
  });

  $("#closeSidebar")?.addEventListener("click", () => {
    setSidebar(false);
  });

  overlay.addEventListener("click", () => {
    setSidebar(false);
  });

  links.forEach(link => {
    link.addEventListener("click", () => {
      setSidebar(false);
    });
  });

  // Search topics in the sidebar
  $("#topicSearch").addEventListener("input", event => {
    const query = event.target.value
      .trim()
      .toLowerCase();

    links.forEach(link => {
      link.hidden =
        !link.textContent.toLowerCase().includes(query);
    });
  });

  // Back to top
  $("#topButton").addEventListener("click", () => {
    scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // Copy code buttons
  $$(".copy-btn").forEach(button => {
    button.addEventListener("click", async () => {
      const code = $("code", button.closest(".code-block"));

      if (!code) return;

      const original = button.textContent;

      try {
        await navigator.clipboard.writeText(code.innerText);

        button.textContent = "Copied!";
        button.classList.add("copied");
      } catch {
        const range = document.createRange();

        range.selectNodeContents(code);

        const selection = getSelection();

        selection.removeAllRanges();
        selection.addRange(range);

        button.textContent = "Select & copy";
      }

      setTimeout(() => {
        button.textContent = original;
        button.classList.remove("copied");
      }, 1500);
    });
  });

  // Interactive searching visualizer
  const arrayInput = $("#arrayInput");
  const targetInput = $("#targetInput");
  const speedInput = $("#speedInput");
  const visualArray = $("#visualArray");
  const message = $("#visualMessage");
  const comparisonsEl = $("#comparisonCount");
  const rangeEl = $("#rangeCount");
  const resultEl = $("#resultCount");
  const log = $("#stepLog");

  const linearButton = $("#runLinear");
  const binaryButton = $("#runBinary");
  const resetButton = $("#resetVisualizer");

  let running = false;
  let token = 0;

  // Read the input array
  function parseArray() {
    const raw = arrayInput.value.trim();

    if (!raw) return null;

    const parts = raw.split(/[,\s]+/).filter(Boolean);

    if (!parts.length || parts.length > 30) {
      return null;
    }

    const values = parts.map(Number);

    if (!values.every(Number.isFinite)) {
      return null;
    }

    return values;
  }

  // Read the target key
  function getTarget() {
    if (targetInput.value.trim() === "") {
      return null;
    }

    const target = Number(targetInput.value);

    return Number.isFinite(target) ? target : null;
  }

  // Draw array cells
  function renderArray(values) {
    visualArray.innerHTML = "";

    values.forEach((value, index) => {
      const item = document.createElement("div");

      item.className = "array-item";
      item.style.animationDelay = `${index * 22}ms`;

      const cell = document.createElement("div");

      cell.className = "cell";
      cell.dataset.index = String(index);
      cell.textContent = String(value);

      const markers = document.createElement("div");

      markers.className = "markers";

      const idx = document.createElement("div");

      idx.className = "index";
      idx.textContent = `idx ${index}`;

      item.append(cell, markers, idx);

      visualArray.appendChild(item);
    });
  }

  // Remove previous cell colours
  function clearCells() {
    $$(".cell", visualArray).forEach(cell => {
      cell.className = "cell";

      $(".markers", cell.parentElement).innerHTML = "";
    });
  }

  // Add a line to the step-by-step log
  function addLog(text) {
    $(".empty-log", log)?.remove();

    const row = document.createElement("div");
    row.className = "log-entry";

    const number = document.createElement("span");
    number.className = "log-number";
    number.textContent =
      String($$(".log-entry", log).length + 1);

    const paragraph = document.createElement("p");
    paragraph.textContent = text;

    row.append(number, paragraph);
    log.appendChild(row);

    log.scrollTop = log.scrollHeight;
  }

  // Highlight the current search step
  function markStep(index, low, mid, high, binary) {
    clearCells();

    const cells = $$(".cell", visualArray);

    cells.forEach((cell, i) => {
      if (binary && (i < low || i > high)) {
        cell.classList.add("discarded");
      }

      if (i === index) {
        cell.classList.add("current");
      }

      if (binary && i === low && low <= high) {
        cell.classList.add("low");
      }

      if (binary && i === high && high >= low) {
        cell.classList.add("high");
      }

      const markers = $(".markers", cell.parentElement);

      if (!binary) return;

      const labels = [
        [i === low && low <= high, "L", "low-marker"],
        [i === mid, "M", "mid-marker"],
        [i === high && high >= low, "H", "high-marker"]
      ];

      labels.forEach(([show, label, cls]) => {
        if (!show) return;

        const marker = document.createElement("span");

        marker.className = `marker ${cls}`;
        marker.textContent = label;

        markers.appendChild(marker);
      });
    });

    rangeEl.textContent = binary
      ? (low <= high ? `${low}–${high}` : "Empty")
      : `${index} / ${cells.length - 1}`;
  }

  // Highlight the found element
  function markFound(index) {
    clearCells();

    const cell =
      $(`.cell[data-index="${index}"]`, visualArray);

    if (cell) {
      cell.className = "cell found";
    }
  }

  // Prevent conflicting actions during animation
  function setRunning(value) {
    running = value;

    [
      linearButton,
      binaryButton,
      resetButton,
      arrayInput,
      targetInput,
      speedInput
    ].forEach(element => {
      element.disabled = value;
    });
  }

  function wait() {
    return new Promise(resolve => {
      setTimeout(
        resolve,
        Number(speedInput.value) || 700
      );
    });
  }

  // Reset the visualizer
  function resetLab(showMessage = true) {
    token++;

    setRunning(false);

    const values = parseArray();

    if (values) {
      renderArray(values);
    } else {
      visualArray.innerHTML = "";
    }

    comparisonsEl.textContent = "0";
    rangeEl.textContent = "—";
    resultEl.textContent = "Waiting";

    log.innerHTML =
      '<p class="empty-log">Your search steps will appear here.</p>';

    if (showMessage) {
      message.textContent = values
        ? "Enter a target and choose a search method."
        : "Enter up to 30 valid numbers, separated by commas or spaces.";
    }
  }

  // Linear Search animation
  async function linearSearch() {
    if (running) return;

    const values = parseArray();
    const target = getTarget();

    if (!values) {
      message.textContent =
        "Please enter valid numbers separated by commas or spaces (maximum 30).";
      return;
    }

    if (target === null) {
      message.textContent =
        "Please enter a numeric target key.";
      return;
    }

    renderArray(values);
    log.innerHTML = "";

    comparisonsEl.textContent = "0";
    resultEl.textContent = "Searching";

    const myToken = ++token;

    setRunning(true);

    message.textContent =
      `Linear Search started: looking for ${target}.`;

    addLog(`Start at index 0. Target key = ${target}.`);

    let comparisons = 0;

    for (let i = 0; i < values.length; i++) {
      if (myToken !== token) return;

      markStep(i, 0, null, values.length - 1, false);

      comparisons++;

      comparisonsEl.textContent = String(comparisons);

      message.textContent =
        `Compare target ${target} with A[${i}] = ${values[i]}.`;

      addLog(
        `Compare A[${i}] = ${values[i]} with ${target}.`
      );

      await wait();

      if (myToken !== token) return;

      if (values[i] === target) {
        markFound(i);

        resultEl.textContent = `Index ${i}`;
        rangeEl.textContent = `Position ${i + 1}`;

        message.textContent =
          `Found ${target} at index ${i} (position ${i + 1}) after ${comparisons} comparison${comparisons === 1 ? "" : "s"}.`;

        addLog(
          `Match found. Stop searching. Position = ${i + 1}.`
        );

        setRunning(false);
        return;
      }
    }

    resultEl.textContent = "Not found";
    rangeEl.textContent = "Finished";

    message.textContent =
      `${target} was not found after checking all ${values.length} elements.`;

    addLog(
      "Reached the end of the array. Key not found; return -1."
    );

    setRunning(false);
  }

  // Binary Search animation
  async function binarySearch() {
    if (running) return;

    const inputValues = parseArray();
    const target = getTarget();

    if (!inputValues) {
      message.textContent =
        "Please enter valid numbers separated by commas or spaces (maximum 30).";
      return;
    }

    if (target === null) {
      message.textContent =
        "Please enter a numeric target key.";
      return;
    }

    // Binary Search requires sorted data.
    // Sort a copy so the user's original input remains unchanged.
    const values = [...inputValues].sort((a, b) => a - b);

    renderArray(values);
    log.innerHTML = "";

    comparisonsEl.textContent = "0";
    resultEl.textContent = "Searching";

    const myToken = ++token;

    setRunning(true);

    message.textContent =
      "Binary Search uses a sorted copy of your array (ascending order).";

    addLog(
      `Sorted array: [${values.join(", ")}]. Target key = ${target}.`
    );

    let low = 0;
    let high = values.length - 1;
    let comparisons = 0;

    await wait();

    while (low <= high) {
      if (myToken !== token) return;

      const mid = Math.floor(low + (high - low) / 2);

      markStep(mid, low, mid, high, true);

      comparisons++;

      comparisonsEl.textContent = String(comparisons);
      rangeEl.textContent = `${low}–${high}`;

      message.textContent =
        `LOW = ${low}, HIGH = ${high}, MID = ${mid}. Compare ${target} with ${values[mid]}.`;

      addLog(
        `LOW=${low}, HIGH=${high}, MID=${mid}. A[MID] = ${values[mid]}.`
      );

      await wait();

      if (myToken !== token) return;

      if (values[mid] === target) {
        markFound(mid);

        resultEl.textContent = `Index ${mid}`;
        rangeEl.textContent = `Position ${mid + 1}`;

        message.textContent =
          `Found ${target} at index ${mid} (position ${mid + 1}) after ${comparisons} comparison${comparisons === 1 ? "" : "s"}.`;

        addLog(
          `A[${mid}] equals ${target}. Key found; stop.`
        );

        setRunning(false);
        return;
      }

      if (target < values[mid]) {
        addLog(
          `${target} < ${values[mid]}, so search the left half. Set HIGH = MID - 1 = ${mid - 1}.`
        );

        high = mid - 1;
      } else {
        addLog(
          `${target} > ${values[mid]}, so search the right half. Set LOW = MID + 1 = ${mid + 1}.`
        );

        low = mid + 1;
      }

      await wait();
    }

    if (myToken !== token) return;

    clearCells();

    $$(".cell", visualArray).forEach(cell => {
      cell.classList.add("discarded");
    });

    resultEl.textContent = "Not found";
    rangeEl.textContent = "Empty";

    message.textContent =
      `${target} was not found. The search range became empty (LOW > HIGH).`;

    addLog(
      "LOW > HIGH. No elements remain; key not found."
    );

    setRunning(false);
  }

  // Connect the buttons
  linearButton.addEventListener("click", linearSearch);

  binaryButton.addEventListener("click", binarySearch);

  resetButton.addEventListener("click", () => {
    resetLab();
  });

  arrayInput.addEventListener("change", () => {
    if (!running) resetLab(false);
  });

  arrayInput.addEventListener("keydown", event => {
    if (event.key === "Enter" && !running) {
      resetLab(false);
    }
  });

  targetInput.addEventListener("keydown", event => {
    if (event.key === "Enter" && !running) {
      linearSearch();
    }
  });

  // Initial display
  resetLab(false);
})();