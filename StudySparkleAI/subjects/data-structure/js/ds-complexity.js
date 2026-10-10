var complexityTimer;


/* =========================
   SHOW COMPLEXITY
========================= */

function showComplexity(type) {

    clearTimeout(complexityTimer);

    var visual =
        document.getElementById("complexityVisual");

    var message =
        document.getElementById("complexityMessage");


    visual.innerHTML = "";


    if (type === "O(1)") {

        message.innerHTML =
            "⚡ O(1) → Constant Time";

        createOperations(1);

    }


    else if (type === "O(log n)") {

        message.innerHTML =
            "🚀 O(log n) → Input reduces quickly";

        createOperations(5);

    }


    else if (type === "O(n)") {

        message.innerHTML =
            "🔵 O(n) → Operations increase linearly";

        createOperations(15);

    }


    else if (type === "O(n log n)") {

        message.innerHTML =
            "🟠 O(n log n) → Common in efficient sorting";

        createOperations(30);

    }


    else if (type === "O(n²)") {

        message.innerHTML =
            "🔴 O(n²) → Operations increase quickly";

        createOperations(50);

    }

}


/* =========================
   CREATE OPERATIONS
========================= */

function createOperations(count) {

    var visual =
        document.getElementById("complexityVisual");


    for (var i = 1; i <= count; i++) {

        var box =
            document.createElement("span");

        box.className =
            "operation";

        box.innerHTML =
            i;

        visual.appendChild(box);

    }

}


/* =========================
   RESET
========================= */

function resetComplexity() {

    clearTimeout(complexityTimer);


    document.getElementById(
        "complexityVisual"
    ).innerHTML =
        "<p>Select a complexity above.</p>";


    document.getElementById(
        "complexityMessage"
    ).innerHTML =
        "Choose a Big O notation.";

}