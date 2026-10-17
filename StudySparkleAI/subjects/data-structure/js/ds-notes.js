/* =========================================
   STUDYSPARK AI — DATA STRUCTURES
   Navigation, Search, Sidebar & Videos
========================================= */

"use strict";

/* =========================================
   ELEMENTS
========================================= */

const notesPanel = document.getElementById("notesPanel");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");
const mobileOverlay = document.getElementById("mobileOverlay");
const pageLayout = document.getElementById("pageLayout");

const videosMenuBtn = document.getElementById("videosMenuBtn");
const videosPanel = document.getElementById("videosPanel");
const videoGrid = document.getElementById("videoGrid");
const videoPlayer = document.getElementById("videoPlayer");
const videoTitle = document.getElementById("videoTitle");
const youtubeFrame = document.getElementById("youtubeFrame");
const closePlayerBtn = document.getElementById("closePlayerBtn");
const backToNotesBtn = document.getElementById("backToNotesBtn");
const pageNavigation = document.getElementById("pageNavigation");

let currentIndex = 0;
let currentView = "notes";

/* =========================================
   YOUTUBE VIDEO DATA
========================================= */

/*
  videoId madhye khara YouTube video ID tak.
  Udaharan:
  https://www.youtube.com/watch?v=ABC123xyz
  videoId: "ABC123xyz"

  Khara ID nasel tar card YouTube search page open karel.
*/

const mainTopicVideos = [
    {
        title: "Arrays",
        description: "Learn array concepts, operations and examples.",
        search: "data structures arrays tutorial",
        videoId: ""
    },
    {
        title: "Linked List",
        description: "Understand linked lists, nodes and operations.",
        search: "linked list data structure tutorial",
        videoId: ""
    },
    {
        title: "Stack",
        description: "Learn stack operations, push and pop.",
        search: "stack data structure tutorial",
        videoId: ""
    },
    {
        title: "Queue",
        description: "Understand queue operations and types.",
        search: "queue data structure tutorial",
        videoId: ""
    },
    {
        title: "Tree",
        description: "Explore binary trees and tree traversal.",
        search: "tree data structure tutorial",
        videoId: ""
    },
    {
        title: "Graph",
        description: "Learn graph representation, BFS and DFS.",
        search: "graph data structure BFS DFS tutorial",
        videoId: ""
    }
];

/* =========================================
   SIDEBAR OPEN / CLOSE
========================================= */

function isMobileView() {
    return window.matchMedia("(max-width: 900px)").matches;
}

function openSidebar() {
    if (isMobileView()) {
        sidebar.classList.add("open");
        mobileOverlay.classList.add("show");
        document.body.classList.add("menu-open");
        menuBtn.setAttribute("aria-expanded", "true");
        mobileOverlay.setAttribute("aria-hidden", "false");
    } else {
        pageLayout.classList.remove("sidebar-collapsed");
        menuBtn.setAttribute("aria-expanded", "true");
    }
}

function closeSidebar() {
    if (isMobileView()) {
        sidebar.classList.remove("open");
        mobileOverlay.classList.remove("show");
        document.body.classList.remove("menu-open");
        menuBtn.setAttribute("aria-expanded", "false");
        mobileOverlay.setAttribute("aria-hidden", "true");
    } else {
        pageLayout.classList.add("sidebar-collapsed");
        menuBtn.setAttribute("aria-expanded", "false");
    }
}

function toggleSidebar() {
    if (isMobileView()) {
        if (sidebar.classList.contains("open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    } else {
        const collapsed =
            pageLayout.classList.toggle("sidebar-collapsed");

        menuBtn.setAttribute(
            "aria-expanded",
            String(!collapsed)
        );
    }
}

if (menuBtn) {
    menuBtn.addEventListener("click", toggleSidebar);
}

if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener("click", closeSidebar);
}

if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeSidebar);
}

window.addEventListener("resize", () => {
    if (!isMobileView()) {
        sidebar.classList.remove("open");
        mobileOverlay.classList.remove("show");
        document.body.classList.remove("menu-open");
        mobileOverlay.setAttribute("aria-hidden", "true");
    } else {
        pageLayout.classList.remove("sidebar-collapsed");
    }
});

/* =========================================
   TOPIC DROPDOWNS
========================================= */

document.querySelectorAll(".group-heading").forEach(button => {
    const groupId = button.getAttribute("aria-controls");
    const group = document.getElementById(groupId);

    if (!group) return;

    const expanded = button.getAttribute("aria-expanded") !== "false";

    group.classList.toggle("is-collapsed", !expanded);

    button.addEventListener("click", () => {
        const isExpanded =
            button.getAttribute("aria-expanded") === "true";

        button.setAttribute(
            "aria-expanded",
            String(!isExpanded)
        );

        group.classList.toggle("is-collapsed", isExpanded);
    });
});

