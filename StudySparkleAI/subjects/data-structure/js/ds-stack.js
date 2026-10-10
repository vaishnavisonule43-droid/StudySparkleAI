let stack = [];

const maxSize = 5;


/* DISPLAY STACK */

function displayStack() {

    const container =
        document.getElementById("stackContainer");

    container.innerHTML = "";

    if (stack.length === 0) {

        container.innerHTML =
            "<p>Stack is Empty</p>";

        return;
    }


    stack.forEach(function(value, index) {

        const item =
            document.createElement("div");

        item.className = "stack-item";

        item.innerText = value;


        /* TOP element */

        if (index === stack.length - 1) {

            item.classList.add("stack-top");

            item.innerText =
                value + "  ← TOP";
        }


        container.appendChild(item);

    });

}


/* PUSH */

function pushElement() {

    const input =
        document.getElementById("stackValue");

    const message =
        document.getElementById("stackMessage");

    const value = input.value;


    if (value === "") {

        message.innerText =
            "⚠️ Please enter a value.";

        return;
    }


    if (stack.length === maxSize) {

        message.innerText =
            "❌ Stack Overflow! Stack is full.";

        return;
    }


    stack.push(Number(value));

    displayStack();


    message.innerText =
        "✅ " + value + " pushed into the stack.";


    input.value = "";

}


/* POP */

function popElement() {

    const message =
        document.getElementById("stackMessage");


    if (stack.length === 0) {

        message.innerText =
            "⚠️ Stack Underflow! Stack is empty.";

        return;
    }


    const removed =
        stack.pop();


    displayStack();


    message.innerText =
        "🗑️ " + removed + " popped from the stack.";

}


/* PEEK */

function peekElement() {

    const message =
        document.getElementById("stackMessage");


    if (stack.length === 0) {

        message.innerText =
            "⚠️ Stack is empty.";

        return;
    }


    const top =
        stack[stack.length - 1];


    message.innerText =
        "👀 TOP element is: " + top;

}


/* INITIAL DISPLAY */

displayStack();