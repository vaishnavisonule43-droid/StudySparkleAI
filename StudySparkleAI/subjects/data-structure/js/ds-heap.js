let heap = [];


/* DISPLAY HEAP */

function displayHeap() {

    const container =
        document.getElementById("heapVisual");

    container.innerHTML = "";


    if (heap.length === 0) {

        container.innerHTML =
            "<p>Heap is Empty</p>";

        return;
    }


    heap.forEach(function(value, index) {

        const node =
            document.createElement("div");

        node.className = "heap-node";

        node.innerText = value;

        node.title =
            "Index: " + index;

        container.appendChild(node);

    });

}


/* MAX HEAPIFY UP */

function heapifyUp(index) {

    while (index > 0) {

        let parent =
            Math.floor((index - 1) / 2);


        if (heap[parent] >= heap[index]) {
            break;
        }


        let temp =
            heap[parent];

        heap[parent] =
            heap[index];

        heap[index] =
            temp;


        index = parent;
    }

}


/* MAX HEAPIFY DOWN */

function heapifyDown(index) {

    while (true) {

        let left =
            2 * index + 1;

        let right =
            2 * index + 2;

        let largest =
            index;


        if (
            left < heap.length &&
            heap[left] > heap[largest]
        ) {

            largest = left;

        }


        if (
            right < heap.length &&
            heap[right] > heap[largest]
        ) {

            largest = right;

        }


        if (largest === index) {
            break;
        }


        let temp =
            heap[index];

        heap[index] =
            heap[largest];

        heap[largest] =
            temp;


        index = largest;

    }

}


/* INSERT */

function insertHeap() {

    const input =
        document.getElementById("heapValue");

    const message =
        document.getElementById("heapMessage");


    if (input.value === "") {

        message.innerText =
            "⚠️ Please enter a value.";

        return;

    }


    const value =
        Number(input.value);


    heap.push(value);


    heapifyUp(heap.length - 1);


    displayHeap();


    message.innerText =
        "✅ " + value +
        " inserted into Max Heap.";


    input.value = "";

}


/* DELETE ROOT */

function removeRoot() {

    const message =
        document.getElementById("heapMessage");


    if (heap.length === 0) {

        message.innerText =
            "⚠️ Heap is empty.";

        return;

    }


    const removed =
        heap[0];


    if (heap.length === 1) {

        heap.pop();

    } else {

        heap[0] =
            heap.pop();

        heapifyDown(0);

    }


    displayHeap();


    message.innerText =
        "🗑️ Root element " +
        removed +
        " deleted.";

}


/* CLEAR */

function clearHeap() {

    heap = [];


    displayHeap();


    const message =
        document.getElementById("heapMessage");

    message.innerText =
        "🗑️ Heap cleared successfully.";

}


/* INITIAL DISPLAY */

displayHeap();