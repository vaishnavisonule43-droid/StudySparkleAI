(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Reading progress and active table of contents
  const progressLine = $("#readingProgress");
  const readPercent = $("#readPercent");
  const readBar = $("#readBar");
  const navLinks = $$("#contentsNav a");
  const sections = $$(".note-section");

  function updateReadingProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
    if (progressLine) progressLine.style.width = `${progress}%`;
    if (readPercent) readPercent.textContent = `${Math.round(progress)}%`;
    if (readBar) readBar.style.width = `${progress}%`;
  }
  window.addEventListener("scroll", updateReadingProgress, { passive: true });
  updateReadingProgress();

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-22% 0px -65% 0px", threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }

  const topButton = $("#backToTop");
  if (topButton) topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const motionToggle = $("#motionToggle");
  if (motionToggle) {
    motionToggle.addEventListener("click", () => {
      const off = document.body.classList.toggle("motion-off");
      motionToggle.textContent = off ? "Motion: Off" : "Motion: On";
      motionToggle.setAttribute("aria-pressed", String(off));
    });
  }

  // Copy buttons
  $$(".copy-btn").forEach(button => {
    button.addEventListener("click", async () => {
      const text = button.dataset.copy || "";
      const oldText = button.textContent;
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = "Copied!";
      } catch {
        const helper = document.createElement("textarea");
        helper.value = text;
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        const ok = document.execCommand("copy");
        helper.remove();
        button.textContent = ok ? "Copied!" : "Select code";
      }
      window.setTimeout(() => { button.textContent = oldText; }, 1400);
    });
  });

  // Type visualizer: every type has its own direction/link animation.
  const typeConfig = {
    singly: {
      label: "TYPE 01", title: "Singly Linked List",
      description: "Each node points to the next node. The final node points to NULL.",
      facts: ["One next pointer", "Forward traversal", "Last next = NULL"],
      links: ["next"], circular: false, doubly: false
    },
    doubly: {
      label: "TYPE 02", title: "Doubly Linked List",
      description: "Each node points forward and backward, so traversal works in both directions.",
      facts: ["prev + next pointers", "Forward and backward", "Extra pointer memory"],
      links: ["prev", "next"], circular: false, doubly: true
    },
    circularSingly: {
      label: "TYPE 03", title: "Circular Singly Linked List",
      description: "The final node links back to the first node, creating a loop instead of ending at NULL.",
      facts: ["One next pointer", "Tail next = head", "Loop until head repeats"],
      links: ["next"], circular: true, doubly: false
    },
    circularDoubly: {
      label: "TYPE 04", title: "Circular Doubly Linked List",
      description: "The next and previous links form a circle in both directions.",
      facts: ["prev + next pointers", "Tail next = head", "Head prev = tail"],
      links: ["prev", "next"], circular: true, doubly: true
    }
  };

  const typeVisual = $("#typeVisual");
  const typeTitle = $("#typeTitle");
  const typeLabel = $("#typeLabel");
  const typeDescription = $("#typeDescription");
  const typeFacts = $("#typeFacts");

  function renderType(type) {
    const config = typeConfig[type] || typeConfig.singly;
    if (!typeVisual) return;
    typeVisual.replaceChildren();

    if (config.doubly) {
      const left = document.createElement("span");
      left.className = "type-null";
      left.textContent = config.circular ? "↶ loop" : "NULL";
      typeVisual.appendChild(left);
      typeVisual.appendChild(makeArrow("↔", true));
    } else {
      const head = document.createElement("span");
      head.className = "type-null";
      head.textContent = "HEAD →";
      typeVisual.appendChild(head);
    }

    [10, 20, 30].forEach((value, index) => {
      const node = document.createElement("div");
      node.className = "type-node";
      node.style.animationDelay = `${index * 100}ms`;
      const data = document.createElement("span");
      data.className = "type-data";
      data.textContent = value;
      node.appendChild(data);
      config.links.forEach(linkName => {
        const link = document.createElement("span");
        link.className = "type-link";
        link.textContent = linkName;
        node.appendChild(link);
      });
      typeVisual.appendChild(node);

      if (index < 2) {
        typeVisual.appendChild(makeArrow(config.doubly ? "↔" : "→", config.doubly));
      }
    });

    if (config.circular) {
      const loop = document.createElement("div");
      loop.className = "type-loop";
      loop.setAttribute("aria-hidden", "true");
      typeVisual.appendChild(loop);
      const loopTag = document.createElement("span");
      loopTag.className = "type-null";
      loopTag.textContent = "last ↻ head";
      typeVisual.appendChild(loopTag);
    } else {
      typeVisual.appendChild(makeArrow("→"));
      const nullTag = document.createElement("span");
      nullTag.className = "type-null";
      nullTag.textContent = "NULL";
      typeVisual.appendChild(nullTag);
    }

    if (typeTitle) typeTitle.textContent = config.title;
    if (typeLabel) typeLabel.textContent = config.label;
    if (typeDescription) typeDescription.textContent = config.description;
    if (typeFacts) {
      typeFacts.replaceChildren();
      config.facts.forEach(fact => {
        const chip = document.createElement("span");
        chip.textContent = fact;
        typeFacts.appendChild(chip);
      });
    }
  }

  function makeArrow(text, backward = false) {
    const arrow = document.createElement("span");
    arrow.className = `type-arrow${backward ? " backward" : ""}`;
    arrow.textContent = text;
    arrow.setAttribute("aria-hidden", "true");
    return arrow;
  }

  $$(".type-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      $$(".type-tab").forEach(item => {
        const active = item === tab;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });
      renderType(tab.dataset.type);
    });
  });
  renderType("singly");

  // Interactive singly linked-list playground
  const listElement = $("#simList");
  const nodeValueInput = $("#nodeValue");
  const nodeCount = $("#nodeCount");
  const emptyMessage = $("#emptyMessage");
  const simMessage = $("#simMessage");
  let values = [10, 20, 30, 40];
  let selectedIndex = null;
  let animationToken = 0;

  function showMessage(message) {
    if (simMessage) simMessage.textContent = message;
  }

  function renderList(visitIndex = null) {
    if (!listElement) return;
    listElement.replaceChildren();
    values.forEach((value, index) => {
      const item = document.createElement("div");
      item.className = "sim-node";
      item.style.animationDelay = `${Math.min(index * 45, 300)}ms`;

      const box = document.createElement("button");
      box.type = "button";
      box.className = "sim-node-box";
      if (selectedIndex === index) box.classList.add("selected");
      if (visitIndex === index) box.classList.add("visiting");
      box.setAttribute("aria-label", `Select node ${value} at position ${index + 1}`);
      const strong = document.createElement("strong");
      strong.textContent = value;
      const small = document.createElement("small");
      small.textContent = `NODE ${index + 1}`;
      box.append(strong, small);
      box.addEventListener("click", () => {
        selectedIndex = index;
        renderList();
        showMessage(`Selected node ${value} at position ${index + 1}. Enter a new value and choose Update selected to change it.`);
      });
      item.appendChild(box);

      const arrow = document.createElement("span");
      arrow.className = "sim-arrow";
      arrow.textContent = index === values.length - 1 ? "→ NULL" : "→";
      item.appendChild(arrow);
      listElement.appendChild(item);
    });

    if (nodeCount) nodeCount.textContent = values.length;
    if (emptyMessage) emptyMessage.hidden = values.length !== 0;
    if (listElement) listElement.hidden = values.length === 0;
    if (selectedIndex !== null && selectedIndex >= values.length) selectedIndex = null;
  }

  function getInputValue() {
    if (!nodeValueInput || nodeValueInput.value.trim() === "") {
      showMessage("Please enter an integer value first.");
      return null;
    }
    const value = Number(nodeValueInput.value);
    if (!Number.isInteger(value)) {
      showMessage("Please enter a whole number, such as 25.");
      return null;
    }
    return value;
  }

  function stopTraversal() { animationToken += 1; }

  const addEndBtn = $("#addEndBtn");
  if (addEndBtn) addEndBtn.addEventListener("click", () => {
    const value = getInputValue();
    if (value === null) return;
    stopTraversal();
    values.push(value);
    selectedIndex = values.length - 1;
    renderList();
    showMessage(`Node ${value} inserted at the end. The previous last node now links to it.`);
  });

  const addStartBtn = $("#addStartBtn");
  if (addStartBtn) addStartBtn.addEventListener("click", () => {
    const value = getInputValue();
    if (value === null) return;
    stopTraversal();
    values.unshift(value);
    selectedIndex = 0;
    renderList();
    showMessage(`Node ${value} inserted at the beginning. Head now points to ${value}.`);
  });

  const deleteStartBtn = $("#deleteStartBtn");
  if (deleteStartBtn) deleteStartBtn.addEventListener("click", () => {
    stopTraversal();
    if (!values.length) return showMessage("The list is already empty.");
    const removed = values.shift();
    selectedIndex = null;
    renderList();
    showMessage(`Deleted first node (${removed}). Head now points to the next node${values.length ? ` (${values[0]})` : "; the list is empty"}.`);
  });

  const deleteEndBtn = $("#deleteEndBtn");
  if (deleteEndBtn) deleteEndBtn.addEventListener("click", () => {
    stopTraversal();
    if (!values.length) return showMessage("The list is already empty.");
    const removed = values.pop();
    selectedIndex = null;
    renderList();
    showMessage(`Deleted last node (${removed}). ${values.length ? `Node ${values[values.length - 1]} now points to NULL.` : "The list is now empty."}`);
  });

  const searchBtn = $("#searchBtn");
  if (searchBtn) searchBtn.addEventListener("click", () => {
    const key = getInputValue();
    if (key === null) return;
    stopTraversal();
    const foundIndex = values.indexOf(key);
    if (foundIndex === -1) {
      selectedIndex = null;
      renderList();
      showMessage(`Value ${key} was not found in the list.`);
    } else {
      selectedIndex = foundIndex;
      renderList(foundIndex);
      showMessage(`Found ${key} at position ${foundIndex + 1}. The matching node is highlighted.`);
    }
  });

  const updateBtn = $("#updateBtn");
  if (updateBtn) updateBtn.addEventListener("click", () => {
    const value = getInputValue();
    if (value === null) return;
    if (selectedIndex === null || selectedIndex >= values.length) {
      showMessage("First click a node to select it, then enter the new value and choose Update selected.");
      return;
    }
    const oldValue = values[selectedIndex];
    values[selectedIndex] = value;
    const updatedIndex = selectedIndex;
    renderList(updatedIndex);
    showMessage(`Updated node value from ${oldValue} to ${value} at position ${updatedIndex + 1}.`);
  });

  const traverseBtn = $("#traverseBtn");
  if (traverseBtn) traverseBtn.addEventListener("click", async () => {
    stopTraversal();
    const token = animationToken;
    if (!values.length) return showMessage("The list is empty. Add nodes before traversing.");
    selectedIndex = null;
    renderList();
    showMessage("Traversal started at HEAD...");
    for (let i = 0; i < values.length; i++) {
      if (token !== animationToken) return;
      renderList(i);
      showMessage(`Visiting node ${values[i]} at position ${i + 1}...`);
      await new Promise(resolve => window.setTimeout(resolve, 650));
    }
    if (token !== animationToken) return;
    renderList();
    showMessage(`Traversal complete. Visited ${values.length} node(s), then reached NULL.`);
  });

  const resetBtn = $("#resetBtn");
  if (resetBtn) resetBtn.addEventListener("click", () => {
    stopTraversal();
    values = [10, 20, 30, 40];
    selectedIndex = null;
    renderList();
    showMessage("List reset to 10 → 20 → 30 → 40 → NULL.");
  });

  renderList();
})();