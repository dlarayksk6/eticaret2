
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));


if (!token || !user) {
    window.location.href = '/login.html';
}

document.getElementById('userInfo').textContent = `${user.username}`;


function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}


async function loadStats() {
    try {
        const response = await fetch('/api/suppliers/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        document.getElementById('totalProducts').textContent = data.totalProducts;
        document.getElementById('rating').textContent = `${data.rating.toFixed(1)} ⭐`;
        document.getElementById('totalRatings').textContent = data.totalRatings;
    } catch (error) {
        console.error('İstatistik yükleme hatası:', error);
    }
}


async function loadProducts() {
    try {
        const response = await fetch(`/api/suppliers/profile/${user.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        const productList = document.getElementById('productList');
        productList.innerHTML = '';

        data.products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${product.image || 'https://via.placeholder.com/100'}" 
                         class="product-image" alt="${product.name}">
                </td>
                <td>${product.name}</td>
                <td>${product.description || '-'}</td>
                <td>${product.price.toFixed(2)} TL</td>
                <td>${product.stock}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-primary me-1" onclick="editProduct('${product._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            productList.appendChild(row);
        });
    } catch (error) {
        console.error('Ürün yükleme hatası:', error);
    }
}


async function addProduct() {
    const form = document.getElementById('addProductForm');
    const formData = new FormData(form);

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: formData.get('name'),
                description: formData.get('description'),
                price: parseFloat(formData.get('price')),
                stock: parseInt(formData.get('stock'))
            })
        });

        if (response.ok) {
            bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
            form.reset();
            loadProducts();
            loadStats();
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        console.error('Ürün ekleme hatası:', error);
        alert('Ürün eklenirken bir hata oluştu');
    }
}
async function editProduct(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const product = await response.json();

        const form = document.getElementById('editProductForm');
        form.productId.value = product._id;
        form.name.value = product.name;
        form.description.value = product.description || '';
        form.price.value = product.price;
        form.stock.value = product.stock;

        new bootstrap.Modal(document.getElementById('editProductModal')).show();
    } catch (error) {
        console.error('Ürün bilgisi getirme hatası:', error);
    }
}


async function updateProduct() {
    const form = document.getElementById('editProductForm');
    const formData = new FormData(form);
    const productId = formData.get('productId');

    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: formData.get('name'),
                description: formData.get('description'),
                price: parseFloat(formData.get('price')),
                stock: parseInt(formData.get('stock'))
            })
        });

        if (response.ok) {
            bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
            loadProducts();
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        console.error('Ürün güncelleme hatası:', error);
        alert('Ürün güncellenirken bir hata oluştu');
    }
}


async function deleteProduct(productId) {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
        return;
    }

    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            loadProducts();
            loadStats();
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        console.error('Ürün silme hatası:', error);
        alert('Ürün silinirken bir hata oluştu');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadProducts();
}); 