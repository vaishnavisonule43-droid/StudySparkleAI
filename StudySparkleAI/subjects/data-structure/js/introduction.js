// ==============================
// INTRODUCTION PAGE - JAVASCRIPT
// StudySpark AI
// ==============================


// DISPLAY PAGE MESSAGE
function showIntroductionMessage() {

    const message = document.getElementById("introMessage");

    if (message) {
        message.innerText =
            "Welcome to Data Structures! Start learning step by step.";
    }
}


// COPY CODE
function copyCode(button) {

    const codeBlock = button.closest(".code-block");

    if (!codeBlock) {
        return;
    }

    const code = codeBlock.querySelector("code");

    if (!code) {
        return;
    }

    const text = code.innerText;

    navigator.clipboard.writeText(text)
        .then(function() {

            const originalText = button.innerText;

            button.innerText = "Copied!";
            button.classList.add("copied");

            setTimeout(function() {
                button.innerText = originalText;
                button.classList.remove("copied");
            }, 1500);

        })
        .catch(function() {

            const textarea = document.createElement("textarea");

            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";

            document.body.appendChild(textarea);

            textarea.select();

            try {

                document.execCommand("copy");

                button.innerText = "Copied!";
                button.classList.add("copied");

                setTimeout(function() {
                    button.innerText = "Copy Code";
                    button.classList.remove("copied");
                }, 1500);

            } catch (error) {

                button.innerText = "Copy Failed";
            }

            textarea.remove();
        });
}


// ADD COPY BUTTONS TO CODE BLOCKS
function addCopyButtons() {

    const codeBlocks = document.querySelectorAll(".code-block");

    codeBlocks.forEach(function(block) {

        if (block.querySelector(".copy-btn")) {
            return;
        }

        const button = document.createElement("button");

        button.className = "copy-btn";
        button.type = "button";
        button.innerText = "Copy Code";

        button.addEventListener("click", function() {
            copyCode(button);
        });

        block.appendChild(button);
    });
}


// SCROLL REVEAL ANIMATION
function revealCards() {

    const cards = document.querySelectorAll(".note-card");

    if (!("IntersectionObserver" in window)) {
        cards.forEach(function(card) {
            card.classList.add("visible");
        });

        return;
    }

    const observer = new IntersectionObserver(
        function(entries) {

            entries.forEach(function(entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                }
            });

        },
        {
            threshold: 0.12
        }
    );

    cards.forEach(function(card) {
        card.classList.add("reveal");
        observer.observe(card);
    });
}


// BACK TO TOP BUTTON
function createBackToTopButton() {

    const button = document.createElement("button");

    button.className = "back-to-top";
    button.type = "button";
    button.innerHTML = "&uarr;";
    button.title = "Back to Top";
    button.setAttribute("aria-label", "Back to Top");

    document.body.appendChild(button);

    window.addEventListener("scroll", function() {

        if (window.scrollY > 300) {
            button.classList.add("show");
        } else {
            button.classList.remove("show");
        }
    });

    button.addEventListener("click", function() {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


// CODE BLOCK HOVER EFFECT
function codeBlockEffect() {

    const blocks = document.querySelectorAll(".code-block");

    blocks.forEach(function(block) {

        block.addEventListener("mouseenter", function() {
            block.classList.add("code-active");
        });

        block.addEventListener("mouseleave", function() {
            block.classList.remove("code-active");
        });
    });
}


// PAGE INITIALIZATION
document.addEventListener("DOMContentLoaded", function() {

    showIntroductionMessage();

    addCopyButtons();

    revealCards();

    createBackToTopButton();

    codeBlockEffect();

    console.log("Introduction page loaded successfully!");
});