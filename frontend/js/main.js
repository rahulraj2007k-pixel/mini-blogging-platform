// ==========================================
// MAIN JAVASCRIPT
// ==========================================


// ==========================================
// SEARCH
// ==========================================

const searchBtn = document.getElementById("searchBtn");

const searchInput = document.getElementById("searchInput");


if (searchBtn && searchInput) {

    searchBtn.addEventListener("click", () => {

        const keyword =
            searchInput.value.trim();

        searchPosts(keyword);

    });


    // Search when pressing Enter
    searchInput.addEventListener("keypress", (event) => {

        if (event.key === "Enter") {

            const keyword =
                searchInput.value.trim();

            searchPosts(keyword);

        }

    });

}


// ==========================================
// CATEGORY FILTER
// ==========================================

const categorySelect =
    document.getElementById("categorySelect");


if (categorySelect) {

    categorySelect.addEventListener("change", () => {

        const category =
            categorySelect.value;

        filterByCategory(category);

    });

}


// ==========================================
// NAVBAR AUTH STATE
// ==========================================

function updateNavbar() {

    const token =
        localStorage.getItem("token");

    const loginLink =
        document.getElementById("loginLink");

    const registerLink =
        document.getElementById("registerLink");

    const dashboardLink =
        document.getElementById("dashboardLink");

    const createPostLink =
        document.getElementById("createPostLink");

    const logoutBtn =
        document.getElementById("logoutBtn");


    if (token) {

        // User logged in

        if (loginLink) {
            loginLink.style.display = "none";
        }

        if (registerLink) {
            registerLink.style.display = "none";
        }

        if (dashboardLink) {
            dashboardLink.style.display = "inline-block";
        }

        if (createPostLink) {
            createPostLink.style.display = "inline-block";
        }

        if (logoutBtn) {
            logoutBtn.style.display = "inline-block";
        }

    } else {

        // User not logged in

        if (loginLink) {
            loginLink.style.display = "inline-block";
        }

        if (registerLink) {
            registerLink.style.display = "inline-block";
        }

        if (dashboardLink) {
            dashboardLink.style.display = "none";
        }

        if (createPostLink) {
            createPostLink.style.display = "none";
        }

        if (logoutBtn) {
            logoutBtn.style.display = "none";
        }

    }

}


// ==========================================
// DASHBOARD USER INFORMATION
// ==========================================

function showUserInformation() {

    const user =
        getLoggedInUser();


    if (!user) {
        return;
    }


    const userName =
        document.getElementById("userName");

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");


    if (userName) {

        userName.textContent =
            user.name || "User";

    }


    if (profileName) {

        profileName.textContent =
            user.name || "";

    }


    if (profileEmail) {

        profileEmail.textContent =
            user.email || "";

    }

}


// ==========================================
// PROTECT PRIVATE PAGES
// ==========================================

function protectPrivatePage() {

    const privatePages = [
        "dashboard.html",
        "create-post.html",
        "edit-post.html"
    ];


    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    if (
        privatePages.includes(currentPage) &&
        !isLoggedIn()
    ) {

        window.location.href =
            "login.html";

    }

}


// ==========================================
// INITIALIZE
// ==========================================

updateNavbar();

showUserInformation();

protectPrivatePage();