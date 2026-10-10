const searchData = [10, 20, 30, 40, 50, 60, 70];

const container =
    document.getElementById("searchArray");

const message =
    document.getElementById("searchMessage");


/* DISPLAY ARRAY */

function displayArray() {

    container.innerHTML = "";

    searchData.forEach(function(value) {

        const box =
            document.createElement("div");

        box.className = "search-box";

        box.innerText = value;

        container.appendChild(box);

    });

}


/* CLEAR STYLES */

function clearStyles() {

    const boxes =
        document.querySelectorAll(".search-box");

    boxes.forEach(function(box) {

        box.classList.remove("current");

        box.classList.remove("found");

        box.classList.remove("checked");

    });

}


/* LINEAR SEARCH */

async function linearSearch() {

    const value =
        Number(
            document.getElementById("searchValue").value
        );


    if (
        document.getElementById("searchValue").value === ""
    ) {

        message.innerText =
            "⚠️ Please enter a value.";

        return;

    }


    clearStyles();


    const boxes =
        document.querySelectorAll(".search-box");


    for (let i = 0; i < searchData.length; i++) {

        boxes[i].classList.add("current");


        message.innerText =
            "🔍 Checking " + searchData[i] + "...";


        await wait(700);


        if (searchData[i] === value) {

            boxes[i].classList.remove("current");

            boxes[i].classList.add("found");


            message.innerText =
                "✅ " + value +
                " found at index " + i + ".";

            return;

        }


        boxes[i].classList.remove("current");

        boxes[i].classList.add("checked");

    }


    message.innerText =
        "❌ " + value +
        " not found in the array.";

}


/* BINARY SEARCH */

async function binarySearch() {

    const value =
        Number(
            document.getElementById("searchValue").value
        );


    if (
        document.getElementById("searchValue").value === ""
    ) {

        message.innerText =
            "⚠️ Please enter a value.";

        return;

    }


    clearStyles();


    let left = 0;

    let right = searchData.length - 1;


    const boxes =
        document.querySelectorAll(".search-box");


    while (left <= right) {

        let middle =
            Math.floor((left + right) / 2);


        boxes[middle].classList.add("current");


        message.innerText =
            "⚡ Checking middle value: " +
            searchData[middle];


        await wait(900);


        if (searchData[middle] === value) {

            boxes[middle].classList.remove("current");

            boxes[middle].classList.add("found");


            message.innerText =
                "✅ " + value +
                " found at index " +
                middle + ".";

            return;

        }


        boxes[middle].classList.remove("current");

        boxes[middle].classList.add("checked");


        if (value < searchData[middle]) {

            right = middle - 1;

            message.innerText =
                "⬅️ Searching left half...";

        } else {

            left = middle + 1;

            message.innerText =
                "➡️ Searching right half...";

        }


        await wait(700);

    }


    message.innerText =
        "❌ " + value +
        " not found in the array.";

}


/* RESET */

function resetSearch() {

    clearStyles();

    displayArray();

    message.innerText =
        "🔄 Search reset. Choose a method!";

}


/* WAIT */

function wait(ms) {

    return new Promise(function(resolve) {

        setTimeout(resolve, ms);

    });

}


/* INITIAL DISPLAY */

displayArray();