/* =========================================
   TOPIC HELPERS
========================================= */

function getTopicIndexById(noteId) {
    return topics.findIndex(topic => topic.id === noteId);
}

function setActiveTopic(index) {
    document.querySelectorAll("[data-note]").forEach(button => {
        button.classList.remove("active");
    });

    const topic = topics[index];

    if (!topic) return;

    const activeButton = document.querySelector(
        `[data-note="${topic.id}"]`
    );

    if (activeButton) {
        activeButton.classList.add("active");

        const group = activeButton.closest(".topic-group");

        if (group && group.classList.contains("is-collapsed")) {
            group.classList.remove("is-collapsed");

            const groupButton = document.querySelector(
                `[aria-controls="${group.id}"]`
            );

            if (groupButton) {
                groupButton.setAttribute("aria-expanded", "true");
            }
        }

        activeButton.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }
}

/* =========================================
   NAVIGATION STATE
========================================= */

function updateNavigation() {
    const total = topics.length;

    if (prevBtn) {
        prevBtn.disabled = currentIndex <= 0;
    }

    if (nextBtn) {
        nextBtn.disabled = currentIndex >= total - 1;
    }

    if (progressText) {
        progressText.textContent =
            `Topic ${currentIndex + 1} of ${total}`;
    }

    if (progressFill) {
        const percentage = total > 0
            ? ((currentIndex + 1) / total) * 100
            : 0;

        progressFill.style.width = `${percentage}%`;
    }
}

/* =========================================
   RENDER NOTES
========================================= */

function renderTopic(index) {
    if (!Array.isArray(topics) || topics.length === 0) {
        notesPanel.innerHTML = `
            <div class="notes-loading-placeholder">
                <div class="loading-icon">📘</div>
                <h2>No notes available</h2>
                <p>Please check your topics array in ds-notes.js.</p>
            </div>
        `;
        return;
    }

    if (index < 0 || index >= topics.length) return;

    currentIndex = index;

    const topic = topics[currentIndex];

    currentView = "notes";

    notesPanel.hidden = false;
    videosPanel.hidden = true;
    pageNavigation.hidden = false;
    searchResults.hidden = true;

    notesPanel.innerHTML = `
        <div class="notes-topic-heading">
            <div class="welcome-badge">
                <span class="badge-dot"></span>
                DATA STRUCTURES NOTES
            </div>

            <h1>${topic.title}</h1>
        </div>

        <div class="notes-topic-content">
            ${topic.content}
        </div>
    `;

    setActiveTopic(currentIndex);
    updateNavigation();

    if (searchInput) {
        searchInput.value = "";
    }

    closeVideoPlayer();

    if (isMobileView()) {
        closeSidebar();
    }
}

/* =========================================
   PREVIOUS / NEXT BUTTONS
========================================= */

if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            renderTopic(currentIndex - 1);

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    });
}

if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        if (currentIndex < topics.length - 1) {
            renderTopic(currentIndex + 1);

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    });
}

/* =========================================
   SIDEBAR TOPIC BUTTONS
========================================= */


/* =========================================
   SIDEBAR TOPIC BUTTONS
   Load Array notes in the main content area
========================================= */


/* =========================================
   SIDEBAR TOPIC BUTTONS
   Load Array notes from one HTML file
========================================= */

const externalTopicLinks = {
"array-all": {
    title: "Array",
    section: "main.notes-container",
    all: true
},
    "array-intro": {
        title: "Introduction to Array",
        section: '[data-array-topic="array-intro"]'
    },
    "array-types": {
        title: "Types of Array",
        section: '[data-array-topic="array-types"]'
    },
    "array-access": {
        title: "Array Index and Accessing Elements",
        section: '[data-array-topic="array-access"]'
    },
    "array-insert": {
        title: "Insertion",
        section: "#array-insertion",
        parent: true
    },
    "array-delete": {
        title: "Deletion",
        section: "#array-deletion",
        parent: true
    },
    "array-search": {
        title: "Searching",
        section: "#array-searching",
        parent: true
    },
    "array-sort": {
        title: "Sorting an Array",
        section: '[data-array-topic="array-sort"]'
    },
    "array-pros": {
        title: "Advantages of Array",
        section: '[data-array-topic="array-pros"]'
    }
};

let externalTopicOrder = [];
let externalTopicIndex = -1;

