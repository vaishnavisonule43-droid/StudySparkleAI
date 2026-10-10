
"use strict";

/* ======================================================
   STUDYSPARK AI — QUIZ PAGE INTERACTIONS
====================================================== */

/* SUBJECT DATA */

const subjects = [
  {
    title: "Data Structure",
    category: "computer-science",
    categoryName: "Computer Science",
    description: "Explore arrays, linked lists, stacks, queues and trees.",
    level: "Core Subject",
    icon: "⌘",
    accent: "blue",
    keywords: "data structure algorithms sorting searching linked list stack queue tree"
  },
  {
    title: "Software Engineering",
    category: "computer-science",
    categoryName: "Computer Science",
    description: "Practise software development, requirements and testing.",
    level: "Core Subject",
    icon: "⚙",
    accent: "purple",
    keywords: "software engineering requirements srs testing design development"
  },
  {
    title: "Digital Marketing",
    category: "technology",
    categoryName: "Business & Marketing",
    description: "Learn SEO, social media, online advertising and analytics.",
    level: "Business",
    icon: "↗",
    accent: "orange",
    keywords: "digital marketing seo social media advertising business"
  },
  {
    title: "DBMS",
    category: "computer-science",
    categoryName: "Computer Science",
    description: "Test your knowledge of SQL, tables, keys and relationships.",
    level: "Core Subject",
    icon: "▤",
    accent: "green",
    keywords: "dbms database sql tables primary key foreign key er diagram"
  },
  {
    title: "C Programming",
    category: "programming",
    categoryName: "Programming",
    description: "Practise variables, loops, arrays, functions and pointers.",
    level: "Programming",
    icon: "C",
    accent: "blue",
    keywords: "c language programming loops arrays functions pointers structures"
  },
  {
    title: "Java Programming",
    category: "programming",
    categoryName: "Programming",
    description: "Explore classes, objects, inheritance and Java basics.",
    level: "Programming",
    icon: "J",
    accent: "orange",
    keywords: "java programming oop class object inheritance polymorphism"
  },
  {
    title: "Python Programming",
    category: "programming",
    categoryName: "Programming",
    description: "Test Python syntax, data types, loops and functions.",
    level: "Programming",
    icon: "Py",
    accent: "yellow",
    keywords: "python coding syntax data types loops functions"
  },
  {
    title: "Web Technology",
    category: "programming",
    categoryName: "Web Development",
    description: "Explore HTML, CSS, JavaScript and web fundamentals.",
    level: "Web Development",
    icon: "⌘",
    accent: "pink",
    keywords: "web development html css javascript frontend website"
  },
  {
    title: "Operating System",
    category: "computer-science",
    categoryName: "Computer Science",
    description: "Understand processes, memory, scheduling and files.",
    level: "Core Subject",
    icon: "◈",
    accent: "purple",
    keywords: "operating system os processes memory scheduling files linux"
  },
  {
    title: "Computer Networking",
    category: "computer-science",
    categoryName: "Computer Science",
    description: "Practise network types, protocols, topologies and models.",
    level: "Core Subject",
    icon: "◎",
    accent: "green",
    keywords: "networking computer network protocols osi tcp ip topology"
  },
  {
    title: "Cyber Security",
    category: "technology",
    categoryName: "Cyber Technology",
    description: "Learn about threats, safe browsing, encryption and security.",
    level: "Security",
    icon: "⌑",
    accent: "red",
    keywords: "cyber security hacking privacy encryption malware password"
  },
  {
    title: "Cloud Computing",
    category: "technology",
    categoryName: "Cloud Technology",
    description: "Explore cloud services, deployment models and storage.",
    level: "Technology",
    icon: "☁",
    accent: "blue",
    keywords: "cloud computing storage saas paas iaas aws azure"
  },
  {
    title: "Artificial Intelligence",
    category: "technology",
    categoryName: "Emerging Technology",
    description: "Discover AI concepts, machine learning and intelligent systems.",
    level: "AI & ML",
    icon: "✧",
    accent: "purple",
    keywords: "artificial intelligence ai machine learning ml neural networks"
  },
  {
    title: "Big Data",
    category: "technology",
    categoryName: "Data Technology",
    description: "Learn data volume, velocity, variety and analytics basics.",
    level: "Data Analytics",
    icon: "▥",
    accent: "orange",
    keywords: "big data analytics data science volume velocity variety"
  }
];

/* DOM ELEMENTS */

const quizGrid = document.getElementById("quizGrid");
const quizSearch = document.getElementById("quizSearch");
const visibleCount = document.getElementById("visibleCount");
const heroSubjectCount = document.getElementById("heroSubjectCount");

const emptyState = document.getElementById("emptyState");
const resetFilters = document.getElementById("resetFilters");
const clearSearch = document.getElementById("clearSearch");
const resultsMessage = document.getElementById("resultsMessage");

const toast = document.getElementById("quizToast");
const toastTitle = document.getElementById("toastTitle");
const toastMessage = document.getElementById("toastMessage");
const toastIcon = document.getElementById("toastIcon");
const closeToast = document.getElementById("closeToast");

const filterButtons = document.querySelectorAll(".filter-btn");

/* STATE */

let activeFilter = "all";
let toastTimer = null;

/* INITIAL SETUP */

document.getElementById("currentYear").textContent =
  new Date().getFullYear();

heroSubjectCount.textContent = subjects.length;

updateCategoryCounts();
applyFilters();

/* CREATE SUBJECT CARD */

