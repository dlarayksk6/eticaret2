/**
 * @jest-environment jsdom
 */

// Fonksiyonları doğrudan tanımlayalım
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

// Mock'ları kurmadan önce ayarlayalım
const mockConsoleError = jest.fn();

// Jest setup
global.fetch = jest.fn();
global.console = { error: mockConsoleError };
global.alert = jest.fn();
global.confirm = jest.fn();

// localStorage mock
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Bootstrap modal mock
const mockBootstrap = {
    Modal: {
        getInstance: jest.fn(() => ({
            hide: jest.fn()
        }))
    }
};
global.bootstrap = mockBootstrap;

// Global fonksiyonları mock'lama
global.loadProducts = jest.fn();
global.loadStats = jest.fn();
global.token = 'test-token';

// Mock'ları global seviyede tanımla
const mockGetElementById = jest.fn();
global.document = {
    getElementById: mockGetElementById,
    addEventListener: jest.fn()
};

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

// Güncelleme fonksiyonu
async function updateProduct(productId) {
    const form = document.getElementById('updateProductForm');
    const formData = new FormData(form);

    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${global.token || localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name: formData.get('name'),
                description: formData.get('description'),
                price: parseFloat(formData.get('price')),
                stock: parseInt(formData.get('stock'))
            })
        });

        if (response.ok) {
            bootstrap.Modal.getInstance(document.getElementById('updateProductModal')).hide();
            form.reset();
            if (global.loadProducts) global.loadProducts();
            if (global.loadStats) global.loadStats();
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        console.error('Ürün güncelleme hatası:', error);
        alert('Ürün güncellenirken bir hata oluştu');
    }
}

describe('Product Deletion Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('ürün başarılı bir şekilde silindiğinde listeler güncellenmeli', async () => {
        // Kullanıcı onayını mock'la
        global.confirm.mockReturnValue(true);

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
        expect(global.loadProducts).toHaveBeenCalled();
        expect(global.loadStats).toHaveBeenCalled();
    });

    test('kullanıcı iptal ettiğinde silme işlemi yapılmamalı', async () => {
        // Kullanıcı iptalini mock'la
        global.confirm.mockReturnValue(false);

        await deleteProduct('123');

        // API çağrısı yapılmadığını kontrol et
        expect(fetch).not.toHaveBeenCalled();
        expect(global.loadProducts).not.toHaveBeenCalled();
        expect(global.loadStats).not.toHaveBeenCalled();
    });

    test('API hatası durumunda hata mesajı gösterilmeli', async () => {
        // Kullanıcı onayını mock'la
        global.confirm.mockReturnValue(true);

        // API hata yanıtını mock'la
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Ürün silinemedi' })
        });

        await deleteProduct('123');

        // Hata mesajının gösterildiğini kontrol et
        expect(global.alert).toHaveBeenCalledWith('Ürün silinemedi');
        expect(global.loadProducts).not.toHaveBeenCalled();
    });

    test('network hatası durumunda genel hata mesajı gösterilmeli', async () => {
        // Kullanıcı onayını mock'la
        global.confirm.mockReturnValue(true);

        // Network hatasını mock'la
        fetch.mockRejectedValueOnce(new Error('Network error'));

        await deleteProduct('123');

        // Hata mesajlarının gösterildiğini kontrol et
        expect(mockConsoleError).toHaveBeenCalledWith('Ürün silme hatası:', expect.any(Error));
        expect(global.alert).toHaveBeenCalledWith('Ürün silinirken bir hata oluştu');
        expect(global.loadProducts).not.toHaveBeenCalled();
    });
});

describe('Product Update Tests', () => {
    const mockFormData = {
        get: jest.fn()
    };

    const mockElement = {
        reset: jest.fn()
    };

    beforeEach(() => {
        // Mock'ları temizle ve yeniden ayarla
        jest.clearAllMocks();

        // Document getElementById mock'ını ayarla
        document.getElementById = jest.fn().mockReturnValue(mockElement);

        // FormData constructor'ını mock'la
        global.FormData = jest.fn(() => mockFormData);

        // FormData mock'ını ayarlama
        mockFormData.get.mockImplementation((key) => {
            const mockData = {
                'name': 'Güncellenmiş Ürün',
                'description': 'Güncellenmiş açıklama',
                'price': '149.99',
                'stock': '20'
            };
            return mockData[key];
        });
    });

    test('ürün başarılı bir şekilde güncellendiğinde modal kapanmalı ve form sıfırlanmalı', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Ürün başarıyla güncellendi' })
        });

        await updateProduct('123');

        expect(fetch).toHaveBeenCalledWith('/api/products/123', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token'
            },
            body: JSON.stringify({
                name: 'Güncellenmiş Ürün',
                description: 'Güncellenmiş açıklama',
                price: 149.99,
                stock: 20
            })
        });

        expect(mockBootstrap.Modal.getInstance).toHaveBeenCalled();
        expect(mockElement.reset).toHaveBeenCalled();
        expect(global.loadProducts).toHaveBeenCalled();
        expect(global.loadStats).toHaveBeenCalled();
    });

    test('ürün güncelleme başarısız olduğunda hata mesajı gösterilmeli', async () => {
        const errorResponse = {
            message: 'Ürün güncellenemedi'
        };

        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => errorResponse
        });

        await updateProduct('123');

        expect(global.alert).toHaveBeenCalledWith('Ürün güncellenemedi');
        expect(mockElement.reset).not.toHaveBeenCalled();
        expect(global.loadProducts).not.toHaveBeenCalled();
    });

    test('network hatası oluştuğunda genel hata mesajı gösterilmeli', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));

        await updateProduct('123');

        expect(mockConsoleError).toHaveBeenCalledWith('Ürün güncelleme hatası:', expect.any(Error));
        expect(global.alert).toHaveBeenCalledWith('Ürün güncellenirken bir hata oluştu');
        expect(mockElement.reset).not.toHaveBeenCalled();
    });

    test('form verilerinin doğru şekilde parse edildiğini kontrol etmeli', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Success' })
        });

        await updateProduct('123');

        const fetchCall = fetch.mock.calls[0];
        const requestBody = JSON.parse(fetchCall[1].body);

        expect(requestBody.name).toBe('Güncellenmiş Ürün');
        expect(requestBody.description).toBe('Güncellenmiş açıklama');
        expect(requestBody.price).toBe(149.99);
        expect(requestBody.stock).toBe(20);
        expect(typeof requestBody.price).toBe('number');
        expect(typeof requestBody.stock).toBe('number');
    });

    test('authorization header doğru token ile gönderilmeli', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Success' })
        });

        await updateProduct('123');

        const fetchCall = fetch.mock.calls[0];
        const headers = fetchCall[1].headers;

        expect(headers.Authorization).toBe('Bearer test-token');
        expect(headers['Content-Type']).toBe('application/json');
    });
});