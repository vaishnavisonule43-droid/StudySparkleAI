"use strict";

/* StudySpark AI - Data Structure Notes */

const topics = [
  {
    title: "Introduction to Data Structure",
    content: `
      <h2>Introduction to Data Structure</h2>
      <p>A data structure is a way of organizing and storing data in a computer.</p>
      <h3>Examples</h3>
      <ul><li>Array</li><li>Stack</li><li>Queue</li><li>Linked List</li><li>Tree</li><li>Graph</li></ul>
      <h3>Uses</h3>
      <p>Data structures help us store, search, sort and manage data efficiently.</p>
    `
  },
  {
    title: "Array",
    content: `
      <h2>Array</h2>
      <p>An array stores multiple values of the same data type under one name.</p>
      <h3>Example in C</h3>
      <pre>int a[5] = {10, 20, 30, 40, 50};</pre>
      <h3>Advantages</h3>
      <ul><li>Easy to access elements using an index.</li><li>Stores multiple values in one variable.</li></ul>
      <h3>Disadvantage</h3>
      <p>Its size is generally fixed after declaration in C.</p>
    `
  },
  {
    title: "Stack",
    content: `
      <h2>Stack</h2>
      <p>A stack is a linear data structure that follows LIFO: Last In, First Out.</p>
      <h3>Main Operations</h3>
      <ul><li>Push: Adds an element.</li><li>Pop: Removes the top element.</li><li>Peek: Shows the top element.</li></ul>
      <h3>Example</h3>
      <p>A stack of plates: the last plate placed on top is removed first.</p>
    `
  },
  {
    title: "Queue",
    content: `
      <h2>Queue</h2>
      <p>A queue is a linear data structure that follows FIFO: First In, First Out.</p>
      <h3>Main Operations</h3>
      <ul><li>Enqueue: Adds an element.</li><li>Dequeue: Removes an element.</li><li>Front: Shows the first element.</li></ul>
      <h3>Example</h3>
      <p>People waiting in a line are served in the order they arrive.</p>
    `
  },
  {
    title: "Linked List",
    content: `
      <h2>Linked List</h2>
      <p>A linked list is a collection of nodes connected using links.</p>
      <p>Each node usually contains data and a pointer to another node.</p>
      <h3>Types</h3>
      <ul><li>Singly linked list</li><li>Doubly linked list</li><li>Circular linked list</li></ul>
    `
  },
  {
    title: "Searching",
    content: `
      <h2>Searching</h2>
      <p>Searching means finding a particular element in a collection of data.</p>
      <h3>Linear Search</h3>
      <p>Checks elements one by one until the target is found or the list ends.</p>
      <h3>Binary Search</h3>
      <p>Repeatedly divides a sorted list into halves to find the target.</p>
      <p><strong>Note:</strong> Binary search requires sorted data.</p>
      <button type="button" id="startSearchDemo">Try Linear Search Demo</button>
      <div id="algorithmDemo"></div>
    `
  },
  {
    title: "Sorting",
    content: `
      <h2>Sorting</h2>
      <p>Sorting means arranging data in ascending or descending order.</p>
      <h3>Bubble Sort</h3>
      <p>Bubble sort compares adjacent elements and swaps them when they are in the wrong order.</p>
      <h3>Example</h3>
      <p>Before: 50, 20, 40, 10, 30</p>
      <p>After ascending sort: 10, 20, 30, 40, 50</p>
      <button type="button" id="startSortDemo">Try Bubble Sort Demo</button>
      <div id="algorithmDemo"></div>
    `
  },
  {
    title: "Tree",
    content: `
      <h2>Tree</h2>
      <p>A tree is a non-linear data structure made of connected nodes.</p>
      <ul><li>Root: The top node.</li><li>Parent: A node with child nodes.</li><li>Leaf: A node without children.</li></ul>
      <p>Trees are used in file systems and hierarchical data.</p>
    `
  },
  {
    title: "Graph",
    content: `
      <h2>Graph</h2>
      <p>A graph contains vertices (nodes) and edges (connections).</p>
      <p>Graphs are used in maps, social networks and computer networks.</p>
    `
  }
];

let currentIndex = 0;
let demoState = null;

function getElement(id) {
  return document.getElementById(id);
}

function renderTopic(index) {
  const panel = getElement("notesPanel");
  if (!panel || !topics.length) return;

  currentIndex = Math.max(0, Math.min(index, topics.length - 1));
  const topic = topics[currentIndex];

  panel.innerHTML = `
    <article class="note-content">
      <h1>${topic.title}</h1>
      ${topic.content}
    </article>
  `;

  const progress = getElement("progressText");
  if (progress) {
    progress.textContent = `Topic ${currentIndex + 1} of ${topics.length}`;
  }

  document.querySelectorAll("[data-note]").forEach((button) => {
    button.classList.toggle(
      "active",
      Number(button.dataset.note) === currentIndex
    );
  });

  const prev = getElement("prevBtn");
  const next = getElement("nextBtn");

  if (prev) prev.disabled = currentIndex === 0;
  if (next) next.disabled = currentIndex === topics.length - 1;

  const searchMessage = getElement("searchMessage");
  if (searchMessage) searchMessage.textContent = "";

  const searchButton = getElement("startSearchDemo");
  if (searchButton) {
    searchButton.addEventListener("click", () => renderDemo("search"));
  }

  const sortButton = getElement("startSortDemo");
  if (sortButton) {
    sortButton.addEventListener("click", () => renderDemo("sort"));
  }
}

