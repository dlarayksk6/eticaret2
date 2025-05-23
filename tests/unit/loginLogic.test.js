const { handleLogin } = require('../../public/loginLogic');

global.fetch = jest.fn();

describe('handleLogin', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('giriş başarılı olduğunda token dönmeli', async () => {
        const mockResponse = {
            token: 'fake-token',
            user: { role: 'customer', email: 'test@example.com' }
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse
        });

        const result = await handleLogin('testuser', 'testpass');

        expect(result.ok).toBe(true);
        expect(result.data.token).toBe('fake-token');
        expect(result.data.user.email).toBe('test@example.com');
    });

    test('giriş başarısız olduğunda mesaj dönmeli', async () => {
        const mockResponse = {
            message: 'Geçersiz bilgiler'
        };

        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => mockResponse
        });

        const result = await handleLogin('wronguser', 'wrongpass');

        expect(result.ok).toBe(false);
        expect(result.data.message).toBe('Geçersiz bilgiler');
    });

    test('hata oluştuğunda genel hata mesajı dönmeli', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));

        const result = await handleLogin('any', 'any');

        expect(result.ok).toBe(false);
        expect(result.error).toBe('Giriş sırasında bir hata oluştu.');
    });
});
