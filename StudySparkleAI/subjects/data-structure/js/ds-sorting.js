// ==========================================
// COMMON FUNCTION
// ==========================================

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function showBoxes(id, arr) {

    const container = document.getElementById(id);

    if (!container) return;

    container.innerHTML = "";

    arr.forEach(value => {

        const box = document.createElement("div");

        box.className = "number-box";

        box.innerText = value;

        container.appendChild(box);

    });
}


// ==========================================
// 1. BUBBLE SORT TYPE
// ==========================================

async function startBubbleExample() {

    let arr = [50, 20, 40, 10];

    const message =
        document.getElementById("bubbleMessage");

    showBoxes("bubbleAnimation", arr);

    message.innerText =
        "🔍 Comparing adjacent elements...";

    for (let i = 0; i < arr.length - 1; i++) {

        for (let j = 0; j < arr.length - i - 1; j++) {

            let boxes =
                document.querySelectorAll(
                    "#bubbleAnimation .number-box"
                );

            boxes[j].classList.add("active");
            boxes[j + 1].classList.add("active");

            await wait(700);

            if (arr[j] > arr[j + 1]) {

                let temp = arr[j];

                arr[j] = arr[j + 1];

                arr[j + 1] = temp;

                showBoxes("bubbleAnimation", arr);

                await wait(400);
            }

        }
    }

    let boxes =
        document.querySelectorAll(
            "#bubbleAnimation .number-box"
        );

    boxes.forEach(box =>
        box.classList.add("done")
    );

    message.innerText =
        "✅ Bubble Sort completed!";
}


// ==========================================
// 2. SELECTION SORT
// ==========================================

async function startSelectionExample() {

    let arr = [40, 20, 50, 10];

    const message =
        document.getElementById("selectionMessage");

    showBoxes("selectionAnimation", arr);

    for (let i = 0; i < arr.length - 1; i++) {

        let min = i;

        message.innerText =
            "🔎 Finding smallest element...";

        let boxes =
            document.querySelectorAll(
                "#selectionAnimation .number-box"
            );

        boxes[min].classList.add("selected");

        await wait(700);

        for (let j = i + 1; j < arr.length; j++) {

            boxes =
                document.querySelectorAll(
                    "#selectionAnimation .number-box"
                );

            boxes[j].classList.add("active");

            await wait(400);

            if (arr[j] < arr[min]) {
                min = j;
            }

            boxes[j].classList.remove("active");
        }

        let temp = arr[i];

        arr[i] = arr[min];

        arr[min] = temp;

        showBoxes("selectionAnimation", arr);

        await wait(700);
    }

    let finalBoxes =
        document.querySelectorAll(
            "#selectionAnimation .number-box"
        );

    finalBoxes.forEach(box =>
        box.classList.add("done")
    );

    message.innerText =
        "✅ Selection Sort completed!";
}


// ==========================================
// 3. INSERTION SORT
// ==========================================

async function startInsertionExample() {

    let arr = [20, 50, 40, 10];

    const message =
        document.getElementById("insertionMessage");

    showBoxes("insertionAnimation", arr);

    for (let i = 1; i < arr.length; i++) {

        let key = arr[i];

        let j = i - 1;

        message.innerText =
            "📌 Inserting " + key + " into correct position...";

        let boxes =
            document.querySelectorAll(
                "#insertionAnimation .number-box"
            );

        boxes[i].classList.add("active");

        await wait(700);

        while (j >= 0 && arr[j] > key) {

            arr[j + 1] = arr[j];

            j--;

            showBoxes("insertionAnimation", arr);

            await wait(500);
        }

        arr[j + 1] = key;

        showBoxes("insertionAnimation", arr);

        await wait(600);
    }

    let finalBoxes =
        document.querySelectorAll(
            "#insertionAnimation .number-box"
        );

    finalBoxes.forEach(box =>
        box.classList.add("done")
    );

    message.innerText =
        "✅ Insertion Sort completed!";
}


// ==========================================
// 4. MERGE SORT
// ==========================================

