(() => {
  const original = [40, 10, 30, 20, 50, 15, 45, 25];
  let a = [...original],
    running = false,
    paused = false,
    stop = false,
    comparisons = 0,
    moves = 0,
    sorted = new Set(),
    focus = [],
    pivot = -1,
    resumeWait = null;
  const $ = (id) => document.getElementById(id),
    bars = $("sortingArray"),
    msg = $("message"),
    explain = $("explanation"),
    alg = $("algorithm"),
    start = $("start"),
    pause = $("pause");
  const titles = {
    bubble: "Bubble Sort",
    selection: "Selection Sort",
    insertion: "Insertion Sort",
    merge: "Merge Sort",
    quick: "Quick Sort",
  };
  const delayTime = () => [1100, 800, 520, 300, 130][+$("speed").value - 1];
  function render() {
    bars.innerHTML = "";
    let max = Math.max(...a, 1);
    a.forEach((v, i) => {
      let el = document.createElement("div");
      el.className = "bar";
      if (sorted.has(i)) el.classList.add("sorted");
      if (focus.includes(i)) el.classList.add("compare");
      if (i === pivot) el.classList.add("active");
      el.style.height = Math.max(14, (v / max) * 88) + "%";
      el.style.animationDelay = i * 25 + "ms";
      el.textContent = v;
      el.title = `Index ${i}: ${v}`;
      bars.appendChild(el);
    });
    $("comparisons").textContent = comparisons;
    $("moves").textContent = moves;
  }
  function pauseWake() {
    if (resumeWait) {
      let r = resumeWait;
      resumeWait = null;
      r();
    }
  }
  async function wait() {
    while (paused && !stop) await new Promise((r) => (resumeWait = r));
    if (stop) throw Error("stopped");
    await new Promise((r) => setTimeout(r, delayTime()));
    if (stop) throw Error("stopped");
  }
  function cmp(i, j, text) {
    comparisons++;
    focus = [i, j];
    pivot = -1;
    explain.textContent = text;
    render();
  }
  function swap(i, j) {
    [a[i], a[j]] = [a[j], a[i]];
    moves++;
  }
  function mark(list) {
    list.forEach((i) => sorted.add(i));
  }
  async function bubble() {
    let n = a.length;
    for (let i = 0; i < n - 1; i++) {
      let changed = false;
      for (let j = 0; j < n - i - 1; j++) {
        cmp(
          j,
          j + 1,
          `Compare ${a[j]} and ${a[j + 1]}. Swap if the left value is larger.`,
        );
        msg.textContent = `Bubble Sort · Pass ${i + 1} · Comparing ${a[j]} and ${a[j + 1]}`;
        await wait();
        if (a[j] > a[j + 1]) {
          swap(j, j + 1);
          changed = true;
          explain.textContent = `Swap performed. ${a[j]} moves to the right of ${a[j + 1]}.`;
          render();
          await wait();
        }
      }
      mark([n - i - 1]);
      render();
      if (!changed) {
        mark(Array.from({ length: n }, (_, k) => k));
        break;
      }
    }
  }
  async function selection() {
    let n = a.length;
    for (let i = 0; i < n - 1; i++) {
      let min = i;
      pivot = min;
      focus = [min];
      render();
      msg.textContent = `Selection Sort · Pass ${i + 1}: find the minimum`;
      for (let j = i + 1; j < n; j++) {
        cmp(min, j, `Current minimum is ${a[min]}. Compare it with ${a[j]}.`);
        await wait();
        if (a[j] < a[min]) {
          min = j;
          pivot = min;
          focus = [i, min];
          explain.textContent = `${a[min]} is the new minimum in the unsorted section.`;
          render();
          await wait();
        }
      }
      if (min !== i) {
        swap(i, min);
        explain.textContent = `Place minimum ${a[i]} at index ${i}.`;
        render();
        await wait();
      }
      mark([i]);
      render();
    }
    mark(Array.from({ length: n }, (_, i) => i));
  }
  async function insertion() {
    mark([0]);
    for (let i = 1; i < a.length; i++) {
      let key = a[i],
        j = i - 1;
      pivot = i;
      focus = [i];
      msg.textContent = `Insertion Sort · Insert key ${key}`;
      explain.textContent = `Take ${key} as the key and find its place in the sorted left section.`;
      render();
      await wait();
      while (j >= 0) {
        cmp(
          j,
          j + 1,
          `Compare ${a[j]} with key ${key}. If larger, shift it one position right.`,
        );
        await wait();
        if (a[j] > key) {
          a[j + 1] = a[j];
          moves++;
          focus = [j, j + 1];
          render();
          explain.textContent = `${a[j]} shifts one position to the right.`;
          await wait();
          j--;
        } else break;
      }
      a[j + 1] = key;
      moves++;
      mark(Array.from({ length: i + 1 }, (_, k) => k));
      pivot = -1;
      focus = [j + 1];
      explain.textContent = `Insert key ${key} at index ${j + 1}. The left section is sorted.`;
      render();
      await wait();
    }
  }
  async function merge() {
    async function sort(l, r) {
      if (l >= r) return;
      let m = Math.floor((l + r) / 2);
      msg.textContent = `Merge Sort · Divide range ${l}–${r}`;
      focus = [l, m, r];
      explain.textContent = `Divide this section into [${l}–${m}] and [${m + 1}–${r}].`;
      render();
      await wait();
      await sort(l, m);
      await sort(m + 1, r);
      let L = a.slice(l, m + 1),
        R = a.slice(m + 1, r + 1),
        i = 0,
        j = 0,
        k = l;
      while (i < L.length && j < R.length) {
        focus = [k];
        explain.textContent = `Compare ${L[i]} and ${R[j]}, then copy the smaller value into position ${k}.`;
        comparisons++;
        render();
        await wait();
        if (L[i] <= R[j]) a[k++] = L[i++];
        else a[k++] = R[j++];
        moves++;
        render();
        await wait();
      }
      while (i < L.length) {
        a[k++] = L[i++];
        moves++;
        render();
        await wait();
      }
      while (j < R.length) {
        a[k++] = R[j++];
        moves++;
        render();
        await wait();
      }
      focus = Array.from({ length: r - l + 1 }, (_, x) => l + x);
      explain.textContent = `Merged section: ${a.slice(l, r + 1).join(", ")}.`;
      render();
      await wait();
    }
    await sort(0, a.length - 1);
    mark(Array.from({ length: a.length }, (_, i) => i));
  }
  async function quick() {
    async function partition(l, h) {
      let p = a[h],
        i = l - 1;
      pivot = h;
      focus = [h];
      msg.textContent = `Quick Sort · Partition ${l}–${h}`;
      explain.textContent = `Choose ${p} as pivot. Move values less than or equal to it to the left.`;
      render();
      await wait();
      for (let j = l; j < h; j++) {
        cmp(j, h, `Compare ${a[j]} with pivot ${p}.`);
        pivot = h;
        render();
        await wait();
        if (a[j] <= p) {
          i++;
          if (i !== j) {
            swap(i, j);
            explain.textContent = `Move ${a[i]} into the left partition of pivot ${p}.`;
            render();
            await wait();
          }
        }
      }
      if (i + 1 !== h) {
        swap(i + 1, h);
        render();
        await wait();
      }
      pivot = -1;
      focus = [i + 1];
      explain.textContent = `Pivot ${p} is now in its correct position at index ${i + 1}.`;
      render();
      await wait();
      return i + 1;
    }
    async function sort(l, h) {
      if (l < h) {
        let p = await partition(l, h);
        mark([p]);
        render();
        await sort(l, p - 1);
        await sort(p + 1, h);
      } else if (l === h) mark([l]);
    }
    await sort(0, a.length - 1);
    mark(Array.from({ length: a.length }, (_, i) => i));
  }
  async function run() {
    if (running) return;
    running = true;
    paused = false;
    stop = false;
    comparisons = 0;
    moves = 0;
    sorted = new Set();
    focus = [];
    pivot = -1;
    start.disabled = true;
    pause.disabled = false;
    pause.textContent = "Ⅱ Pause";
    $("algorithmName").textContent = titles[alg.value];
    msg.textContent = titles[alg.value] + " is running…";
    render();
    try {
      await { bubble, selection, insertion, merge, quick }[alg.value]();
      if (!stop) {
        mark(Array.from({ length: a.length }, (_, i) => i));
        focus = [];
        pivot = -1;
        render();
        msg.textContent =
          titles[alg.value] + " completed! The array is sorted.";
        explain.textContent = `Final result: ${a.join(", ")}. Try another algorithm to compare its steps.`;
      }
    } catch (e) {
      if (e.message !== "stopped")
        msg.textContent = "Something went wrong. Press Reset and try again.";
    } finally {
      running = false;
      paused = false;
      stop = false;
      start.disabled = false;
      pause.disabled = true;
      pause.textContent = "Ⅱ Pause";
      pauseWake();
    }
  }
  function reset() {
    stop = true;
    paused = false;
    pauseWake();
    running = false;
    a = [...original];
    comparisons = 0;
    moves = 0;
    sorted = new Set();
    focus = [];
    pivot = -1;
    start.disabled = false;
    pause.disabled = true;
    pause.textContent = "Ⅱ Pause";
    $("algorithmName").textContent = titles[alg.value];
    msg.textContent = "Array reset. Press Start sorting when ready.";
    explain.textContent =
      "Watch the highlighted bars to follow each comparison and movement.";
    render();
  }
  function randomize() {
    stop = true;
    paused = false;
    pauseWake();
    running = false;
    a = Array.from({ length: 8 }, () => Math.floor(Math.random() * 85) + 10);
    comparisons = 0;
    moves = 0;
    sorted = new Set();
    focus = [];
    pivot = -1;
    start.disabled = false;
    pause.disabled = true;
    pause.textContent = "Ⅱ Pause";
    $("algorithmName").textContent = titles[alg.value];
    msg.textContent = "New array generated. Press Start sorting to begin.";
    explain.textContent = "Try the same array with different algorithms.";
    render();
  }
  start.addEventListener("click", run);
  pause.addEventListener("click", () => {
    if (!running) return;
    paused = !paused;
    pause.textContent = paused ? "▶ Resume" : "Ⅱ Pause";
    msg.textContent = paused
      ? "Sorting paused. Press Resume to continue."
      : titles[alg.value] + " resumed…";
    if (!paused) pauseWake();
  });
  $("reset").addEventListener("click", reset);
  $("random").addEventListener("click", randomize);
  alg.addEventListener("change", () => {
    if (running) reset();
    $("algorithmName").textContent = titles[alg.value];
    msg.textContent = titles[alg.value] + " selected. Press Start sorting.";
  });
  $("speed").addEventListener("input", () => {
    $("speedText").textContent = [
      "Very slow",
      "Slow",
      "Normal",
      "Fast",
      "Very fast",
    ][+$("speed").value - 1];
  });
  $("top").addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
  if ("IntersectionObserver" in window) {
    let observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  } else
    document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("visible"));
  render();
})();