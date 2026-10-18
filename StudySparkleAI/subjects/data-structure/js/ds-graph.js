// ==============================
// GRAPH VISUALIZATION
// StudySpark AI
// ==============================

document.addEventListener("DOMContentLoaded", function () {

    const nodes = ["A", "B", "C", "D", "E", "F"];

    const graph = {
        A: ["B", "C"],
        B: ["A", "D", "E"],
        C: ["A", "E"],
        D: ["B", "F"],
        E: ["B", "C", "F"],
        F: ["D", "E"]
    };

    const status = document.getElementById("graphStatus");
    const orderBox = document.getElementById("traversalOrder");
    const explanation = document.getElementById("graphExplanation");

    const bfsBtn = document.getElementById("bfsBtn");
    const dfsBtn = document.getElementById("dfsBtn");
    const nextBtn = document.getElementById("nextStepBtn");
    const playBtn = document.getElementById("autoPlayBtn");
    const resetBtn = document.getElementById("resetGraphBtn");

    const nodeElements = document.querySelectorAll(".graph-node");
    const edgeElements = document.querySelectorAll(".graph-edge");

    let steps = [];
    let stepIndex = 0;
    let timer = null;

    // RESET VISUALIZATION

    function resetGraph() {

        clearInterval(timer);
        timer = null;

        nodeElements.forEach(function (node) {
            node.classList.remove("visited", "current", "just-visited");
        });

        edgeElements.forEach(function (edge) {
            edge.classList.remove("active-edge");
        });

        steps = [];
        stepIndex = 0;

        orderBox.innerHTML = "Start BFS or DFS to see the order.";

        status.textContent = "Ready to explore";
        explanation.textContent =
            "Choose BFS or DFS to see how vertices are visited.";

        nextBtn.disabled = true;
        playBtn.disabled = true;
        playBtn.textContent = "▶ Play Animation";
    }

    // DISPLAY VISITED ORDER

    function updateOrder(visited) {

        orderBox.innerHTML = "";

        visited.forEach(function (vertex) {

            const chip = document.createElement("span");

            chip.className = "traversal-chip";
            chip.textContent = vertex;

            orderBox.appendChild(chip);
        });
    }

    // BFS

    function createBfsSteps() {

        const visited = new Set();
        const queue = ["A"];
        const result = [];

        visited.add("A");

        while (queue.length > 0) {

            const current = queue.shift();

            result.push({
                vertex: current,
                visited: [...result.map(function (step) {
                    return step.vertex;
                }), current],
                explanation:
                    "BFS visits vertex " + current +
                    " and explores its unvisited neighbours."
            });

            graph[current].forEach(function (neighbour) {

                if (!visited.has(neighbour)) {

                    visited.add(neighbour);
                    queue.push(neighbour);
                }
            });
        }

        return result;
    }

    // DFS

    function createDfsSteps() {

        const visited = new Set();
        const result = [];

        function visit(vertex) {

            visited.add(vertex);

            result.push({
                vertex: vertex,
                visited: Array.from(visited),
                explanation:
                    "DFS visits vertex " + vertex +
                    " and explores an unvisited neighbour before backtracking."
            });

            graph[vertex].forEach(function (neighbour) {

                if (!visited.has(neighbour)) {
                    visit(neighbour);
                }
            });
        }

        visit("A");

        return result;
    }

    // RUN TRAVERSAL

    function startTraversal(type) {

        resetGraph();

        steps = type === "BFS"
            ? createBfsSteps()
            : createDfsSteps();

        status.textContent = type + " traversal started";

        explanation.textContent =
            type === "BFS"
                ? "BFS uses a queue and explores nearby vertices first."
                : "DFS explores deeper along a path before backtracking.";

        nextBtn.disabled = false;
        playBtn.disabled = false;

        showNextStep();
    }

    // SHOW NEXT STEP

    function showNextStep() {

        if (stepIndex >= steps.length) {

            clearInterval(timer);
            timer = null;

            status.textContent = "Traversal completed!";

            explanation.textContent =
                "All reachable vertices have been visited.";

            nextBtn.disabled = true;
            playBtn.disabled = true;

            playBtn.textContent = "▶ Play Animation";

            return;
        }

        const step = steps[stepIndex];

        nodeElements.forEach(function (node) {

            const vertex = node.dataset.node;

            node.classList.remove("current", "just-visited");

            if (step.visited.includes(vertex)) {
                node.classList.add("visited");
            } else {
                node.classList.remove("visited");
            }
        });

        const currentNode = document.querySelector(
            '.graph-node[data-node="' + step.vertex + '"]'
        );

        if (currentNode) {
            currentNode.classList.add("current", "just-visited");
        }

        edgeElements.forEach(function (edge) {
            edge.classList.remove("active-edge");
        });

        orderBox.innerHTML = "";

        step.visited.forEach(function (vertex) {

            const chip = document.createElement("span");

            chip.className = "traversal-chip";
            chip.textContent = vertex;

            orderBox.appendChild(chip);
        });

        status.textContent =
            "Step " + (stepIndex + 1) + " of " + steps.length;

        explanation.textContent = step.explanation;

        stepIndex++;
    }

    // NEXT STEP BUTTON

    nextBtn.addEventListener("click", function () {

        if (timer !== null) {
            clearInterval(timer);
            timer = null;
        }

        playBtn.textContent = "▶ Play Animation";

        showNextStep();
    });

    // AUTO PLAY ANIMATION

    playBtn.addEventListener("click", function () {

        if (timer !== null) {

            clearInterval(timer);
            timer = null;

            playBtn.textContent = "▶ Play Animation";

            return;
        }

        if (stepIndex >= steps.length) {
            startTraversal("BFS");
            return;
        }

        playBtn.textContent = "⏸ Pause Animation";

        timer = setInterval(function () {

            showNextStep();

            if (stepIndex >= steps.length) {

                clearInterval(timer);
                timer = null;

                playBtn.textContent = "▶ Play Animation";
            }

        }, 1100);
    });

    // BUTTON EVENTS

    bfsBtn.addEventListener("click", function () {
        startTraversal("BFS");
    });

    dfsBtn.addEventListener("click", function () {
        startTraversal("DFS");
    });

    resetBtn.addEventListener("click", resetGraph);

    // INITIAL STATE

    resetGraph();

});