async function startMergeExample() {

    const message =
        document.getElementById("mergeMessage");

    const steps = [

        [50, 20, 40, 10],

        [50, 20],
        [40, 10],

        [20, 50],
        [10, 40],

        [10, 20, 40, 50]

    ];

    const texts = [

        "📦 Original Array",

        "✂️ Dividing left part",

        "✂️ Dividing right part",

        "🔄 Sorting left part",

        "🔄 Sorting right part",

        "🔗 Merging sorted parts"

    ];

    for (let i = 0; i < steps.length; i++) {

        showBoxes(
            "mergeAnimation",
            steps[i]
        );

        message.innerText =
            texts[i];

        await wait(900);
    }

    let boxes =
        document.querySelectorAll(
            "#mergeAnimation .number-box"
        );

    boxes.forEach(box =>
        box.classList.add("done")
    );

    message.innerText =
        "✅ Merge Sort completed!";
}


// ==========================================
// 5. QUICK SORT
// ==========================================

async function startQuickExample() {

    const message =
        document.getElementById("quickMessage");

    const steps = [

        [50, 20, 40, 10, 30],

        [20, 10, 30, 50, 40],

        [10, 20, 30, 40, 50]

    ];

    const texts = [

        "📦 Original Array",

        "🔴 Pivot = 30 and partitioning...",

        "✅ Array Sorted"

    ];

    for (let i = 0; i < steps.length; i++) {

        showBoxes(
            "quickAnimation",
            steps[i]
        );

        message.innerText =
            texts[i];

        let boxes =
            document.querySelectorAll(
                "#quickAnimation .number-box"
            );

        if (i === 1) {

            boxes[2].classList.add("pivot");

        }

        await wait(1000);
    }

    let boxes =
        document.querySelectorAll(
            "#quickAnimation .number-box"
        );

    boxes.forEach(box =>
        box.classList.add("done")
    );

    message.innerText =
        "✅ Quick Sort completed!";
}


// ==========================================
// OLD BUBBLE SORT - LOWER ANIMATION
// ==========================================

let numbers = [50, 20, 40, 10, 30];

let sortingRunning = false;


function displaySorting() {

    const container =
        document.getElementById("sortingVisual");

    if (!container) return;

    container.innerHTML = "";

    numbers.forEach(value => {

        const bar =
            document.createElement("div");

        bar.className = "sort-bar";

        bar.style.height =
            (value * 3) + "px";

        bar.innerText = value;

        container.appendChild(bar);

    });
}


// ==========================================
// OLD START BUBBLE SORT BUTTON
// ==========================================

async function startBubbleSort() {

    if (sortingRunning) return;

    sortingRunning = true;

    const message =
        document.getElementById("sortingMessage");

    message.innerText =
        "🔄 Bubble Sort is running...";


    for (let i = 0; i < numbers.length - 1; i++) {

        for (let j = 0;
             j < numbers.length - i - 1;
             j++) {

            let bars =
                document.querySelectorAll(".sort-bar");

            bars[j].classList.add("compare");

            bars[j + 1].classList.add("compare");

            message.innerText =
                "🔍 Comparing " +
                numbers[j] +
                " and " +
                numbers[j + 1];

            await wait(600);


            if (numbers[j] > numbers[j + 1]) {

                let temp = numbers[j];

                numbers[j] = numbers[j + 1];

                numbers[j + 1] = temp;

                displaySorting();

                await wait(400);
            }


            bars =
                document.querySelectorAll(".sort-bar");

            if (bars[j]) {
                bars[j].classList.remove("compare");
            }

            if (bars[j + 1]) {
                bars[j + 1].classList.remove("compare");
            }
        }
    }


    let finalBars =
        document.querySelectorAll(".sort-bar");

    finalBars.forEach(bar =>
        bar.classList.add("sorted")
    );


    message.innerText =
        "✅ Sorting completed!";

    sortingRunning = false;
}


// ==========================================
// RESET BUTTON
// ==========================================

function resetSort() {

    if (sortingRunning) return;

    numbers = [50, 20, 40, 10, 30];

    displaySorting();

    const message =
        document.getElementById("sortingMessage");

    if (message) {

        message.innerText =
            "🔄 Ready to sort!";

    }
}


// ==========================================
// PAGE LOAD
// ==========================================

displaySorting();