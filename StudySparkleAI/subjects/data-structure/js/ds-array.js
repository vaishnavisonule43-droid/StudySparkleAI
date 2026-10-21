document.addEventListener("DOMContentLoaded", () => {
  // Copy buttons
  document.querySelectorAll(".copy-btn").forEach(button => {
    button.addEventListener("click", async () => {
      const code = button.parentElement.querySelector("code")?.innerText || "";
      const original = button.innerText;
      try {
        await navigator.clipboard.writeText(code);
      } catch {
        const area = document.createElement("textarea");
        area.value = code;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        try { document.execCommand("copy"); } catch {}
        area.remove();
      }
      button.innerText = "Copied!";
      button.classList.add("copied");
      setTimeout(() => { button.innerText = original; button.classList.remove("copied"); }, 1400);
    });
  });

  // Scroll reveal
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add("visible"));

  // Highlight the current sidebar link
  const navLinks = [...document.querySelectorAll(".side a[href^='#']")];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id));
        }
      });
    }, { rootMargin: "-15% 0px -70% 0px" });
    sections.forEach(section => navObserver.observe(section));
  }

  // Interactive array lab
  const $ = id => document.getElementById(id);
  const operation = $("lab-operation"), valueInput = $("lab-value"), positionInput = $("lab-position");
  const startBtn = $("lab-start"), nextBtn = $("lab-next"), resetBtn = $("lab-reset");
  const bars = $("lab-array"), indexes = $("lab-indexes");
  if (!bars || !operation) return;

  const initial = [10, 20, 30, 40, 50];
  let values = [...initial], steps = [], stepIndex = -1, timer = null, sorted = false;

  function makeSteps(type) {
    const arr = [...initial];
    const list = [];
    const add = (a, current = [], compare = [], message = "", explanation = "", found = [], sortedIdx = []) =>
      list.push({ values: [...a], current, compare, message, explanation, found, sorted: sortedIdx });
    if (type === "traversal") {
      arr.forEach((v, i) => add(arr, [i], [], `Visiting index ${i}: value ${v}.`, `The loop reads a[${i}] directly. Move to the next index until every element is visited.`));
      add(arr, [], [], "Traversal complete.", "Every array element has been visited once.");
    } else if (type === "search") {
      const target = Number(valueInput.value);
      let found = false;
      for (let i = 0; i < arr.length; i++) {
        const match = arr[i] === target;
        add(arr, match ? [i] : [], [i], match ? `Target ${target} found at index ${i}.` : `Compare ${arr[i]} with target ${target}. Not a match.`, match ? "The current value equals the target, so the search stops." : "The current value is not the target. Check the next element.", match ? [i] : []);
        if (match) { found = true; break; }
      }
      if (!found) add(arr, [], [], `Target ${target} was not found.`, "All elements were checked, so the target is not in this array.");
    } else if (type === "insert") {
      const pos = Number(positionInput.value), val = Number(valueInput.value);
      if (!Number.isInteger(pos) || pos < 0 || pos > arr.length) {
        add(arr, [], [], "Invalid insertion index.", `Choose an index from 0 to ${arr.length}.`);
      } else {
        let work = [...arr];
        add(work, [], [], `Insert ${val} at index ${pos}.`, "Create a free space by shifting elements to the right, starting at the end.");
        for (let i = work.length - 1; i >= pos; i--) {
          work[i + 1] = work[i];
          work.length = Math.max(work.length, i + 2);
          add(work, [i + 1], [i], `Shift ${work[i]} from index ${i} to index ${i + 1}.`, "Move right-to-left so the existing value is not overwritten.");
        }
        work[pos] = val;
        add(work, [pos], [], `Placed ${val} at index ${pos}.`, "The new value is now in the selected position.");
      }
    } else if (type === "delete") {
      const pos = Number(positionInput.value);
      if (!Number.isInteger(pos) || pos < 0 || pos >= arr.length) {
        add(arr, [], [], "Invalid deletion index.", `Choose an index from 0 to ${arr.length - 1}.`);
      } else {
        add(arr, [pos], [], `Delete ${arr[pos]} at index ${pos}.`, "Shift every following value one position to the left.");
        for (let i = pos; i < arr.length - 1; i++) {
          arr[i] = arr[i + 1];
          add(arr.slice(0, -1), [i], [i + 1], `Move ${arr[i]} from index ${i + 1} to index ${i}.`, "The next element fills the empty position.");
        }
        add(arr.slice(0, -1), [], [], "Deletion complete.", "The logical array size is now one less.");
      }
    } else if (type === "bubble") {
      let a = [...arr], pass = 0;
      add(a, [], [], "Ready to sort the array.", "Bubble Sort compares neighbouring values and swaps them if they are out of order.");
      for (let i = 0; i < a.length - 1; i++) {
        pass++;
        for (let j = 0; j < a.length - 1 - i; j++) {
          const before = [...a];
          const swap = a[j] > a[j + 1];
          if (swap) [a[j], a[j + 1]] = [a[j + 1], a[j]];
          add(a, swap ? [j, j + 1] : [], [j, j + 1], swap ? `Pass ${pass}: swap ${before[j]} and ${before[j + 1]}.` : `Pass ${pass}: ${a[j]} and ${a[j + 1]} are already in order.`, swap ? "The larger value moves one position to the right." : "No swap is needed because the pair is in ascending order.", [], Array.from({length:i}, (_, k) => a.length - 1 - k));
        }
      }
      add(a, [], [], "Sorting complete!", "The values are now arranged from smallest to largest.", [], a.map((_, i) => i));
    }
    return list;
  }

  function render(step) {
    values = [...step.values];
    $("lab-title").textContent = ({traversal:"Traversal",search:"Linear Search",insert:"Insertion",delete:"Deletion",bubble:"Bubble Sort"})[operation.value];
    $("lab-step").textContent = `${Math.max(0, stepIndex + 1)} / ${steps.length}`;
    $("lab-size").textContent = values.length;
    bars.innerHTML = "";
    indexes.innerHTML = "";
    const max = Math.max(1, ...values.map(v => Math.abs(v)));
    values.forEach((v, i) => {
      const bar = document.createElement("div");
      bar.className = "lab-cell";
      if (step.current.includes(i)) bar.classList.add("current");
      if (step.compare.includes(i)) bar.classList.add("compare");
      if (step.found.includes(i)) bar.classList.add("found");
      if (step.sorted.includes(i)) bar.classList.add("sorted");
      bar.style.setProperty("--bar-height", `${Math.max(36, Math.abs(v) / max * 135)}px`);
      bar.style.animationDelay = `${i * 35}ms`;
      bar.textContent = v;
      bar.title = `Index ${i}, value ${v}`;
      bars.appendChild(bar);
      const ix = document.createElement("span");
      ix.textContent = i;
      indexes.appendChild(ix);
    });
    $("lab-message").textContent = step.message;
    $("lab-explanation").textContent = step.explanation;
    nextBtn.disabled = stepIndex >= steps.length - 1;
    startBtn.textContent = timer ? "Ⅱ Pause" : (stepIndex >= steps.length - 1 ? "↻ Replay" : "▶ Start");
  }

  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
    startBtn.textContent = "▶ Start";
  }
  function reset() {
    stopTimer();
    stepIndex = -1;
    steps = makeSteps(operation.value);
    render({values: initial, current: [], compare: [], found: [], sorted: [], message: "Ready. Press Start or Next Step.", explanation: "Choose an operation and follow how each array element changes."});
    $("lab-step").textContent = `0 / ${steps.length}`;
    nextBtn.disabled = false;
  }
  function next() {
    if (stepIndex < steps.length - 1) {
      stepIndex++;
      render(steps[stepIndex]);
    } else stopTimer();
  }
  function toggleRun() {
    if (timer) { stopTimer(); return; }
    if (stepIndex >= steps.length - 1) reset();
    const speed = Number($("lab-speed").value);
    const delay = [1500, 1100, 800, 520, 300][speed - 1];
    startBtn.textContent = "Ⅱ Pause";
    timer = setInterval(() => {
      if (stepIndex >= steps.length - 1) { stopTimer(); return; }
      next();
      if (stepIndex >= steps.length - 1) stopTimer();
    }, delay);
  }
  operation.addEventListener("change", reset);
  [valueInput, positionInput].forEach(input => input.addEventListener("change", () => { if (!timer) reset(); }));
  startBtn.addEventListener("click", toggleRun);
  nextBtn.addEventListener("click", () => { stopTimer(); next(); });
  resetBtn.addEventListener("click", reset);
  reset();
});