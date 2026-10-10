var hashSize = 10;

var hashData = [];

for (var i = 0; i < hashSize; i++) {
    hashData[i] = [];
}


/* =========================
   INSERT
========================= */

function insertHash() {

    var input = document.getElementById("hashKey");

    var key = parseInt(input.value);

    var message = document.getElementById("hashMessage");

    if (isNaN(key)) {

        message.innerHTML = "⚠️ Please enter a number.";

        return;
    }


    var index = key % hashSize;

    if (index < 0) {
        index = index + hashSize;
    }


    var slot = document.querySelectorAll(".hash-slot")[index];

    slot.classList.add("active");


    setTimeout(function () {

        slot.classList.remove("active");


        if (hashData[index].indexOf(key) === -1) {

            hashData[index].push(key);

            displayHash();

            message.innerHTML =
                "✅ Key " + key +
                " is stored at index " + index + ".";

        } else {

            message.innerHTML =
                "⚠️ Key " + key +
                " already exists.";

        }

    }, 500);


    input.value = "";
}


/* =========================
   DISPLAY
========================= */

function displayHash() {

    var slots = document.querySelectorAll(".hash-slot");

    for (var i = 0; i < hashSize; i++) {

        var dataBox =
            slots[i].querySelector(".slot-data");

        if (hashData[i].length > 0) {

            dataBox.innerHTML =
                hashData[i].join(", ");

        } else {

            dataBox.innerHTML = "";

        }
    }
}


/* =========================
   SEARCH
========================= */

function searchHash() {

    var input = document.getElementById("hashKey");

    var key = parseInt(input.value);

    var message = document.getElementById("hashMessage");

    if (isNaN(key)) {

        message.innerHTML =
            "⚠️ Please enter a number.";

        return;
    }


    var index = key % hashSize;

    if (index < 0) {
        index = index + hashSize;
    }


    var slot =
        document.querySelectorAll(".hash-slot")[index];


    if (hashData[index].indexOf(key) !== -1) {

        slot.classList.add("found");

        message.innerHTML =
            "🔍 Key " + key +
            " found at index " + index + ".";


        setTimeout(function () {

            slot.classList.remove("found");

        }, 2000);


    } else {

        message.innerHTML =
            "❌ Key " + key + " was not found.";

    }


    input.value = "";
}


/* =========================
   CLEAR
========================= */

function clearHash() {

    for (var i = 0; i < hashSize; i++) {

        hashData[i] = [];

    }


    displayHash();


    document.getElementById("hashMessage").innerHTML =
        "🗑️ Hash table cleared.";
}