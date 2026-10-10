
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("subjectSearch");
    const papersGrid = document.getElementById("papersGrid");
    const subjectCount = document.getElementById("subjectCount");
    const emptyState = document.getElementById("emptyState");
    const clearSearchButton = document.getElementById("clearSearch");
    const currentYear = document.getElementById("currentYear");

    if (!searchInput || !papersGrid || !subjectCount || !emptyState) {
        return;
    }

    const cards = Array.from(papersGrid.querySelectorAll(".paper-card"));

    function filterSubjects() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        cards.forEach(function (card) {
            const title = card.querySelector("h3");
            const description = card.querySelector("p");
            const tag = card.querySelector(".subject-tag");

            const searchableText = [
                title ? title.textContent : "",
                description ? description.textContent : "",
                tag ? tag.textContent : ""
            ].join(" ").toLowerCase();

            const matches = searchableText.includes(searchTerm);

            card.hidden = !matches;

            if (matches) {
                visibleCount++;
            }
        });

        subjectCount.textContent = visibleCount;
        emptyState.hidden = visibleCount !== 0;
        papersGrid.hidden = visibleCount === 0;
    }

    searchInput.addEventListener("input", filterSubjects);

    if (clearSearchButton) {
        clearSearchButton.addEventListener("click", function () {
            searchInput.value = "";
            filterSubjects();
            searchInput.focus();
        });
    }

    // Add the real PDF file path to data-pdf in HTML.
    // Example: data-pdf="../../assets/papers/dbms.pdf"
    cards.forEach(function (card) {
        const downloadButton = card.querySelector(".download-button");

        if (!downloadButton) {
            return;
        }

        downloadButton.addEventListener("click", function (event) {
            const pdfPath = downloadButton.dataset.pdf;

            if (!pdfPath || pdfPath.trim() === "") {
                event.preventDefault();
                alert("The PDF for this subject has not been added yet.");
                return;
            }

            downloadButton.href = pdfPath;
            downloadButton.target = "_blank";
            downloadButton.rel = "noopener noreferrer";
        });
    });

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    filterSubjects();
});