// ========================================
// StudySpark AI - Data Structures Notes
// ========================================

const topics = [
  {
    id: "intro",
    title: "Introduction to Data Structures",
    content: `
      <h2>Introduction to Data Structures</h2>
      <p>A data structure is a way of organizing and storing data in a computer.</p>
      <h3>Examples</h3>
      <ul>
        <li>Array</li>
        <li>Linked List</li>
        <li>Stack</li>
        <li>Queue</li>
        <li>Tree</li>
        <li>Graph</li>
      </ul>
      <h3>Advantages</h3>
      <ul>
        <li>Organizes data properly.</li>
        <li>Makes searching easier.</li>
        <li>Helps in efficient data processing.</li>
      </ul>
    `
  },

  {
    id: "types",
    title: "Types of Data Structures",
    content: `
      <h2>Types of Data Structures</h2>
      <h3>1. Linear Data Structure</h3>
      <p>Data elements are arranged in a sequence.</p>
      <p><b>Examples:</b> Array, Stack, Queue and Linked List.</p>

      <h3>2. Non-Linear Data Structure</h3>
      <p>Data elements are not arranged in a simple sequence.</p>
      <p><b>Examples:</b> Tree and Graph.</p>

      <h3>Other classifications</h3>
      <ul>
        <li>Static: Size is generally fixed, such as a fixed-size array.</li>
        <li>Dynamic: Size can change during program execution, such as a linked list.</li>
      </ul>
    `
  },

  {
    id: "operations",
    title: "Basic Operations",
    content: `
      <h2>Basic Operations on Data Structures</h2>
      <ul>
        <li><b>Traversal:</b> Visiting each element.</li>
        <li><b>Insertion:</b> Adding a new element.</li>
        <li><b>Deletion:</b> Removing an element.</li>
        <li><b>Searching:</b> Finding an element.</li>
        <li><b>Sorting:</b> Arranging elements in order.</li>
        <li><b>Merging:</b> Combining two data structures.</li>
      </ul>
    `
  },

  // ARRAY
  {
    id: "array-intro",
    title: "Introduction to Array",
    content: `
      <h2>Introduction to Array</h2>
      <p>An array stores multiple elements of the same data type under one name.</p>
      <h3>Example</h3>
      <pre>int marks[5] = {70, 80, 65, 90, 75};</pre>
      <h3>Features</h3>
      <ul>
        <li>Elements are stored in sequence.</li>
        <li>Each element has an index.</li>
        <li>In C, array indexing starts from 0.</li>
        <li>Elements can be accessed using their index.</li>
      </ul>
    `
  },

  {
    id: "array-types",
    title: "Types of Arrays",
    content: `
      <h2>Types of Arrays</h2>
      <h3>1. One-Dimensional Array</h3>
      <p>Stores elements in a single list.</p>
      <pre>int a[5] = {1, 2, 3, 4, 5};</pre>

      <h3>2. Two-Dimensional Array</h3>
      <p>Stores elements in rows and columns.</p>
      <pre>int a[2][2] = {{1, 2}, {3, 4}};</pre>

      <h3>3. Multidimensional Array</h3>
      <p>An array with more than two dimensions.</p>
    `
  },

  {
    id: "array-access",
    title: "Traversal and Access",
    content: `
      <h2>Array Traversal and Access</h2>
      <p><b>Traversal:</b> Visiting array elements one by one.</p>
      <p><b>Access:</b> Getting an element using its index.</p>
      <pre>
int a[3] = {10, 20, 30};
printf("%d", a[1]);
      </pre>
      <p>Output: 20</p>
      <p>Array index 1 refers to the second element.</p>
    `
  },

  {
    id: "array-insert",
    title: "Array Insertion",
    content: `
      <h2>Array Insertion</h2>
      <p>Insertion means adding a new element at a particular position.</p>
      <h3>Steps</h3>
      <ol>
        <li>Check whether space is available.</li>
        <li>Move elements one position to the right if needed.</li>
        <li>Insert the new element.</li>
        <li>Update the number of elements.</li>
      </ol>
      <p>Insertion in the middle may require shifting elements.</p>
    `
  },

  {
    id: "array-delete",
    title: "Array Deletion",
    content: `
      <h2>Array Deletion</h2>
      <p>Deletion means removing an element from an array.</p>
      <h3>Steps</h3>
      <ol>
        <li>Find the element to remove.</li>
        <li>Shift the following elements to the left.</li>
        <li>Update the number of elements.</li>
      </ol>
    `
  },

  {
    id: "array-search",
    title: "Array Searching",
    content: `
      <h2>Searching in an Array</h2>
      <h3>1. Linear Search</h3>
      <p>Checks elements one by one until the target is found or the array ends.</p>
      <h3>2. Binary Search</h3>
      <p>Repeatedly divides the search range in half. The array must be sorted.</p>
    `
  },

  {
    id: "array-sort",
    title: "Array Sorting",
    content: `
      <h2>Array Sorting</h2>
      <p>Sorting means arranging elements in ascending or descending order.</p>
      <h3>Examples</h3>
      <ul>
        <li>Bubble Sort</li>
        <li>Selection Sort</li>
        <li>Insertion Sort</li>
        <li>Merge Sort</li>
        <li>Quick Sort</li>
      </ul>
    `
  },

  {
    id: "array-pros",
    title: "Advantages and Disadvantages of Arrays",
    content: `
      <h2>Advantages of Arrays</h2>
      <ul>
        <li>Easy to use.</li>
        <li>Fast access using an index.</li>
        <li>Stores many elements under one name.</li>
      </ul>
      <h2>Disadvantages of Arrays</h2>
      <ul>
        <li>Fixed-size arrays cannot grow automatically.</li>
        <li>Insertion and deletion may require shifting.</li>
        <li>Usually stores elements of the same data type.</li>
      </ul>
    `
  },

  // LINKED LIST
  {
    id: "linked-intro",
    title: "Introduction to Linked List",
    content: `
      <h2>Introduction to Linked List</h2>
      <p>A linked list is a collection of nodes connected using links.</p>
      <p>Each node contains data and a link to another node.</p>
      <h3>Advantages</h3>
      <ul>
        <li>Can grow or shrink dynamically.</li>
        <li>Insertion and deletion can be convenient when the position is known.</li>
      </ul>
      <h3>Disadvantages</h3>
      <ul>
        <li>Extra memory is needed for links.</li>
        <li>Direct index-based access is not available.</li>
      </ul>
    `
  },

  {
    id: "linked-types",
    title: "Types of Linked List",
    content: `
      <h2>Types of Linked List</h2>
      <ul>
        <li><b>Singly Linked List:</b> Each node points to the next node.</li>
        <li><b>Doubly Linked List:</b> Each node points to the previous and next nodes.</li>
        <li><b>Circular Linked List:</b> The last node links back to the first node.</li>
      </ul>
    `
  },

  {
    id: "linked-insert",
    title: "Linked List Insertion",
    content: `
      <h2>Linked List Insertion</h2>
      <p>Insertion means adding a new node to a linked list.</p>
      <h3>Common positions</h3>
      <ul>
        <li>At the beginning.</li>
        <li>At the end.</li>
        <li>After a particular node.</li>
      </ul>
      <p>Links must be updated correctly when inserting a node.</p>
    `
  },

  {
    id: "linked-delete",
    title: "Linked List Deletion",
    content: `
      <h2>Linked List Deletion</h2>
      <p>Deletion means removing a node from a linked list.</p>
      <h3>Common cases</h3>
      <ul>
        <li>Delete the first node.</li>
        <li>Delete the last node.</li>
        <li>Delete a particular node.</li>
      </ul>
      <p>Update the links so the remaining nodes stay connected.</p>
    `
  },

  {
    id: "linked-traverse",
    title: "Linked List Traversal",
    content: `
      <h2>Linked List Traversal</h2>
      <p>Traversal means visiting nodes one by one from the starting node.</p>
      <h3>Steps</h3>
      <ol>
        <li>Start from the head node.</li>
        <li>Read the current node's data.</li>
        <li>Move to the next node.</li>
        <li>Stop when the end is reached.</li>
      </ol>
    `
  },

  // STACK
  {
    id: "stack-intro",
    title: "Introduction to Stack",
    content: `
      <h2>Introduction to Stack</h2>
      <p>A stack is a linear data structure that follows LIFO.</p>
      <p><b>LIFO:</b> Last In, First Out.</p>
      <h3>Example</h3>
      <p>A stack of plates: the last plate placed on top is removed first.</p>
      <h3>Basic operations</h3>
      <ul>
        <li>Push: Add an element.</li>
        <li>Pop: Remove the top element.</li>
        <li>Peek: View the top element.</li>
      </ul>
    `
  },

  {
    id: "stack-pushpop",
    title: "Stack Push and Pop",
    content: `
      <h2>Stack Push and Pop</h2>
      <h3>Push</h3>
      <p>Push adds a new element to the top of a stack.</p>
      <h3>Pop</h3>
      <p>Pop removes the top element from a stack.</p>
      <h3>Example</h3>
      <p>Push 10, then push 20. A pop operation removes 20 first.</p>
    `
  },

  {
    id: "stack-errors",
    title: "Stack Overflow and Underflow",
    content: `
      <h2>Stack Overflow and Underflow</h2>
      <h3>Overflow</h3>
      <p>Overflow occurs when we try to push into a full fixed-capacity stack.</p>
      <h3>Underflow</h3>
      <p>Underflow occurs when we try to pop from an empty stack.</p>
    `
  },

  {
    id: "stack-expressions",
    title: "Stack Expressions",
    content: `
      <h2>Expressions Using Stack</h2>
      <ul>
        <li><b>Infix:</b> Operator is between operands. Example: A + B</li>
        <li><b>Prefix:</b> Operator is before operands. Example: +AB</li>
        <li><b>Postfix:</b> Operator is after operands. Example: AB+</li>
      </ul>
      <p>Stacks are useful for expression conversion and evaluation.</p>
    `
  },

  {
    id: "stack-apps",
    title: "Applications of Stack",
    content: `
      <h2>Applications of Stack</h2>
      <ul>
        <li>Expression conversion and evaluation.</li>
        <li>Function calls and recursion.</li>
        <li>Undo and redo operations.</li>
        <li>Checking balanced brackets.</li>
        <li>Backtracking.</li>
      </ul>
    `
  },

  // QUEUE
  {
    id: "queue-intro",
    title: "Introduction to Queue",
    content: `
      <h2>Introduction to Queue</h2>
      <p>A queue is a linear data structure that follows FIFO.</p>
      <p><b>FIFO:</b> First In, First Out.</p>
      <p>Example: People standing in a line. The first person in line is served first.</p>
      <h3>Basic operations</h3>
      <ul>
        <li>Enqueue: Insert an element.</li>
        <li>Dequeue: Remove an element.</li>
        <li>Front: First element.</li>
        <li>Rear: Last element.</li>
      </ul>
    `
  },

  {
    id: "queue-types",
    title: "Types of Queue",
    content: `
      <h2>Types of Queue</h2>
      <ul>
        <li><b>Simple Queue:</b> Follows FIFO.</li>
        <li><b>Circular Queue:</b> The last position connects back to the first.</li>
        <li><b>Priority Queue:</b> Elements are processed according to priority.</li>
        <li><b>Deque:</b> Insertion and deletion are allowed at both ends.</li>
      </ul>
    `
  },

  {
    id: "queue-operations",
    title: "Queue Operations",
    content: `
      <h2>Queue Operations</h2>
      <ul>
        <li><b>Enqueue:</b> Adds an element at the rear.</li>
        <li><b>Dequeue:</b> Removes an element from the front.</li>
        <li><b>Peek:</b> Views the front element.</li>
        <li><b>isEmpty:</b> Checks whether the queue is empty.</li>
        <li><b>isFull:</b> Checks whether a fixed-size queue is full.</li>
      </ul>
    `
  },

  {
    id: "queue-circular",
    title: "Circular Queue",
    content: `
      <h2>Circular Queue</h2>
      <p>A circular queue connects the last position back to the first position.</p>
      <h3>Advantages</h3>
      <ul>
        <li>Reuses empty spaces.</li>
        <li>Reduces wasted space compared with a simple array queue.</li>
      </ul>
      <h3>Applications</h3>
      <ul>
        <li>CPU scheduling.</li>
        <li>Buffer management.</li>
      </ul>
    `
  },

  {
    id: "queue-priority",
    title: "Priority Queue",
    content: `
      <h2>Priority Queue</h2>
      <p>A priority queue processes elements according to their priority.</p>
      <p>An element with higher priority is served first according to the chosen priority rule.</p>
      <h3>Applications</h3>
      <ul>
        <li>Operating systems.</li>
        <li>Scheduling tasks.</li>
        <li>Graph algorithms.</li>
      </ul>
    `
  },

  // TREE
  {
    id: "tree-intro",
    title: "Introduction to Tree",
    content: `
      <h2>Introduction to Tree</h2>
      <p>A tree is a non-linear data structure made of connected nodes.</p>
      <ul>
        <li><b>Root:</b> The topmost node.</li>
        <li><b>Parent:</b> A node with child nodes.</li>
        <li><b>Child:</b> A node connected below a parent.</li>
        <li><b>Leaf:</b> A node with no children.</li>
      </ul>
      <p>Trees are used to represent hierarchical data.</p>
    `
  },

  {
    id: "tree-binary",
    title: "Binary Tree",
    content: `
      <h2>Binary Tree</h2>
      <p>A binary tree is a tree in which each node has at most two children.</p>
      <p>These children are called the left child and right child.</p>
      <h3>Applications</h3>
      <ul>
        <li>Searching.</li>
        <li>Expression trees.</li>
        <li>Representing hierarchical information.</li>
      </ul>
    `
  },

  {
    id: "tree-bst",
    title: "Binary Search Tree</h2>",
    content: `
      <h2>Binary Search Tree</h2>
      <p>A Binary Search Tree (BST) is a binary tree arranged to support searching.</p>
      <ul>
        <li>Values smaller than a node are placed in its left subtree.</li>
        <li>Values larger than a node are placed in its right subtree.</li>
      </ul>
      <p>Duplicate values depend on the implementation's rules.</p>
    `
  },

  {
    id: "tree-traversal",
    title: "Tree Traversal",
    content: `
      <h2>Tree Traversal</h2>
      <p>Tree traversal means visiting the nodes of a tree in a particular order.</p>
      <ul>
        <li><b>Preorder:</b> Root, Left, Right.</li>
        <li><b>Inorder:</b> Left, Root, Right.</li>
        <li><b>Postorder:</b> Left, Right, Root.</li>
        <li><b>Level Order:</b> Visit nodes level by level.</li>
      </ul>
    `
  },

  // GRAPH
  {
    id: "graph-intro",
    title: "Introduction to Graph",
    content: `
      <h2>Introduction to Graph</h2>
      <p>A graph is a non-linear data structure consisting of vertices and edges.</p>
      <ul>
        <li><b>Vertex:</b> A node in a graph.</li>
        <li><b>Edge:</b> A connection between vertices.</li>
      </ul>
      <h3>Types</h3>
      <ul>
        <li>Directed graph.</li>
        <li>Undirected graph.</li>
        <li>Weighted graph.</li>
        <li>Unweighted graph.</li>
      </ul>
    `
  },

  {
    id: "graph-representation",
    title: "Graph Representation",
    content: `
      <h2>Graph Representation</h2>
      <h3>1. Adjacency Matrix</h3>
      <p>A two-dimensional matrix represents connections between vertices.</p>
      <h3>2. Adjacency List</h3>
      <p>Each vertex stores a list of its neighbouring vertices.</p>
      <p>Both methods are used to store graph information.</p>
    `
  },

  {
    id: "graph-bfs",
    title: "Breadth First Search (BFS)",
    content: `
      <h2>Breadth First Search (BFS)</h2>
      <p>BFS visits nearby vertices level by level.</p>
      <p>It commonly uses a queue.</p>
      <h3>Basic steps</h3>
      <ol>
        <li>Start from a selected vertex.</li>
        <li>Visit its unvisited neighbours.</li>
        <li>Add new neighbours to the queue.</li>
        <li>Continue until the required vertices are visited.</li>
      </ol>
    `
  },

  {
    id: "graph-dfs",
    title: "Depth First Search (DFS)",
    content: `
      <h2>Depth First Search (DFS)</h2>
      <p>DFS explores one path as far as possible before backtracking.</p>
      <p>It can use a stack or recursion.</p>
      <h3>Basic steps</h3>
      <ol>
        <li>Start from a selected vertex.</li>
        <li>Visit an unvisited neighbour.</li>
        <li>Continue deeper along the path.</li>
        <li>Backtrack when no unvisited neighbour remains.</li>
      </ol>
    `
  }
];

