
export async function handleResetPassword(email, newPassword) {
    try {
        const response = await fetch('/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword }),
        });

        const text = await response.text();

        if (response.ok) {
            return { ok: true, data: { message: text } };
        } else {
            return { ok: false, data: { message: text } };
        }
    } catch (error) {
        return { ok: false, error: 'Şifre sıfırlama sırasında bir hata oluştu.' };
    }
}