async function loadExternalTopic(noteId) {
    const topic = externalTopicLinks[noteId];

    if (!topic) return false;

    notesPanel.hidden = false;
    videosPanel.hidden = true;
    searchResults.hidden = true;
    pageNavigation.hidden = false;

    currentView = "notes";

    notesPanel.innerHTML = `
        <div class="notes-loading-placeholder">
            <div class="loading-icon">📘</div>
            <h2>Loading notes...</h2>
        </div>
    `;

    try {
        const response = await fetch("ds-array.html");

        if (!response.ok) {
            throw new Error("Could not load ds-array.html.");
        }

        const htmlText = await response.text();
        
const cssPath = "../css/array-notes.css";
let arrayStylesheet = document.getElementById("arrayNotesStyles");

if (!arrayStylesheet) {
    arrayStylesheet = document.createElement("link");
    arrayStylesheet.id = "arrayNotesStyles";
    arrayStylesheet.rel = "stylesheet";
    arrayStylesheet.href = cssPath;
    document.head.appendChild(arrayStylesheet);
}

        const documentData = new DOMParser().parseFromString(
            htmlText,
            "text/html"
        );

        const selectedElement = documentData.querySelector(topic.section);

        if (!selectedElement) {
            throw new Error("Requested Array section was not found.");
        }

        let contentHTML = "";

        if (topic.all) {
            contentHTML = selectedElement.innerHTML;
        } else if (topic.parent) {
            const parentSection = selectedElement.closest("section");
            const headingLevel = Number(
                selectedElement.tagName.substring(1)
            );

            contentHTML = selectedElement.outerHTML;

            let element = selectedElement.nextElementSibling;

            while (element) {
                if (
                    /^H[1-6]$/.test(element.tagName) &&
                    Number(element.tagName.substring(1)) <= headingLevel
                ) {
                    break;
                }

                contentHTML += element.outerHTML;
                element = element.nextElementSibling;
            }

            if (!parentSection) {
                throw new Error("Array operation section was not found.");
            }
        } else {
            contentHTML = selectedElement.innerHTML;
        }

        notesPanel.innerHTML = `
            <div class="notes-topic-heading">
                <div class="welcome-badge">
                    <span class="badge-dot"></span>
                    DATA STRUCTURES NOTES
                </div>
                <h1>${topic.title}</h1>
            </div>
            <div class="notes-topic-content">
                ${contentHTML}
            </div>
        `;

        document.querySelectorAll("[data-note]").forEach(button => {
            button.classList.toggle(
                "active",
                button.getAttribute("data-note") === noteId
            );
        });

        if (searchInput) {
            searchInput.value = "";
        }

        closeVideoPlayer();

        if (isMobileView()) {
            closeSidebar();
        }

        return true;
    } catch (error) {
        notesPanel.innerHTML = `
            <div class="notes-loading-placeholder">
                <div class="loading-icon">⚠️</div>
                <h2>Unable to load notes</h2>
                <p>${escapeHTML(error.message)}</p>
            </div>
        `;

        return true;
    }
}


document.querySelectorAll("[data-note]").forEach(button => {
    button.addEventListener("click", async () => {
        const noteId = button.getAttribute("data-note");

        if (await loadExternalTopic(noteId)) return;

        const index = getTopicIndexById(noteId);

        if (index !== -1) {
            renderTopic(index);
        }
    });
});


/* =========================================
   SEARCH TOPICS
========================================= */

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

function showSearchResults(query) {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
        searchResults.hidden = true;
        renderTopic(currentIndex);
        return;
    }

    const matches = topics
        .map((topic, index) => ({
            topic,
            index
        }))
        .filter(item => {
            const titleMatch =
                item.topic.title.toLowerCase().includes(normalizedQuery);

            const contentText = item.topic.content
                .replace(/<[^>]*>/g, " ")
                .toLowerCase();

            return titleMatch || contentText.includes(normalizedQuery);
        });

    notesPanel.hidden = true;
    videosPanel.hidden = true;
    pageNavigation.hidden = true;
    searchResults.hidden = false;

    if (matches.length === 0) {
        searchResults.innerHTML = `
            <h2>No topics found</h2>
            <p>Try another keyword, such as Array, Stack, Queue or Tree.</p>
        `;
        return;
    }

    searchResults.innerHTML = `
        <h2>Search Results</h2>
        <p>Found ${matches.length} matching topic(s).</p>

        ${matches.map(item => `
            <button
                type="button"
                class="topic-result-card"
                data-result-index="${item.index}"
            >
                <span class="topic-result-icon">📘</span>

                <span class="topic-result-info">
                    <strong>${escapeHTML(item.topic.title)}</strong>
                    <small>Open topic notes</small>
                </span>

                <span class="topic-result-arrow">→</span>
            </button>
        `).join("")}
    `;

    searchResults
        .querySelectorAll("[data-result-index]")
        .forEach(button => {
            button.addEventListener("click", () => {
                const index = Number(
                    button.getAttribute("data-result-index")
                );

                renderTopic(index);
            });
        });
}