// ========================================
// Page functionality
// ========================================

let currentIndex = 0;

const notesPanel = document.getElementById("notesPanel");
const progressText = document.getElementById("progressText");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const searchInput = document.getElementById("searchInput");
const searchMessage = document.getElementById("searchMessage");

function renderTopic(index) {
  if (index < 0 || index >= topics.length) return;

  currentIndex = index;

  const topic = topics[currentIndex];

  notesPanel.innerHTML = `
    <div class="note-content">
      <h1>${topic.title}</h1>
      ${topic.content}
    </div>
  `;

  progressText.textContent =
    `Topic ${currentIndex + 1} of ${topics.length}`;

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === topics.length - 1;

  document.querySelectorAll(".topic-btn[data-note]").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.note === topic.id
    );
  });

  if (searchMessage) {
    searchMessage.textContent = "Choose a topic from the left menu.";
  }
}

// Sidebar topic click
document.querySelectorAll(".topic-btn[data-note]").forEach((button) => {
  button.addEventListener("click", () => {
    const topicId = button.dataset.note;

    const topicIndex = topics.findIndex(
      (topic) => topic.id === topicId
    );

    if (topicIndex !== -1) {
      renderTopic(topicIndex);
    }
  });
});

// Previous button
if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    renderTopic(currentIndex - 1);
  });
}

