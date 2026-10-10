document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("searchInput");
    const cards = document.querySelectorAll(".topic-card");

    searchInput.addEventListener("keyup", function () {

        let text = searchInput.value.toLowerCase();

        cards.forEach(function (card) {

            let topic = card.querySelector("h3")
                         .innerText
                         .toLowerCase();

            if (topic.includes(text)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }

        });

    });

});