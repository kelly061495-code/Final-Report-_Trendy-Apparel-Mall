import { renderProducts } from './products.js';
import { renderCart, renderOrders, getCartItemCount } from './cart.js';
import { renderAuthView, Auth } from './auth.js';
import { setNavigate, updateCartBadge } from './utils.js';

const appContainer = document.getElementById('app-container');
const navLinks = document.querySelectorAll('.nav-links a');

// ─── Simple Router ────────────────────────────────────────────────────────────
function navigate(page) {
    appContainer.style.opacity = '0';

    // Update nav active state
    navLinks.forEach(link => {
        if (link.dataset.page === page || (page === 'orders' && link.dataset.page === 'auth')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Update nav user text
    const user = Auth.getUser();
    document.getElementById('nav-user').innerHTML = user
        ? `<i class="fa-solid fa-user-check"></i> ${user.username}`
        : `<i class="fa-solid fa-user"></i> 登入/註冊`;

    setTimeout(() => {
        appContainer.innerHTML = '';
        switch (page) {
            case 'home':
                renderProducts(appContainer);
                break;
            case 'cart':
                renderCart(appContainer);
                break;
            case 'auth':
                renderAuthView(appContainer);
                break;
            case 'orders':
                renderOrders(appContainer);
                break;
            default:
                renderProducts(appContainer);
        }
        appContainer.style.opacity = '1';
    }, 300);
}

// ─── Initialization ───────────────────────────────────────────────────────────
// 把 navigate 注入 utils，讓各子模組可以呼叫卻不必引入 app.js
setNavigate(navigate);

document.addEventListener('DOMContentLoaded', () => {
    appContainer.style.transition = 'opacity 0.3s ease';

    // Set up nav clicks
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            navigate(e.currentTarget.dataset.page);
        });
    });

    // Initial state
    updateCartBadge(getCartItemCount());
    navigate('home');
});
