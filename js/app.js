import { renderProducts } from './products.js';
import { renderCart, renderOrders, getCartItemCount } from './cart.js';
import { renderAuthView, Auth } from './auth.js';

const appContainer = document.getElementById('app-container');
const toastEl = document.getElementById('toast');
const cartBadge = document.getElementById('cart-count');
const navLinks = document.querySelectorAll('.nav-links a');

// Toast Notification System
export function showToast(message, type = 'success') {
    toastEl.textContent = message;
    toastEl.className = `toast show ${type === 'error' ? 'error' : ''}`;
    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}

export function updateCartBadge(count) {
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? 'block' : 'none';
}

// Simple Router
export function navigate(page) {
    appContainer.style.opacity = '0';
    
    // Update nav active state
    navLinks.forEach(link => {
        if(link.dataset.page === page || (page === 'orders' && link.dataset.page === 'auth')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Update nav user text
    const user = Auth.getUser();
    document.getElementById('nav-user').innerHTML = user ? 
        `<i class="fa-solid fa-user-check"></i> ${user.username}` : 
        `<i class="fa-solid fa-user"></i> 登入/註冊`;

    setTimeout(() => {
        appContainer.innerHTML = '';
        switch(page) {
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

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    appContainer.style.transition = 'opacity 0.3s ease';
    
    // Set up nav clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(e.currentTarget.dataset.page);
        });
    });

    // Initial state
    updateCartBadge(getCartItemCount());
    navigate('home');
});
