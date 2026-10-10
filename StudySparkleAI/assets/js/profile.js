
document.addEventListener("DOMContentLoaded", function () {
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const profileAvatar = document.getElementById("profileAvatar");

    const editButton = document.getElementById("editProfileButton");
    const editDialog = document.getElementById("editProfileDialog");
    const editForm = document.getElementById("editProfileForm");
    const editNameInput = document.getElementById("editProfileName");
    const editMessage = document.getElementById("editProfileMessage");

    const closeEditButton = document.getElementById("closeEditDialog");
    const cancelEditButton = document.getElementById("cancelEditDialog");

    const logoutButton = document.getElementById("logoutButton");
    const logoutDialog = document.getElementById("logoutDialog");
    const closeLogoutButton = document.getElementById("closeLogoutDialog");
    const cancelLogoutButton = document.getElementById("cancelLogout");
    const confirmLogoutButton = document.getElementById("confirmLogout");

    const currentYear = document.getElementById("currentYear");

    const PROFILE_NAME_KEY = "studysparkaiProfileName";

    function getSavedName() {
        try {
            return localStorage.getItem(PROFILE_NAME_KEY) || "";
        } catch (error) {
            return "";
        }
    }

    function saveName(name) {
        try {
            localStorage.setItem(PROFILE_NAME_KEY, name);
            return true;
        } catch (error) {
            return false;
        }
    }

    function updateProfileDisplay(name) {
        if (profileName) {
            profileName.textContent = name;
        }

        if (profileAvatar) {
            const avatarUrl = new URL(
                "https://ui-avatars.com/api/"
            );

            avatarUrl.searchParams.set("name", name);
            avatarUrl.searchParams.set("background", "7657f6");
            avatarUrl.searchParams.set("color", "ffffff");
            avatarUrl.searchParams.set("size", "256");
            avatarUrl.searchParams.set("bold", "true");

            profileAvatar.src = avatarUrl.toString();
            profileAvatar.alt = name + " profile avatar";
        }
    }

    // Load the saved display name, if one exists.
    const savedName = getSavedName();

    if (savedName) {
        updateProfileDisplay(savedName);
    }

    // Keep the email placeholder meaningful when no email is supplied.
    if (profileEmail && !profileEmail.textContent.trim()) {
        profileEmail.textContent = "Not provided";
    }

    if (profileAvatar) {
        profileAvatar.addEventListener("error", function () {
            profileAvatar.removeAttribute("src");
            profileAvatar.alt = "Profile avatar unavailable";
        }, { once: true });
    }

    // Open the edit dialog.
    function editProfile() {
        if (!editDialog || !editNameInput) {
            return;
        }

        editNameInput.value = profileName
            ? profileName.textContent.trim()
            : "Student";

        if (editMessage) {
            editMessage.textContent = "";
        }

        if (typeof editDialog.showModal === "function") {
            editDialog.showModal();
            editNameInput.focus();
            editNameInput.select();
        } else {
            const newName = window.prompt(
                "Enter your display name:",
                editNameInput.value
            );

            if (newName !== null) {
                updateName(newName);
            }
        }
    }

    function closeEditDialog() {
        if (editDialog && editDialog.open) {
            editDialog.close();
        }
    }

    function updateName(value) {
        const newName = value.trim();

        if (newName.length < 2 || newName.length > 60) {
            if (editMessage) {
                editMessage.textContent =
                    "Please enter a name between 2 and 60 characters.";
            }

            return false;
        }

        if (!saveName(newName)) {
            if (editMessage) {
                editMessage.textContent =
                    "The name could not be saved in this browser.";
            }

            return false;
        }

        updateProfileDisplay(newName);
        closeEditDialog();

        return true;
    }

    if (editButton) {
        editButton.addEventListener("click", editProfile);
    }

    if (editForm) {
        editForm.addEventListener("submit", function (event) {
            event.preventDefault();
            updateName(editNameInput.value);
        });
    }

    if (closeEditButton) {
        closeEditButton.addEventListener("click", closeEditDialog);
    }

    if (cancelEditButton) {
        cancelEditButton.addEventListener("click", closeEditDialog);
    }

    // Close the edit dialog when clicking outside its content.
    if (editDialog) {
        editDialog.addEventListener("click", function (event) {
            if (event.target === editDialog) {
                closeEditDialog();
            }
        });
    }

    // Logout confirmation.
    function openLogoutDialog() {
        if (logoutDialog && typeof logoutDialog.showModal === "function") {
            logoutDialog.showModal();
        } else {
            const shouldLogout = window.confirm(
                "Are you sure you want to log out?"
            );

            if (shouldLogout) {
                logout();
            }
        }
    }

    function closeLogoutDialog() {
        if (logoutDialog && logoutDialog.open) {
            logoutDialog.close();
        }
    }

    function logout() {
        // This page is assumed to be pages/dashboard/profile.html.
        window.location.href = "../auth/login.html";
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", openLogoutDialog);
    }

    if (closeLogoutButton) {
        closeLogoutButton.addEventListener("click", closeLogoutDialog);
    }

    if (cancelLogoutButton) {
        cancelLogoutButton.addEventListener("click", closeLogoutDialog);
    }

    if (confirmLogoutButton) {
        confirmLogoutButton.addEventListener("click", logout);
    }

    if (logoutDialog) {
        logoutDialog.addEventListener("click", function (event) {
            if (event.target === logoutDialog) {
                closeLogoutDialog();
            }
        });
    }

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
});