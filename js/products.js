import { products, Validators } from './data.js';
import { addToCart } from './cart.js';
import { showToast, navigate } from './utils.js';

export function renderProducts(container) {
    let html = '<div class="product-grid">';
    products.forEach(p => {
        html += `
            <div class="product-card" data-id="${p.id}">
                <div class="product-image-container">
                    <img src="${p.image}" class="product-image" alt="${p.name}">
                </div>
                <div class="product-info">
                    <div class="product-category">${p.category}</div>
                    <div class="product-title">${p.name}</div>
                    <div class="product-price">NT$ ${p.price}</div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;

    // Attach click events
    container.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            renderProductDetail(container, card.dataset.id);
        });
    });
}

function renderProductDetail(container, id) {
    const p = products.find(x => x.id === id);
    if (!p) return;

    container.innerHTML = `
        <button class="btn btn-outline" id="btn-back" style="margin-bottom: 2rem;">
            <i class="fa-solid fa-arrow-left"></i> 返回列表
        </button>
        <div class="product-detail-view">
            <div>
                <img src="${p.image}" class="detail-image" alt="${p.name}">
            </div>
            <div>
                <div class="product-category">${p.category}</div>
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">${p.name}</h1>
                <p style="font-size: 1.1rem; color: #cbd5e1; margin-bottom: 2rem;">${p.desc}</p>
                <div class="product-price" style="font-size: 2.5rem; margin-bottom: 1rem;">NT$ ${p.price}</div>
                <p>庫存狀態：剩餘 ${p.stock} 件</p>
                
                <div class="quantity-control">
                    <label>購買數量：</label>
                    <input type="text" id="qty-${p.id}" class="form-control quantity-input" value="1">
                </div>
                
                <button class="btn" id="btn-add-cart" style="width: 100%; font-size: 1.2rem; padding: 1rem;">
                    <i class="fa-solid fa-cart-plus"></i> 加入購物車
                </button>
            </div>
        </div>
    `;

    document.getElementById('btn-back').addEventListener('click', () => {
        renderProducts(container);
    });

    document.getElementById('btn-add-cart').addEventListener('click', () => {
        const qtyInput = document.getElementById(`qty-${p.id}`).value;
        const validation = Validators.isValidQuantity(qtyInput, p.stock);
        
        if (!validation.valid) {
            showToast(validation.msg, 'error');
            return;
        }

        addToCart(p, Number(qtyInput));
    });
}
