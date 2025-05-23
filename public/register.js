// public/register.js

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;

    try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password, email, role })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Kayıt başarılı!");
            window.location.href = "login.html";
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert("Kayıt sırasında bir hata oluştu.");
    }
}

module.exports = { handleRegister };