function createSubjectCard(subject, index) {
  const article = document.createElement("article");

  article.className = `quiz-card accent-${subject.accent}`;
  article.dataset.category = subject.category;
  article.style.animationDelay =
    `${Math.min(index * 0.045, 0.3)}s`;

  const top = document.createElement("div");
  top.className = "card-top";

  const icon = document.createElement("span");
  icon.className = "subject-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = subject.icon;

  const category = document.createElement("span");
  category.className = "category-tag";
  category.textContent = subject.categoryName;

  top.append(icon, category);

  const title = document.createElement("h3");
  title.textContent = subject.title;

  const description = document.createElement("p");
  description.textContent = subject.description;

  const footer = document.createElement("div");
  footer.className = "card-footer";

  const level = document.createElement("span");
  level.className = "level";

  const levelDot = document.createElement("span");
  levelDot.className = "level-dot";
  levelDot.setAttribute("aria-hidden", "true");

  const levelText = document.createElement("span");
  levelText.textContent = subject.level;

  level.append(levelDot, levelText);

  const startButton = document.createElement("button");
  startButton.type = "button";
  startButton.className = "start-btn";
  startButton.dataset.subject = subject.title;
  startButton.setAttribute(
    "aria-label",
    `Select ${subject.title} quiz`
  );

  const buttonText = document.createElement("span");
  buttonText.textContent = "Start Quiz";

  const arrow = document.createElement("span");
  arrow.textContent = "↗";
  arrow.setAttribute("aria-hidden", "true");

  startButton.append(buttonText, arrow);

  startButton.addEventListener("click", () => {
    startQuiz(subject);
  });

  footer.append(level, startButton);
  article.append(top, title, description, footer);

  return article;
}

/* RENDER SUBJECTS */

function renderSubjects(list) {
  const fragment = document.createDocumentFragment();

  list.forEach((subject, index) => {
    fragment.appendChild(createSubjectCard(subject, index));
  });

  quizGrid.replaceChildren(fragment);
}

/* UPDATE CATEGORY COUNTS */

function updateCategoryCounts() {
  const allCount = document.getElementById("count-all");

  allCount.textContent = subjects.length;

  const categories = [
    "programming",
    "computer-science",
    "technology"
  ];

  categories.forEach(category => {
    const countElement =
      document.getElementById(`count-${category}`);

    const count = subjects.filter(subject =>
      subject.category === category
    ).length;

    if (countElement) {
      countElement.textContent = count;
    }
  });
}

/* SEARCH AND FILTER */

function applyFilters() {
  const query = quizSearch.value.trim().toLowerCase();

  const filteredSubjects = subjects.filter(subject => {
    const matchesCategory =
      activeFilter === "all" ||
      subject.category === activeFilter;

    const searchableText = [
      subject.title,
      subject.description,
      subject.categoryName,
      subject.level,
      subject.keywords
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(query);

    return matchesCategory && matchesSearch;
  });

  renderSubjects(filteredSubjects);

  visibleCount.textContent = filteredSubjects.length;

  emptyState.hidden = filteredSubjects.length !== 0;
  quizGrid.hidden = filteredSubjects.length === 0;

  clearSearch.hidden = query.length === 0;

  if (query && activeFilter !== "all") {
    resultsMessage.textContent =
      `Found ${filteredSubjects.length} matching subjects in ${getCategoryName(activeFilter)}.`;
  } else if (query) {
    resultsMessage.textContent =
      `Found ${filteredSubjects.length} matching subjects.`;
  } else if (activeFilter !== "all") {
    resultsMessage.textContent =
      `Showing ${filteredSubjects.length} ${getCategoryName(activeFilter)} subjects`;
  } else {
    resultsMessage.textContent =
      `Showing all ${filteredSubjects.length} subjects`;
  }
}

function getCategoryName(category) {
  const names = {
    programming: "Programming",
    "computer-science": "Computer Science",
    technology: "Technology"
  };

  return names[category] || "All";
}

/* CATEGORY FILTER EVENTS */

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach(filterButton => {
      const isActive = filterButton === button;

      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute(
        "aria-pressed",
        String(isActive)
      );
    });

    applyFilters();
  });
});

/* SEARCH EVENTS */

quizSearch.addEventListener("input", applyFilters);

clearSearch.addEventListener("click", () => {
  quizSearch.value = "";
  applyFilters();
  quizSearch.focus();
});

/* RESET FILTERS */

function resetAllFilters() {
  quizSearch.value = "";
  activeFilter = "all";

  filterButtons.forEach(button => {
    const isActive = button.dataset.filter === "all";

    button.classList.toggle("active", isActive);
    button.setAttribute(
      "aria-pressed",
      String(isActive)
    );
  });

  applyFilters();
  quizSearch.focus();
}

resetFilters.addEventListener("click", resetAllFilters);

/* KEYBOARD SHORTCUTS */

document.addEventListener("keydown", event => {
  const isShortcut =
    (event.ctrlKey || event.metaKey) &&
    event.key.toLowerCase() === "k";

  if (isShortcut) {
    event.preventDefault();
    quizSearch.focus();
  }

  if (event.key === "Escape") {
    hideToast();
  }
});

/* START QUIZ */

function startQuiz(subject) {
  showToast(
    "📚",
    `${subject.title} selected`,
    "Subject selected successfully. The actual quiz questions will be available when the quiz engine is connected."
  );
}

/* TOAST NOTIFICATION */

function showToast(icon, title, message) {
  if (toastTimer) {
    clearTimeout(toastTimer);
  }

  toastIcon.textContent = icon;
  toastTitle.textContent = title;
  toastMessage.textContent = message;

  toast.hidden = false;

  toastTimer = setTimeout(() => {
    hideToast();
  }, 4500);
}

function hideToast() {
  toast.hidden = true;

  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }
}

closeToast.addEventListener("click", hideToast);

/* END */