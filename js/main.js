/* ============================================================
   Trendy Apparel Mall — main.js (all-in-one, no ES modules)
   ============================================================ */

// ─── 1. DATA ──────────────────────────────────────────────────────────────────
const products = [
    { id: 'P001', name: '經典重磅素色短T',    category: '上衣', price: 590,  stock: 100, desc: '高磅數棉質，透氣舒適，百搭基本款。',            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80' },
    { id: 'P002', name: '復古水洗直筒牛仔褲', category: '褲裝', price: 1280, stock: 50,  desc: '獨特水洗工藝，修身直筒剪裁。',                  image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80' },
    { id: 'P003', name: '街頭風寬版連帽外套', category: '外套', price: 1580, stock: 30,  desc: '防風防潑水材質，街頭穿搭必備。',                  image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80' },
    { id: 'P004', name: '簡約工裝短褲',       category: '褲裝', price: 890,  stock: 80,  desc: '多口袋設計，實用且具立體感。',                    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80' },
    { id: 'P005', name: '日系落肩長袖襯衫',   category: '上衣', price: 980,  stock: 60,  desc: '輕薄透氣，寬鬆落肩版型，展現慵懶風格。',          image: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&w=800&q=80' },
    { id: 'P006', name: '羊毛混紡針織毛衣',   category: '上衣', price: 1450, stock: 40,  desc: '保暖親膚，適合秋冬內搭或單穿。',                  image: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=800&q=80' }
];

// ─── 2. STORAGE ───────────────────────────────────────────────────────────────
const Storage = {
    get:    (key)        => JSON.parse(localStorage.getItem(key) || 'null'),
    set:    (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    remove: (key)        => localStorage.removeItem(key)
};

// ─── 3. VALIDATORS ────────────────────────────────────────────────────────────
const Validators = {
    isNumber:        (val)       => !isNaN(val) && Number.isInteger(Number(val)),
    isValidQuantity: (qty, stock) => {
        if (!Validators.isNumber(qty)) return { valid: false, msg: '數量必須為純數字' };
        qty = Number(qty);
        if (qty < 1)     return { valid: false, msg: '數量必須大於 0' };
        if (qty > stock) return { valid: false, msg: `數量不得超過庫存 (${stock})` };
        return { valid: true };
    },
    isValidPhone:    (phone) => /^09\d{8}$/.test(phone),
    isValidPassword: (pwd)   => pwd.length >= 6,
    isValidUsername: (user)  => user.length >= 4
};

// ─── 4. UI UTILITIES ─────────────────────────────────────────────────────────
const appContainer = document.getElementById('app-container');
const toastEl      = document.getElementById('toast');
const cartBadge    = document.getElementById('cart-count');
const navLinks     = document.querySelectorAll('.nav-links a');

function showToast(message, type = 'success') {
    toastEl.textContent = message;
    toastEl.className   = `toast show${type === 'error' ? ' error' : ''}`;
    setTimeout(() => toastEl.classList.remove('show'), 3000);
}

function updateCartBadge(count) {
    cartBadge.textContent    = count;
    cartBadge.style.display  = count > 0 ? 'block' : 'none';
}

// ─── 5. AUTH ─────────────────────────────────────────────────────────────────
let currentUser = Storage.get('currentUser');

const Auth = {
    getUser: () => currentUser,

    login: (username, password) => {
        const users = Storage.get('users') || [];
        const user  = users.find(u => u.username === username && u.password === password);
        if (user) {
            currentUser = user;
            Storage.set('currentUser', user);
            showToast('登入成功');
            navigate('home');
            return true;
        }
        showToast('帳號或密碼錯誤', 'error');
        return false;
    },

    register: (username, password, phone) => {
        if (!Validators.isValidUsername(username)) return showToast('帳號必須至少 4 個字元', 'error');
        if (!Validators.isValidPassword(password)) return showToast('密碼必須至少 6 個字元', 'error');
        if (!Validators.isValidPhone(phone))       return showToast('請輸入有效手機號碼 (09開頭10碼)', 'error');
        const users = Storage.get('users') || [];
        if (users.find(u => u.username === username)) return showToast('帳號已存在', 'error');
        const newUser = { username, password, phone, id: 'U' + Date.now() };
        users.push(newUser);
        Storage.set('users', users);
        currentUser = newUser;
        Storage.set('currentUser', newUser);
        showToast('註冊成功，已為您自動登入');
        navigate('home');
    },

    logout: () => {
        currentUser = null;
        Storage.remove('currentUser');
        showToast('已登出');
        navigate('home');
    },

    updateProfile: (phone, newPassword) => {
        if (!currentUser) return;
        if (!Validators.isValidPhone(phone))                           return showToast('手機格式錯誤', 'error');
        if (newPassword && !Validators.isValidPassword(newPassword))   return showToast('密碼格式錯誤', 'error');
        const users   = Storage.get('users') || [];
        const userIdx = users.findIndex(u => u.id === currentUser.id);
        if (userIdx !== -1) {
            users[userIdx].phone = phone;
            if (newPassword) users[userIdx].password = newPassword;
            currentUser = users[userIdx];
            Storage.set('users', users);
            Storage.set('currentUser', currentUser);
            showToast('個人資料更新成功');
        }
    }
};

// ─── 6. CART ─────────────────────────────────────────────────────────────────
let cart = Storage.get('cart') || [];

function getCartItemCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function addToCart(product, quantity) {
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
    updateCartBadge(getCartItemCount());
    showToast(`已將 ${quantity} 件「${product.name}」加入購物車`);
}

// ─── 7. VIEWS ─────────────────────────────────────────────────────────────────

/* --- 7-a. Products --- */
function renderProducts(container) {
    // Hero Banner
    let html = `
    <section class="hero">
        <div class="hero-content">
            <p class="hero-sub">NEW COLLECTION 2025</p>
            <h1 class="hero-title">潮流由你<br>定義未來</h1>
            <p class="hero-desc">精選街頭時尚單品，展現你的獨特風格</p>
            <button class="btn btn-hero" id="btn-hero-shop">
                <i class="fa-solid fa-bag-shopping"></i> 立即選購
            </button>
        </div>
        <div class="hero-badge-wrap">
            <div class="hero-badge">NEW IN</div>
        </div>
    </section>

    <section class="section-header">
        <h2 class="section-title">精選商品</h2>
        <p class="section-sub">點擊商品查看詳情並加入購物車</p>
    </section>

    <div class="product-grid">`;

    products.forEach(p => {
        html += `
        <div class="product-card" data-id="${p.id}">
            <div class="product-image-container">
                <img src="${p.image}" class="product-image" alt="${p.name}" loading="lazy">
                <div class="product-overlay">
                    <span><i class="fa-solid fa-eye"></i> 查看詳情</span>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${p.category}</div>
                <div class="product-title">${p.name}</div>
                <div class="product-footer">
                    <div class="product-price">NT$ ${p.price.toLocaleString()}</div>
                    <div class="product-stock ${p.stock <= 10 ? 'low-stock' : ''}">
                        ${p.stock <= 10 ? '⚠ 剩 ' + p.stock + ' 件' : '庫存充足'}
                    </div>
                </div>
            </div>
        </div>`;
    });

    html += `</div>`;
    container.innerHTML = html;

    document.getElementById('btn-hero-shop').addEventListener('click', () => {
        document.querySelector('.product-grid').scrollIntoView({ behavior: 'smooth' });
    });

    container.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => renderProductDetail(container, card.dataset.id));
    });
}

function renderProductDetail(container, id) {
    const p = products.find(x => x.id === id);
    if (!p) return;

    container.innerHTML = `
    <button class="btn btn-outline" id="btn-back" style="margin-bottom:2rem;">
        <i class="fa-solid fa-arrow-left"></i> 返回列表
    </button>
    <div class="product-detail-view">
        <div class="detail-img-wrap">
            <img src="${p.image}" class="detail-image" alt="${p.name}">
        </div>
        <div class="detail-info">
            <div class="product-category">${p.category}</div>
            <h1 class="detail-title">${p.name}</h1>
            <p class="detail-desc">${p.desc}</p>
            <div class="detail-price">NT$ ${p.price.toLocaleString()}</div>
            <p class="detail-stock">
                <i class="fa-solid fa-warehouse"></i>
                庫存狀態：剩餘 <strong>${p.stock}</strong> 件
            </p>
            <div class="quantity-control">
                <label>購買數量：</label>
                <button class="qty-btn" id="qty-minus">−</button>
                <input type="text" id="qty-${p.id}" class="form-control quantity-input" value="1">
                <button class="qty-btn" id="qty-plus">+</button>
            </div>
            <button class="btn btn-add-cart" id="btn-add-cart">
                <i class="fa-solid fa-cart-plus"></i> 加入購物車
            </button>
        </div>
    </div>`;

    const qtyInput = document.getElementById(`qty-${p.id}`);
    document.getElementById('qty-minus').addEventListener('click', () => {
        const v = parseInt(qtyInput.value) || 1;
        if (v > 1) qtyInput.value = v - 1;
    });
    document.getElementById('qty-plus').addEventListener('click', () => {
        const v = parseInt(qtyInput.value) || 1;
        if (v < p.stock) qtyInput.value = v + 1;
    });

    document.getElementById('btn-back').addEventListener('click', () => renderProducts(container));

    document.getElementById('btn-add-cart').addEventListener('click', () => {
        const validation = Validators.isValidQuantity(qtyInput.value, p.stock);
        if (!validation.valid) return showToast(validation.msg, 'error');
        addToCart(p, Number(qtyInput.value));
    });
}

/* --- 7-b. Cart --- */
function renderCart(container) {
    if (cart.length === 0) {
        container.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-cart-shopping empty-icon"></i>
            <h2>購物車是空的</h2>
            <p>快去挑選你喜歡的商品吧！</p>
            <button class="btn" id="btn-goshop"><i class="fa-solid fa-bag-shopping"></i> 去逛逛</button>
        </div>`;
        document.getElementById('btn-goshop').addEventListener('click', () => navigate('home'));
        return;
    }

    let total = 0;
    let html  = `<h2 class="page-title">購物車清單</h2><div class="cart-list">`;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        html += `
        <div class="cart-item">
            <div class="cart-item-info">
                <img src="${item.image}" class="cart-item-img" alt="${item.name}">
                <div>
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-meta">NT$ ${item.price.toLocaleString()} × ${item.quantity} 件</div>
                </div>
            </div>
            <div class="cart-item-right">
                <div class="cart-item-subtotal">NT$ ${subtotal.toLocaleString()}</div>
                <button class="btn btn-danger btn-remove" data-index="${index}">
                    <i class="fa-solid fa-trash"></i> 移除
                </button>
            </div>
        </div>`;
    });

    html += `</div>
    <div class="cart-summary">
        <div class="cart-summary-row">
            <span>商品合計</span>
            <span class="total-price">NT$ ${total.toLocaleString()}</span>
        </div>
        <button class="btn btn-checkout" id="btn-checkout">
            <i class="fa-solid fa-credit-card"></i> 前往結帳
        </button>
    </div>`;

    container.innerHTML = html;

    container.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', e => {
            const idx = Number(e.currentTarget.dataset.index);
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
        const orderId  = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const orders   = Storage.get('orders') || [];
        const newOrder = {
            orderId,
            userId: user.id,
            date:   new Date().toLocaleString('zh-TW'),
            items:  [...cart],
            total
        };
        orders.push(newOrder);
        Storage.set('orders', orders);
        cart = [];
        Storage.set('cart', cart);
        updateCartBadge(0);
        showToast('🎉 結帳成功！訂單已成立');
        navigate('orders');
    });
}

/* --- 7-c. Orders --- */
function renderOrders(container) {
    const user = Auth.getUser();
    if (!user) { navigate('auth'); return; }

    const allOrders = Storage.get('orders') || [];
    const myOrders  = allOrders.filter(o => o.userId === user.id).reverse();

    if (myOrders.length === 0) {
        container.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-box-open empty-icon"></i>
            <h2>尚無歷史訂單紀錄</h2>
            <p>快去選購你的第一筆訂單吧！</p>
            <button class="btn" id="btn-goshop2"><i class="fa-solid fa-bag-shopping"></i> 去逛逛</button>
        </div>`;
        document.getElementById('btn-goshop2').addEventListener('click', () => navigate('home'));
        return;
    }

    let html = `<h2 class="page-title">歷史訂單查詢</h2><div style="margin-top:2rem;">`;
    myOrders.forEach(o => {
        html += `
        <div class="order-card card">
            <div class="order-header">
                <div>
                    <div class="order-label">訂單編號</div>
                    <div class="order-id">${o.orderId}</div>
                </div>
                <div style="text-align:right;">
                    <div class="order-label">訂購日期</div>
                    <div>${o.date}</div>
                </div>
            </div>
            <div class="order-items">`;
        o.items.forEach(item => {
            html += `
                <div class="order-item-row">
                    <img src="${item.image}" class="order-item-img" alt="${item.name}">
                    <span class="order-item-name">${item.name} × ${item.quantity}</span>
                    <span class="order-item-price">NT$ ${(item.price * item.quantity).toLocaleString()}</span>
                </div>`;
        });
        html += `
            </div>
            <div class="order-footer">
                <span class="order-total-label">訂單總計</span>
                <span class="order-total">NT$ ${o.total.toLocaleString()}</span>
            </div>
        </div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
}

/* --- 7-d. Auth --- */
function renderAuthView(container) {
    if (currentUser) {
        container.innerHTML = `
        <div class="auth-container card">
            <div class="member-avatar">
                <i class="fa-solid fa-user-circle"></i>
            </div>
            <h2 class="auth-title">會員中心</h2>
            <p class="member-name">${currentUser.username}</p>

            <div class="form-group">
                <label>手機號碼</label>
                <input type="text" id="prof-phone" class="form-control" value="${currentUser.phone}">
            </div>
            <div class="form-group">
                <label>修改密碼 <span style="color:#94a3b8;font-weight:400;">(留空表示不更改)</span></label>
                <input type="password" id="prof-pwd" class="form-control" placeholder="至少 6 個字元">
            </div>
            <div class="auth-btn-row">
                <button id="btn-update-profile" class="btn">
                    <i class="fa-solid fa-pen"></i> 更新資料
                </button>
                <button id="btn-logout" class="btn btn-danger">
                    <i class="fa-solid fa-right-from-bracket"></i> 登出
                </button>
            </div>
            <div class="member-orders-link">
                <button id="btn-history" class="btn btn-outline" style="width:100%;margin-top:1.5rem;">
                    <i class="fa-solid fa-clock-rotate-left"></i> 查看我的訂單
                </button>
            </div>
        </div>`;

        document.getElementById('btn-update-profile').addEventListener('click', () => {
            Auth.updateProfile(
                document.getElementById('prof-phone').value,
                document.getElementById('prof-pwd').value
            );
        });
        document.getElementById('btn-logout').addEventListener('click', () => Auth.logout());
        document.getElementById('btn-history').addEventListener('click', () => navigate('orders'));
        return;
    }

    container.innerHTML = `
    <div class="auth-container card">
        <h2 class="auth-title"><i class="fa-solid fa-shirt"></i> TRENDY 會員</h2>
        <div class="tabs">
            <div class="tab active" id="tab-login">登入</div>
            <div class="tab" id="tab-register">註冊</div>
        </div>

        <div id="form-login">
            <div class="form-group">
                <label>帳號</label>
                <input type="text" id="l-user" class="form-control" placeholder="請輸入帳號">
            </div>
            <div class="form-group">
                <label>密碼</label>
                <input type="password" id="l-pwd" class="form-control" placeholder="請輸入密碼">
            </div>
            <button id="btn-login" class="btn" style="width:100%">
                <i class="fa-solid fa-right-to-bracket"></i> 登入
            </button>
        </div>

        <div id="form-register" style="display:none;">
            <div class="form-group">
                <label>帳號 <span style="color:#94a3b8;">(至少 4 碼)</span></label>
                <input type="text" id="r-user" class="form-control" placeholder="請設定帳號">
            </div>
            <div class="form-group">
                <label>密碼 <span style="color:#94a3b8;">(至少 6 碼)</span></label>
                <input type="password" id="r-pwd" class="form-control" placeholder="請設定密碼">
            </div>
            <div class="form-group">
                <label>手機號碼</label>
                <input type="text" id="r-phone" class="form-control" placeholder="09xxxxxxxx">
            </div>
            <button id="btn-register" class="btn" style="width:100%">
                <i class="fa-solid fa-user-plus"></i> 立即註冊
            </button>
        </div>
    </div>`;

    document.getElementById('tab-login').addEventListener('click', e => {
        e.target.classList.add('active');
        document.getElementById('tab-register').classList.remove('active');
        document.getElementById('form-login').style.display = 'block';
        document.getElementById('form-register').style.display = 'none';
    });
    document.getElementById('tab-register').addEventListener('click', e => {
        e.target.classList.add('active');
        document.getElementById('tab-login').classList.remove('active');
        document.getElementById('form-login').style.display = 'none';
        document.getElementById('form-register').style.display = 'block';
    });

    document.getElementById('btn-login').addEventListener('click', () => {
        Auth.login(document.getElementById('l-user').value, document.getElementById('l-pwd').value);
    });
    document.getElementById('btn-register').addEventListener('click', () => {
        Auth.register(
            document.getElementById('r-user').value,
            document.getElementById('r-pwd').value,
            document.getElementById('r-phone').value
        );
    });

    // Enter key support
    ['l-user', 'l-pwd'].forEach(id => {
        document.getElementById(id).addEventListener('keydown', e => {
            if (e.key === 'Enter') Auth.login(
                document.getElementById('l-user').value,
                document.getElementById('l-pwd').value
            );
        });
    });
}

// ─── 8. ROUTER ───────────────────────────────────────────────────────────────
function navigate(page) {
    appContainer.style.opacity = '0';

    navLinks.forEach(link => {
        link.classList.toggle('active',
            link.dataset.page === page || (page === 'orders' && link.dataset.page === 'auth')
        );
    });

    const user = Auth.getUser();
    document.getElementById('nav-user').innerHTML = user
        ? `<i class="fa-solid fa-user-check"></i> ${user.username}`
        : `<i class="fa-solid fa-user"></i> 登入/註冊`;

    setTimeout(() => {
        appContainer.innerHTML = '';
        switch (page) {
            case 'home':   renderProducts(appContainer);  break;
            case 'cart':   renderCart(appContainer);      break;
            case 'auth':   renderAuthView(appContainer);  break;
            case 'orders': renderOrders(appContainer);    break;
            default:       renderProducts(appContainer);
        }
        appContainer.style.opacity = '1';
    }, 250);
}

// ─── 9. INIT ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    appContainer.style.transition = 'opacity 0.25s ease';

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            navigate(e.currentTarget.dataset.page);
        });
    });

    updateCartBadge(getCartItemCount());
    navigate('home');
});
