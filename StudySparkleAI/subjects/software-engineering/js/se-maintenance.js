document.addEventListener("DOMContentLoaded", function () {

    console.log("Software Maintenance Notes Loaded");

    const cards = document.querySelectorAll(".note-box");

    cards.forEach(function (card, index) {

        card.style.animationDelay =
            (index * 0.1) + "s";

    });

});