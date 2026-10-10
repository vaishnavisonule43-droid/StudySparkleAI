let treeValues = [];


/* INSERT NODE */

function insertNode() {

    const input =
        document.getElementById("treeValue");

    const message =
        document.getElementById("treeMessage");

    const value = input.value;


    if (value === "") {

        message.innerText =
            "⚠️ Please enter a value.";

        return;
    }


    const number = Number(value);


    if (treeValues.includes(number)) {

        message.innerText =
            "⚠️ This value already exists.";

        return;
    }


    treeValues.push(number);

    treeValues.sort(function(a, b) {
        return a - b;
    });


    displayTree();


    message.innerText =
        "✅ " + number + " inserted into the tree.";

    input.value = "";

}


/* DISPLAY TREE */

function displayTree() {

    const container =
        document.getElementById("treeVisual");

    container.innerHTML = "";


    if (treeValues.length === 0) {

        container.innerHTML =
            "<p>Tree is Empty</p>";

        return;
    }


    const wrapper =
        document.createElement("div");

    wrapper.style.textAlign = "center";


    /* ROOT */

    const root =
        document.createElement("div");

    root.className = "tree-node";

    root.innerText =
        treeValues[Math.floor(treeValues.length / 2)];


    wrapper.appendChild(root);


    /* OTHER VALUES */

    const level =
        document.createElement("div");

    level.style.display = "flex";
    level.style.justifyContent = "center";
    level.style.gap = "15px";
    level.style.marginTop = "35px";
    level.style.flexWrap = "wrap";


    treeValues.forEach(function(value, index) {

        if (value != root.innerText) {

            const node =
                document.createElement("div");

            node.className = "tree-node";

            node.innerText = value;

            level.appendChild(node);

        }

    });


    wrapper.appendChild(level);

    container.appendChild(wrapper);

}


/* CLEAR TREE */

function clearTree() {

    treeValues = [];

    displayTree();


    const message =
        document.getElementById("treeMessage");

    message.innerText =
        "🗑️ Tree cleared successfully.";

}


/* INITIAL DISPLAY */

displayTree();