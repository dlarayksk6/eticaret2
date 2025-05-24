// public/login.js

import { handleLogin } from './loginLogic.js';

export function attachLoginListeners() {
    const form = document.getElementById("loginForm");
    const registerButton = document.getElementById("registerButton");
    const passwordButton = document.getElementById("passwordButton");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const result = await handleLogin(username, password);

        if (result.ok) {
            const data = result.data;
            alert("Giriş başarılı!");
            localStorage.setItem("token", data.token);
            if (data.user?.email) {
                localStorage.setItem("email", data.user.email);
            }

            const role = data.user?.role;
            if (role === "supplier") {
                window.location.href = "supplier.html";
            } else if (role === "customer") {
                window.location.href = "index.html";
            } else {
                alert("Bilinmeyen rol.");
            }
        } else {
            alert(result.data?.message || result.error || "Giriş başarısız.");
        }
    });

    registerButton.addEventListener("click", () => {
        window.location.href = "register.html";
    });

    passwordButton.addEventListener("click", () => {
        window.location.href = "forgotpassword.html";
    });
}
