var vertices = [];

var positions = [
    { x: 50, y: 40 },
    { x: 250, y: 40 },
    { x: 150, y: 130 },
    { x: 50, y: 220 },
    { x: 250, y: 220 },
    { x: 150, y: 270 }
];

var animationTimer;


/* =========================
   ADD VERTEX
========================= */

function addVertex() {

    var message =
        document.getElementById("graphMessage");

    if (vertices.length >= 6) {

        message.innerHTML =
            "⚠️ Maximum 6 vertices allowed.";

        return;
    }


    var letter =
        String.fromCharCode(65 + vertices.length);

    vertices.push(letter);

    displayGraph();


    message.innerHTML =
        "✅ Vertex " + letter + " added.";

}


/* =========================
   DISPLAY GRAPH
========================= */

function displayGraph() {

    var visual =
        document.getElementById("graphVisual");

    visual.innerHTML = "";


    for (var i = 0; i < vertices.length; i++) {

        var node =
            document.createElement("div");

        node.className = "graph-node";

        node.innerHTML = vertices[i];

        node.style.left =
            positions[i].x + "px";

        node.style.top =
            positions[i].y + "px";


        node.setAttribute(
            "data-node",
            vertices[i]
        );


        visual.appendChild(node);

    }

}


/* =========================
   BFS
========================= */

function startBFS() {

    if (vertices.length === 0) {

        document.getElementById(
            "graphMessage"
        ).innerHTML =
            "⚠️ First add some vertices.";

        return;
    }


    stopAnimation();

    removeClasses();


    var i = 0;

    document.getElementById(
        "graphMessage"
    ).innerHTML =
        "🔵 BFS visits vertices level by level.";


    animationTimer =
        setInterval(function () {

            if (i >= vertices.length) {

                stopAnimation();

                return;
            }


            var nodes =
                document.querySelectorAll(
                    ".graph-node"
                );


            nodes[i].classList.add(
                "bfs-active"
            );


            i++;

        }, 700);

}


/* =========================
   DFS
========================= */

function startDFS() {

    if (vertices.length === 0) {

        document.getElementById(
            "graphMessage"
        ).innerHTML =
            "⚠️ First add some vertices.";

        return;
    }


    stopAnimation();

    removeClasses();


    var i = vertices.length - 1;


    document.getElementById(
        "graphMessage"
    ).innerHTML =
        "🟢 DFS goes deep before coming back.";


    animationTimer =
        setInterval(function () {

            if (i < 0) {

                stopAnimation();

                return;
            }


            var nodes =
                document.querySelectorAll(
                    ".graph-node"
                );


            nodes[i].classList.add(
                "dfs-active"
            );


            i--;

        }, 700);

}


/* =========================
   REMOVE CLASSES
========================= */

function removeClasses() {

    var nodes =
        document.querySelectorAll(
            ".graph-node"
        );


    for (var i = 0; i < nodes.length; i++) {

        nodes[i].classList.remove(
            "bfs-active"
        );

        nodes[i].classList.remove(
            "dfs-active"
        );

    }

}


/* =========================
   STOP
========================= */

function stopAnimation() {

    if (animationTimer) {

        clearInterval(animationTimer);

        animationTimer = null;

    }

}


/* =========================
   CLEAR
========================= */

function clearGraph() {

    stopAnimation();

    vertices = [];

    document.getElementById(
        "graphVisual"
    ).innerHTML = "";


    document.getElementById(
        "graphMessage"
    ).innerHTML =
        "🗑️ Graph cleared. Add vertices to start!";

}