function renderDemo(type) {
  const demo = getElement("algorithmDemo");
  if (!demo) return;

  demoState = {
    type,
    values: type === "search" ? [12, 25, 7, 40, 18] : [50, 20, 40, 10, 30],
    target: 40,
    index: 0,
    pass: 0,
    j: 0,
    finished: false
  };

  demo.innerHTML = `
    <div class="demo-card">
      <h3>${type === "search" ? "Linear Search Demo" : "Bubble Sort Demo"}</h3>
      ${type === "search" ? `
        <label for="searchTarget">Number to find</label>
        <input id="searchTarget" type="number" value="40">
      ` : ""}
      <div id="demoValues"></div>
      <p id="demoMessage">Ready to start.</p>
      <button type="button" id="nextDemoStep">Next Step</button>
      <button type="button" id="resetDemo">Reset</button>
    </div>
  `;

  const input = getElement("searchTarget");
  if (input) {
    input.addEventListener("change", () => {
      demoState.target = Number(input.value);
    });
  }

  getElement("nextDemoStep").addEventListener("click", runDemoStep);
  getElement("resetDemo").addEventListener("click", () => renderDemo(type));
  updateDemoDisplay();
}

function updateDemoDisplay() {
  if (!demoState) return;

  const valuesBox = getElement("demoValues");
  const message = getElement("demoMessage");
  if (!valuesBox || !message) return;

  valuesBox.innerHTML = demoState.values.map((value, i) => `
    <span class="demo-value" style="
      display:inline-block;
      padding:10px;
      margin:4px;
      border:1px solid #888;
      border-radius:8px;
      ${demoState.type === "search" && i === demoState.index && !demoState.finished
        ? "background:#ffe08a;color:#222;"
        : ""}
    ">${value}</span>
  `).join("");

  if (demoState.type === "search" && demoState.finished) {
    message.textContent = demoState.values[demoState.index] === demoState.target
      ? `Found ${demoState.target} at position ${demoState.index + 1}.`
      : `Search finished. ${demoState.target} was not found.`;
  } else if (demoState.type === "sort" && demoState.finished) {
    message.textContent = "Sorting completed!";
  }
}

function runDemoStep() {
  if (!demoState || demoState.finished) return;

  const message = getElement("demoMessage");

  if (demoState.type === "search") {
    if (demoState.index >= demoState.values.length) {
      demoState.finished = true;
      message.textContent = `${demoState.target} was not found.`;
    } else if (demoState.values[demoState.index] === demoState.target) {
      demoState.finished = true;
      message.textContent = `Found ${demoState.target} at position ${demoState.index + 1}.`;
    } else {
      message.textContent = `Checking ${demoState.values[demoState.index]}... not a match.`;
      demoState.index++;

      if (demoState.index >= demoState.values.length) {
        demoState.finished = true;
        message.textContent = `${demoState.target} was not found.`;
      }
    }
  } else {
    const values = demoState.values;
    const j = demoState.j;

    if (values[j] > values[j + 1]) {
      [values[j], values[j + 1]] = [values[j + 1], values[j]];
      message.textContent = `Swapped adjacent values.`;
    } else {
      message.textContent = `No swap needed for ${values[j]} and ${values[j + 1]}.`;
    }

    demoState.j++;

    if (demoState.j >= values.length - 1 - demoState.pass) {
      demoState.j = 0;
      demoState.pass++;
    }

    if (demoState.pass >= values.length - 1) {
      demoState.finished = true;
      message.textContent = "Sorting completed!";
    }
  }

  updateDemoDisplay();
}

function setupNotesPage() {
  if (!getElement("notesPanel")) return;

  document.querySelectorAll("[data-note]").forEach((button) => {
    button.addEventListener("click", () => {
      renderTopic(Number(button.dataset.note));
    });
  });

  const search = getElement("searchInput");
  if (search) {
    search.addEventListener("input", () => {
      const query = search.value.trim().toLowerCase();
      let found = -1;

      if (query) {
        found = topics.findIndex((topic) =>
          (topic.title + " " + topic.content).toLowerCase().includes(query)
        );
      }

      const message = getElement("searchMessage");

      if (!query) {
        if (message) message.textContent = "";
      } else if (found >= 0) {
        if (message) message.textContent = `Found: ${topics[found].title}`;
        renderTopic(found);
      } else {
        if (message) message.textContent = "No matching topic found.";
      }
    });
  }

  const prev = getElement("prevBtn");
  const next = getElement("nextBtn");

  if (prev) prev.addEventListener("click", () => renderTopic(currentIndex - 1));
  if (next) next.addEventListener("click", () => renderTopic(currentIndex + 1));

  renderTopic(0);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupNotesPage);
} else {
  setupNotesPage();
}