// Next button
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    renderTopic(currentIndex + 1);
  });
}

// Search topics
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    document.querySelectorAll(".topic-btn[data-note]").forEach((button) => {
      const topic = topics.find(
        (item) => item.id === button.dataset.note
      );

      const title = topic ? topic.title.toLowerCase() : "";
      const label = button.textContent.trim().toLowerCase();

      button.style.display =
        !query || title.includes(query) || label.includes(query)
          ? "block"
          : "none";
    });

    if (!query) {
      searchMessage.textContent = "Choose a topic from the left menu.";
      return;
    }

    const matches = topics.filter((topic) => {
      return (
        topic.title.toLowerCase().includes(query) ||
        topic.content.toLowerCase().includes(query)
      );
    });

    searchMessage.textContent = matches.length
      ? `${matches.length} matching topic(s) found.`
      : "No matching topics found.";
  });
}

// Mobile sidebar
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const mobileOverlay = document.getElementById("mobileOverlay");

if (menuBtn && sidebar && mobileOverlay) {
  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    mobileOverlay.classList.toggle("show");
  });

  mobileOverlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    mobileOverlay.classList.remove("show");
  });

  document.querySelectorAll(".topic-btn").forEach((button) => {
    button.addEventListener("click", () => {
      sidebar.classList.remove("open");
      mobileOverlay.classList.remove("show");
    });
  });
}

// Collapsible topic groups
// Group headings already call toggleTopics() from the HTML.

// Load the first topic
renderTopic(0);