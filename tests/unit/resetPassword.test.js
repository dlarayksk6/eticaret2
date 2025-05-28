import { handleResetPassword } from '../../public/resetPasswordLogic.js';

describe('handleResetPassword', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('şifre başarı ile güncellendi mi', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => 'Şifre başarıyla güncellendi.',
        });

        const result = await handleResetPassword('test@example.com', 'yeniSifre123');

        expect(result.ok).toBe(true);
        expect(result.data.message).toBe('Şifre başarıyla güncellendi.');
    });

    test('kullanıcı bulunamazsa 404', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            text: async () => 'Bu email ile kullanıcı bulunamadı.',
        });

        const result = await handleResetPassword('notfound@example.com', 'somepass');

        expect(result.ok).toBe(false);
        expect(result.data.message).toBe('Bu email ile kullanıcı bulunamadı.');
    });

    test('eksik alanlar', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            text: async () => 'Email ve yeni şifre gerekli',
        });

        const result = await handleResetPassword('', '');

        expect(result.ok).toBe(false);
        expect(result.data.message).toBe('Email ve yeni şifre gerekli');
    });

    test('ağ hatası', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));

        const result = await handleResetPassword('user@example.com', 'pass');

        expect(result.ok).toBe(false);
        expect(result.error).toBe('Şifre sıfırlama sırasında bir hata oluştu.');
    });
});
