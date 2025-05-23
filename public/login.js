
const { handleLogin } = require('../../public/loginLogic');

export function attachLoginListeners() {
    document.getElementById("loginForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const result = await handleLogin(username, password);

        if (result.ok) {
            alert("Giriş başarılı!");
            localStorage.setItem("token", result.data.token);
            if (result.data.user?.email) {
                localStorage.setItem("email", result.data.user.email);
            }

            if (result.data.user?.role === "supplier") {
                window.location.href = "supplier.html";
            } else {
                window.location.href = "index.html";
            }
        } else {
            alert(result.data?.message || result.error);
        }
    });

    document.getElementById("registerButton").addEventListener("click", () => {
        window.location.href = "register.html";
    });

    document.getElementById("passwordButton").addEventListener("click", () => {
        window.location.href = "forgotpassword.html";
    });
}
