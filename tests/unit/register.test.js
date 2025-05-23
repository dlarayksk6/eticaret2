/**
 * @jest-environment jsdom
 */

const { handleRegister } = require('../../public/register.js');


global.fetch = jest.fn();
global.alert = jest.fn();

describe('handleRegister', () => {
    let form, usernameInput, passwordInput, emailInput, roleInput;

    beforeEach(() => {
        document.body.innerHTML = `
            <form id="registerForm">
                <input id="username" value="testuser" />
                <input id="password" value="123456" />
                <input id="email" value="test@example.com" />
                <input id="role" value="user" />
            </form>
        `;

        form = document.getElementById("registerForm");
        usernameInput = document.getElementById("username");
        passwordInput = document.getElementById("password");
        emailInput = document.getElementById("email");
        roleInput = document.getElementById("role");

        // Reset fetch and alert mocks
        fetch.mockReset();
        alert.mockReset();
    });

    it('başarılı kayıt sonrası alert ve yönlendirme yapar', async () => {
        const mockJson = jest.fn().mockResolvedValue({ message: 'Success' });
        fetch.mockResolvedValue({ ok: true, json: mockJson });
        delete window.location;
        window.location = { href: '' };

        const e = { preventDefault: jest.fn() };
        await handleRegister(e);

        expect(fetch).toHaveBeenCalledWith("http://localhost:5000/api/auth/register", expect.any(Object));
        expect(alert).toHaveBeenCalledWith("Kayıt başarılı!");
        expect(window.location.href).toBe("login.html");
    });

    it('başarısız kayıt mesajını gösterir', async () => {
        const mockJson = jest.fn().mockResolvedValue({ message: 'Kayıt başarısız' });
        fetch.mockResolvedValue({ ok: false, json: mockJson });

        const e = { preventDefault: jest.fn() };
        await handleRegister(e);

        expect(alert).toHaveBeenCalledWith("Kayıt başarısız");
    });

    it('hata oluşursa genel hata mesajı gösterir', async () => {
        fetch.mockRejectedValue(new Error("network error"));

        const e = { preventDefault: jest.fn() };
        await handleRegister(e);

        expect(alert).toHaveBeenCalledWith("Kayıt sırasında bir hata oluştu.");
    });
});
