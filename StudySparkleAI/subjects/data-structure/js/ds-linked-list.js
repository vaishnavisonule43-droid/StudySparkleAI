let linkedList = [10, 20, 30];

function displayLinkedList() {

    const container =
        document.getElementById("linkedListContainer");

    container.innerHTML = "";

    linkedList.forEach(function(value, index) {

        const node = document.createElement("div");

        node.className = "node-item";

        node.innerHTML = `
            <div class="node-box">
                ${value}
            </div>

            <div class="node-arrow">
                →
            </div>
        `;

        container.appendChild(node);

    });


    const nullBox = document.createElement("div");

    nullBox.className = "null-box";

    nullBox.innerText = "NULL";

    container.appendChild(nullBox);
}


/* ADD NODE */

function addNode() {

    const input =
        document.getElementById("nodeValue");

    const message =
        document.getElementById("linkedMessage");

    const value = input.value;

    if (value === "") {

        message.innerText =
            "⚠️ Please enter a value.";

        return;
    }

    linkedList.push(Number(value));

    displayLinkedList();

    message.innerText =
        `✅ Node ${value} added to the Linked List.`;

    input.value = "";
}


/* DELETE LAST NODE */

function removeNode() {

    const message =
        document.getElementById("linkedMessage");

    if (linkedList.length === 0) {

        message.innerText =
            "⚠️ Linked List is empty.";

        return;
    }

    const removed =
        linkedList.pop();

    displayLinkedList();

    message.innerText =
        `🗑️ Node ${removed} deleted.`;
}


/* DISPLAY WHEN PAGE LOADS */

displayLinkedList();