if (searchInput) {
    searchInput.addEventListener("input", event => {
        showSearchResults(event.target.value);
    });
}

/* =========================================
   KEYBOARD SHORTCUTS
========================================= */

document.addEventListener("keydown", event => {
    const activeElement = document.activeElement;

    const typing = activeElement &&
        (
            activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            activeElement.isContentEditable
        );

    if ((event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k") {
        event.preventDefault();

        if (searchInput) {
            searchInput.focus();
        }

        return;
    }

    if (typing || currentView !== "notes") return;

    if (event.key === "ArrowRight" &&
        currentIndex < topics.length - 1) {
        renderTopic(currentIndex + 1);
    }

    if (event.key === "ArrowLeft" && currentIndex > 0) {
        renderTopic(currentIndex - 1);
    }

    if (event.key === "Escape") {
        closeSidebar();
    }
});

/* =========================================
   VIDEO PLAYER
========================================= */

function closeVideoPlayer() {
    if (videoPlayer) {
        videoPlayer.hidden = true;
    }

    if (youtubeFrame) {
        youtubeFrame.src = "";
    }
}

function openVideoPlayer(video) {
    if (!video) return;

    if (!video.videoId) {
        const searchURL =
            "https://www.youtube.com/results?search_query=" +
            encodeURIComponent(video.search || video.title);

        window.open(searchURL, "_blank", "noopener,noreferrer");
        return;
    }

    videoTitle.textContent = video.title;

    youtubeFrame.src =
        "https://www.youtube-nocookie.com/embed/" +
        encodeURIComponent(video.videoId) +
        "?autoplay=1&rel=0";

    videoPlayer.hidden = false;

    videoPlayer.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

/* =========================================
   RENDER VIDEO CARDS
========================================= */

function renderVideoCards() {
    if (!videoGrid) return;

    videoGrid.innerHTML = mainTopicVideos.map((video, index) => {
        const initial = escapeHTML(
            video.title.substring(0, 2).toUpperCase()
        );

        const thumbnail = video.videoId
            ? `
                <img
                    src="https://img.youtube.com/vi/${encodeURIComponent(video.videoId)}/hqdefault.jpg"
                    alt="${escapeHTML(video.title)} video thumbnail"
                    loading="lazy"
                >
            `
            : `
                <span class="video-placeholder">${initial}</span>
            `;

        return `
            <article class="video-card">

                <button
                    type="button"
                    class="video-thumbnail"
                    data-video-index="${index}"
                    aria-label="Watch ${escapeHTML(video.title)} video"
                >
                    ${thumbnail}
                    <span class="play-icon">▶</span>
                </button>

                <div class="video-card-content">
                    <h3>${escapeHTML(video.title)}</h3>

                    <p>${escapeHTML(video.description)}</p>

                    <span class="video-card-tag">
                        DATA STRUCTURES
                    </span>
                </div>

            </article>
        `;
    }).join("");

    videoGrid.querySelectorAll("[data-video-index]")
        .forEach(button => {
            button.addEventListener("click", () => {
                const index = Number(
                    button.getAttribute("data-video-index")
                );

                openVideoPlayer(mainTopicVideos[index]);
            });
        });
}

/* =========================================
   OPEN VIDEO LIBRARY
========================================= */

if (videosMenuBtn) {
    videosMenuBtn.addEventListener("click", () => {
        currentView = "videos";

        notesPanel.hidden = true;
        videosPanel.hidden = false;
        searchResults.hidden = true;
        pageNavigation.hidden = true;

        document.querySelectorAll("[data-note]").forEach(button => {
            button.classList.remove("active");
        });

        renderVideoCards();

        if (isMobileView()) {
            closeSidebar();
        }

        videosPanel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

/* =========================================
   BACK TO NOTES
========================================= */

if (backToNotesBtn) {
    backToNotesBtn.addEventListener("click", () => {
        renderTopic(currentIndex);

        notesPanel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

/* =========================================
   CLOSE VIDEO
========================================= */

if (closePlayerBtn) {
    closePlayerBtn.addEventListener("click", closeVideoPlayer);
}

/* =========================================
   INITIALIZE PAGE
========================================= */

if (Array.isArray(topics) && topics.length > 0) {
    renderTopic(0);
} else {
    notesPanel.innerHTML = `
        <div class="notes-loading-placeholder">
            <div class="loading-icon">⚠️</div>
            <h2>Topics could not be loaded</h2>
            <p>Check the topics array in ds-notes.js.</p>
        </div>
    `;
}

renderVideoCards();

console.log("StudySpark AI Data Structures page initialized.");