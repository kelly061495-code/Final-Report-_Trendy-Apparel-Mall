import { Storage, Validators } from './data.js';
import { showToast, navigate } from './app.js';

let currentUser = Storage.get('currentUser');

export const Auth = {
    getUser: () => currentUser,
    
    login: (username, password) => {
        const users = Storage.get('users') || [];
        const user = users.find(u => u.username === username && u.password === password);
        
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
        if (!Validators.isValidPhone(phone)) return showToast('請輸入有效的手機號碼 (09開頭10碼)', 'error');

        const users = Storage.get('users') || [];
        if (users.find(u => u.username === username)) {
            return showToast('帳號已存在', 'error');
        }

        const newUser = { username, password, phone, id: 'U' + Date.now() };
        users.push(newUser);
        Storage.set('users', users);
        
        // Auto login
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
        if (!Validators.isValidPhone(phone)) return showToast('手機格式錯誤', 'error');
        if (newPassword && !Validators.isValidPassword(newPassword)) return showToast('密碼格式錯誤', 'error');

        const users = Storage.get('users') || [];
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

export function renderAuthView(container) {
    if (currentUser) {
        container.innerHTML = `
            <div class="auth-container card">
                <h2>會員中心</h2>
                <div style="margin: 2rem 0;">
                    <p><strong>使用者帳號：</strong> ${currentUser.username}</p>
                </div>
                <div class="form-group">
                    <label>修改手機號碼</label>
                    <input type="text" id="prof-phone" class="form-control" value="${currentUser.phone}">
                </div>
                <div class="form-group">
                    <label>修改密碼 (留白表示不更改)</label>
                    <input type="password" id="prof-pwd" class="form-control">
                </div>
                <div style="display:flex; gap: 1rem;">
                    <button id="btn-update-profile" class="btn">更新資料</button>
                    <button id="btn-logout" class="btn btn-danger">登出</button>
                </div>
                
                <div style="margin-top: 3rem;">
                    <h3>歷史訂單查詢</h3>
                    <button id="btn-history" class="btn btn-outline" style="margin-top: 1rem;">查看我的訂單</button>
                </div>
            </div>
        `;

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

    // Login / Register Form
    container.innerHTML = `
        <div class="auth-container card">
            <div class="tabs">
                <div class="tab active" id="tab-login">登入</div>
                <div class="tab" id="tab-register">註冊</div>
            </div>
            
            <div id="form-login">
                <div class="form-group">
                    <label>帳號</label>
                    <input type="text" id="l-user" class="form-control">
                </div>
                <div class="form-group">
                    <label>密碼</label>
                    <input type="password" id="l-pwd" class="form-control">
                </div>
                <button id="btn-login" class="btn" style="width: 100%">登入</button>
            </div>

            <div id="form-register" style="display:none;">
                <div class="form-group">
                    <label>帳號 (至少4碼)</label>
                    <input type="text" id="r-user" class="form-control">
                </div>
                <div class="form-group">
                    <label>密碼 (至少6碼)</label>
                    <input type="password" id="r-pwd" class="form-control">
                </div>
                <div class="form-group">
                    <label>手機號碼</label>
                    <input type="text" id="r-phone" class="form-control" placeholder="09xxxxxxxx">
                </div>
                <button id="btn-register" class="btn" style="width: 100%">註冊</button>
            </div>
        </div>
    `;

    document.getElementById('tab-login').addEventListener('click', (e) => {
        e.target.classList.add('active');
        document.getElementById('tab-register').classList.remove('active');
        document.getElementById('form-login').style.display = 'block';
        document.getElementById('form-register').style.display = 'none';
    });

    document.getElementById('tab-register').addEventListener('click', (e) => {
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
}
