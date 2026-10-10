let queue = [];

const maxSize = 5;


/* DISPLAY QUEUE */

function displayQueue() {

    const container =
        document.getElementById("queueContainer");

    container.innerHTML = "";

    if (queue.length === 0) {

        container.innerHTML =
            "<p>Queue is Empty</p>";

        return;
    }


    queue.forEach(function(value, index) {

        const item =
            document.createElement("div");

        item.className = "queue-item";

        item.innerText = value;


        /* FRONT */

        if (index === 0) {

            item.classList.add("queue-front");

            item.innerText =
                value + " ← FRONT";
        }


        /* REAR */

        if (index === queue.length - 1 &&
            queue.length > 1) {

            item.innerText =
                value + " ← REAR";
        }


        container.appendChild(item);

    });

}


/* ENQUEUE */

function enqueueElement() {

    const input =
        document.getElementById("queueValue");

    const message =
        document.getElementById("queueMessage");

    const value = input.value;


    if (value === "") {

        message.innerText =
            "⚠️ Please enter a value.";

        return;
    }


    if (queue.length === maxSize) {

        message.innerText =
            "❌ Queue Overflow! Queue is full.";

        return;
    }


    queue.push(Number(value));

    displayQueue();


    message.innerText =
        "✅ " + value + " added to the queue.";


    input.value = "";

}


/* DEQUEUE */

function dequeueElement() {

    const message =
        document.getElementById("queueMessage");


    if (queue.length === 0) {

        message.innerText =
            "⚠️ Queue Underflow! Queue is empty.";

        return;
    }


    const removed =
        queue.shift();


    displayQueue();


    message.innerText =
        "🗑️ " + removed + " removed from the queue.";

}


/* PEEK */

function peekQueue() {

    const message =
        document.getElementById("queueMessage");


    if (queue.length === 0) {

        message.innerText =
            "⚠️ Queue is empty.";

        return;
    }


    message.innerText =
        "👀 FRONT element is: " + queue[0];

}


/* INITIAL DISPLAY */

displayQueue();