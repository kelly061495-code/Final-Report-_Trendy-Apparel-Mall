import { Storage, products as inventory } from './data.js';
import { Auth } from './auth.js';
import { showToast, navigate, updateCartBadge } from './utils.js';

let cart = Storage.get('cart') || [];

export function addToCart(product, quantity) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        if (existing.quantity + quantity > product.stock) {
            return showToast(`庫存不足，購物車內已有 ${existing.quantity} 件`, 'error');
        }
        existing.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }
    
    Storage.set('cart', cart);
    updateCartBadge(cart.reduce((sum, item) => sum + item.quantity, 0));
    showToast(`已將 ${quantity} 件 ${product.name} 加入購物車`);
}

export function getCartItemCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function renderCart(container) {
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="card" style="text-align:center; padding: 4rem;">
                <i class="fa-solid fa-cart-shopping" style="font-size: 4rem; color: var(--border-color); margin-bottom: 1rem;"></i>
                <h2>購物車是空的</h2>
                <button class="btn" style="margin-top: 2rem;" id="btn-goshop">去逛逛</button>
            </div>
        `;
        document.getElementById('btn-goshop').addEventListener('click', () => navigate('home'));
        return;
    }

    let total = 0;
    let html = `<h2>購物車清單</h2><div style="margin-top:2rem;">`;
    
    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <img src="${item.image}" class="cart-item-img">
                    <div>
                        <div style="font-weight: 600; font-size: 1.2rem;">${item.name}</div>
                        <div style="color: #cbd5e1;">NT$ ${item.price} x ${item.quantity} 件</div>
                    </div>
                </div>
                <div>
                    <div style="font-weight: 800; font-size: 1.2rem;">NT$ ${subtotal}</div>
                    <button class="btn btn-danger btn-remove" data-index="${index}" style="padding: 0.5rem; margin-top: 0.5rem; font-size: 0.8rem;">移除</button>
                </div>
            </div>
        `;
    });

    html += `
        <div class="cart-summary">
            <div style="color: #cbd5e1;">總計金額</div>
            <div class="total-price">NT$ ${total}</div>
            <button class="btn" id="btn-checkout" style="font-size: 1.2rem; padding: 1rem 3rem;">前往結帳</button>
        </div>
    </div>`;

    container.innerHTML = html;

    container.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.dataset.index;
            cart.splice(idx, 1);
            Storage.set('cart', cart);
            updateCartBadge(getCartItemCount());
            renderCart(container);
        });
    });

    document.getElementById('btn-checkout').addEventListener('click', () => {
        const user = Auth.getUser();
        if (!user) {
            showToast('請先登入會員才能結帳', 'error');
            navigate('auth');
            return;
        }

        // Generate Order
        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random()*1000)}`;
        const orders = Storage.get('orders') || [];
        
        const newOrder = {
            orderId,
            userId: user.id,
            date: new Date().toLocaleString(),
            items: [...cart],
            total
        };
        
        orders.push(newOrder);
        Storage.set('orders', orders);

        // Deduct mock stock
        // In a real app this would call an API
        
        // Clear cart
        cart = [];
        Storage.set('cart', cart);
        updateCartBadge(0);
        
        showToast('結帳成功！訂單已成立');
        navigate('orders');
    });
}

export function renderOrders(container) {
    const user = Auth.getUser();
    if (!user) {
        navigate('auth');
        return;
    }

    const allOrders = Storage.get('orders') || [];
    const myOrders = allOrders.filter(o => o.userId === user.id).reverse();

    if (myOrders.length === 0) {
        container.innerHTML = `
            <div class="card" style="text-align:center; padding: 4rem;">
                <i class="fa-solid fa-box-open" style="font-size: 4rem; color: var(--border-color); margin-bottom: 1rem;"></i>
                <h2>尚無歷史訂單紀錄</h2>
            </div>
        `;
        return;
    }

    let html = `<h2>歷史訂單查詢</h2><div style="margin-top:2rem;">`;
    myOrders.forEach(o => {
        html += `
            <div class="card" style="margin-bottom: 1.5rem;">
                <div style="display:flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem;">
                    <div>
                        <div style="color:#cbd5e1; font-size:0.9rem;">訂單編號</div>
                        <div style="font-weight:800;">${o.orderId}</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="color:#cbd5e1; font-size:0.9rem;">訂購日期</div>
                        <div>${o.date}</div>
                    </div>
                </div>
                <div>
        `;
        o.items.forEach(item => {
            html += `
                <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>NT$ ${item.price * item.quantity}</span>
                </div>
            `;
        });
        html += `
                </div>
                <div style="text-align:right; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                    <span style="color:#cbd5e1; margin-right: 1rem;">總計</span>
                    <span style="font-size: 1.5rem; font-weight:800; color:var(--primary-color);">NT$ ${o.total}</span>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    container.innerHTML = html;
}
