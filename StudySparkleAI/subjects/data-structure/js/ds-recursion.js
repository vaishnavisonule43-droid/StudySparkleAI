var recursionTimer;


/* =========================
   START RECURSION
========================= */

function startRecursion() {

    var input =
        document.getElementById("recursionValue");

    var value =
        parseInt(input.value);

    var visual =
        document.getElementById("recursionVisual");

    var message =
        document.getElementById("recursionMessage");


    if (isNaN(value) || value < 1 || value > 10) {

        message.innerHTML =
            "⚠️ Please enter a number between 1 and 10.";

        return;

    }


    clearTimeout(recursionTimer);

    visual.innerHTML = "";

    message.innerHTML =
        "🔄 Function calls are starting...";


    var numbers = [];

    for (var i = value; i >= 1; i--) {

        numbers.push(i);

    }


    showRecursiveSteps(numbers, 0);

}


/* =========================
   SHOW STEPS
========================= */

function showRecursiveSteps(numbers, index) {

    var visual =
        document.getElementById("recursionVisual");

    var message =
        document.getElementById("recursionMessage");


    if (index >= numbers.length) {

        var base =
            document.createElement("div");

        base.className =
            "recursion-base";

        base.innerHTML =
            "🛑 Base Condition: 1";

        visual.appendChild(base);


        var result =
            document.createElement("div");

        result.className =
            "recursion-result";

        result.innerHTML =
            "✅ Recursion stopped! " +
            "Now the function returns back.";

        visual.appendChild(result);


        message.innerHTML =
            "🎉 Base condition reached!";

        return;

    }


    var step =
        document.createElement("div");

    step.className =
        "recursion-step";

    step.innerHTML =
        "factorial(" +
        numbers[index] +
        ")";


    visual.appendChild(step);


    message.innerHTML =
        "🔁 factorial(" +
        numbers[index] +
        ") calls factorial(" +
        (numbers[index] - 1) +
        ")";


    recursionTimer = setTimeout(function () {

        showRecursiveSteps(
            numbers,
            index + 1
        );

    }, 700);

}


/* =========================
   CLEAR
========================= */

function clearRecursion() {

    clearTimeout(recursionTimer);


    document.getElementById(
        "recursionVisual"
    ).innerHTML =
        "<p>Enter a number between 1 and 10.</p>";


    document.getElementById(
        "recursionMessage"
    ).innerHTML =
        "Try Recursion Animation!";


    document.getElementById(
        "recursionValue"
    ).value = "";

}