// utils.js — 共用工具函式，不依賴任何其他自訂模組，避免循環引用

const toastEl = document.getElementById('toast');
const cartBadge = document.getElementById('cart-count');

// ─── Toast Notification ───────────────────────────────────────────────────────
export function showToast(message, type = 'success') {
    toastEl.textContent = message;
    toastEl.className = `toast show ${type === 'error' ? 'error' : ''}`;
    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}

// ─── Cart Badge ───────────────────────────────────────────────────────────────
export function updateCartBadge(count) {
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? 'block' : 'none';
}

// ─── Router (lazy-loaded to avoid circular deps) ──────────────────────────────
// navigate() 在 app.js 中定義後，透過 setNavigate() 注入進來
let _navigate = null;
export function setNavigate(fn) {
    _navigate = fn;
}
export function navigate(page) {
    if (_navigate) _navigate(page);
}
