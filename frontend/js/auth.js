 const AUTH_API = "https://mini-blogging-platform-br6r.onrender.com"


// ===============================
// GET LOGGED IN USER
// ===============================

function getLoggedInUser() {
    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch (error) {
        console.error("User Data Error:", error);
        return null;
    }
}


// ===============================
// CHECK LOGIN
// ===============================

function isLoggedIn() {
    return !!localStorage.getItem("token");
}


// ===============================
// REGISTER
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const message = document.getElementById("registerMessage");

        message.textContent = "Creating account...";

        try {

            const response = await fetch(`${AUTH_API}/register`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })

            });

            const data = await response.json();

            if (!response.ok) {

                message.textContent =
                    data.message || "Registration failed.";

                return;
            }


            // Save login information
            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            message.textContent =
                "Registration successful!";


            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 800);


        } catch (error) {

            console.error("Register Error:", error);

            message.textContent =
                "Unable to connect to server.";
        }

    });

}


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("loginMessage");

        message.textContent = "Logging in...";


        try {

            const response = await fetch(`${AUTH_API}/login`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });


            const data = await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message || "Login failed.";

                return;
            }


            // Save login information
            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            message.textContent =
                "Login successful!";


            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 500);


        } catch (error) {

            console.error("Login Error:", error);

            message.textContent =
                "Unable to connect to server.";
        }

    });

}


// ===============================
// LOGOUT
// ===============================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href = "index.html";

    });

}