/**
 * @jest-environment jsdom
 */

// Mock'ları önce tanımlayalım
const mockConsoleError = jest.fn();
const mockAlert = jest.fn();
const mockConfirm = jest.fn();
const mockLoadProducts = jest.fn();
const mockLoadStats = jest.fn();

// Global mock'ları ayarlayalım
beforeAll(() => {
    // Fetch mock
    global.fetch = jest.fn();

    // Console mock
    global.console = {
        ...console,
        error: mockConsoleError
    };

    // Window functions
    global.alert = mockAlert;
    global.confirm = mockConfirm;

    // localStorage mock
    const localStorageMock = {
        getItem: jest.fn(() => 'test-token'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
    };
    global.localStorage = localStorageMock;

    // Bootstrap modal mock
    global.bootstrap = {
        Modal: {
            getInstance: jest.fn(() => ({
                hide: jest.fn()
            }))
        }
    };

    // Global fonksiyonlar
    global.loadProducts = mockLoadProducts;
    global.loadStats = mockLoadStats;
    global.token = 'test-token';

    // Document mock
    global.document = {
        getElementById: jest.fn(),
        addEventListener: jest.fn()
    };
});

// Login fonksiyonu
async function handleLogin(username, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            return { ok: true, data };
        } else {
            return { ok: false, data };
        }
    } catch (error) {
        return { ok: false, error: 'Giriş sırasında bir hata oluştu.' };
    }
}

// Silme fonksiyonu
async function deleteProduct(productId) {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
        return;
    }

    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${global.token || localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            if (global.loadProducts) global.loadProducts();
            if (global.loadStats) global.loadStats();
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        console.error('Ürün silme hatası:', error);
        alert('Ürün silinirken bir hata oluştu');
    }
}

describe('Login Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('başarılı giriş durumunda doğru veri döndürülmeli', async () => {
        const mockResponse = { user: { id: 1, username: 'testuser' }, token: 'abc123' };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse
        });

        const result = await handleLogin('testuser', 'password123');

        expect(fetch).toHaveBeenCalledWith('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: 'testuser', password: 'password123' })
        });

        expect(result).toEqual({ ok: true, data: mockResponse });
    });

    test('başarısız giriş durumunda hata döndürülmeli', async () => {
        const mockError = { message: 'Kullanıcı adı veya şifre hatalı' };

        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => mockError
        });

        const result = await handleLogin('wronguser', 'wrongpass');

        expect(result).toEqual({ ok: false, data: mockError });
    });

    test('network hatası durumunda hata mesajı döndürülmeli', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));

        const result = await handleLogin('testuser', 'password123');

        expect(result).toEqual({
            ok: false,
            error: 'Giriş sırasında bir hata oluştu.'
        });
    });
});

describe('Product Deletion Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('ürün başarılı bir şekilde silindiğinde listeler güncellenmeli', async () => {
        // Kullanıcı onayını mock'la
        mockConfirm.mockReturnValue(true);

        // Başarılı API yanıtını mock'la
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Ürün başarıyla silindi' })
        });

        await deleteProduct('123');

        // API çağrısını kontrol et
        expect(fetch).toHaveBeenCalledWith('/api/products/123', {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer test-token'
            }
        });

        // Listelerin güncellendiğini kontrol et
        expect(mockLoadProducts).toHaveBeenCalled();
        expect(mockLoadStats).toHaveBeenCalled();
    });

    test('kullanıcı iptal ettiğinde silme işlemi yapılmamalı', async () => {
        // Kullanıcı iptalini mock'la
        mockConfirm.mockReturnValue(false);

        await deleteProduct('123');

        // API çağrısı yapılmadığını kontrol et
        expect(fetch).not.toHaveBeenCalled();
        expect(mockLoadProducts).not.toHaveBeenCalled();
        expect(mockLoadStats).not.toHaveBeenCalled();
    });

    test('API hatası durumunda hata mesajı gösterilmeli', async () => {
        // Kullanıcı onayını mock'la
        mockConfirm.mockReturnValue(true);

        // API hata yanıtını mock'la
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Ürün silinemedi' })
        });

        await deleteProduct('123');

        // Hata mesajının gösterildiğini kontrol et
        expect(mockAlert).toHaveBeenCalledWith('Ürün silinemedi');
        expect(mockLoadProducts).not.toHaveBeenCalled();
        expect(mockLoadStats).not.toHaveBeenCalled();
    });

    test('network hatası durumunda genel hata mesajı gösterilmeli', async () => {
        // Kullanıcı onayını mock'la
        mockConfirm.mockReturnValue(true);

        // Network hatasını mock'la
        fetch.mockRejectedValueOnce(new Error('Network error'));

        await deleteProduct('123');

        // Hata mesajlarının gösterildiğini kontrol et
        expect(mockConsoleError).toHaveBeenCalledWith('Ürün silme hatası:', expect.any(Error));
        expect(mockAlert).toHaveBeenCalledWith('Ürün silinirken bir hata oluştu');
        expect(mockLoadProducts).not.toHaveBeenCalled();
        expect(mockLoadStats).not.toHaveBeenCalled();
    });
});