let array = [75, 82, 68, 90, 78];

function displayArray() {
    const container = document.getElementById("arrayContainer");

    container.innerHTML = "";

    array.forEach(function(value, index) {

        const item = document.createElement("div");

        item.className = "array-item";

        item.innerHTML = `
            <div class="array-box">${value}</div>
            <div class="array-index">Index ${index}</div>
        `;

        container.appendChild(item);
    });
}


// ADD
function addElement() {

    const input = document.getElementById("arrayValue");
    const message = document.getElementById("arrayMessage");

    const value = input.value;

    if (value === "") {
        message.innerText = "⚠️ Please enter a value.";
        return;
    }

    if (array.length >= 8) {
        message.innerText = "⚠️ Maximum 8 elements allowed.";
        return;
    }

    array.push(Number(value));

    displayArray();

    message.innerText =
        `✅ ${value} added at Index ${array.length - 1}`;

    input.value = "";
}


// SEARCH
function searchElement() {

    const input = document.getElementById("arrayValue");
    const message = document.getElementById("arrayMessage");

    if (input.value === "") {
        message.innerText = "⚠️ Enter a value to search.";
        return;
    }

    const value = Number(input.value);

    const index = array.indexOf(value);

    if (index !== -1) {

        const items = document.querySelectorAll(".array-item");

        items[index].classList.add("found");

        message.innerText =
            `🎯 ${value} found at Index ${index}!`;

        setTimeout(function() {
            items[index].classList.remove("found");
        }, 1500);

    } else {

        message.innerText =
            `❌ ${value} is not found in the Array.`;
    }
}


// DELETE
function deleteElement() {

    const input = document.getElementById("arrayValue");
    const message = document.getElementById("arrayMessage");

    if (input.value === "") {
        message.innerText = "⚠️ Enter a value to delete.";
        return;
    }

    const value = Number(input.value);

    const index = array.indexOf(value);

    if (index !== -1) {

        array.splice(index, 1);

        displayArray();

        message.innerText =
            `🗑️ ${value} deleted from Index ${index}.`;

    } else {

        message.innerText =
            `❌ ${value} is not found.`;
    }

    input.value = "";
}


// DISPLAY ARRAY WHEN PAGE LOADS
displayArray();