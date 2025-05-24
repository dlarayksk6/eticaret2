// public/loginLogic.js

export async function handleLogin(username, password) {
    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        return { ok: response.ok, data };
    } catch (error) {
        return { ok: false, error: "Giriş sırasında bir hata oluştu." };
    }
}
