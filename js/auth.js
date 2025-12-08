/* --- File: js/auth.js --- */

function checkAuth() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    renderNavbar(user);
    return user;
}

// FUNGSI BARU: Set Mode Aplikasi
function setAppMode(mode) {
    sessionStorage.setItem('appMode', mode);
}

function renderNavbar(user) {
    const navContainer = document.getElementById('nav-menu');
    if (!navContainer) return;

    if (user) {
        // Cek halaman mana yang aktif untuk visual navbar
        const path = window.location.pathname;
        const isProviderPage = path.includes('provider.html');
        const isRenterPage = path.includes('index.html') || path.includes('order.html');

        // Style tombol
        const activeStyle = 'color: var(--primary-color); font-weight: 700; border-bottom: 2px solid var(--primary-color);';
        const inactiveStyle = 'color: #555; font-weight: 500;';

        // NOTE: Perhatikan onclick="setAppMode(...)" di bawah ini
        navContainer.innerHTML = `
            <div style="display: flex; gap: 20px; margin-right: auto; margin-left: 30px;">
                <a href="index.html" onclick="setAppMode('renter')" style="text-decoration:none; ${isRenterPage ? activeStyle : inactiveStyle}">
                    <i class="fas fa-shopping-bag"></i> Mode Penyewa
                </a>
                <a href="provider.html" onclick="setAppMode('provider')" style="text-decoration:none; ${isProviderPage ? activeStyle : inactiveStyle}">
                    <i class="fas fa-store"></i> Mode Penyedia
                </a>
            </div>

            <div style="display: flex; align-items: center; gap: 20px;">
                <a href="profile.html" style="text-decoration:none; color:#555; font-weight:500;">Profil</a>
                <a onclick="handleLogout()" style="color: #ff6b6b; cursor: pointer; font-weight: 600;">Logout</a>
            </div>
        `;
    } else {
        navContainer.innerHTML = `<a href="login.html" class="btn-login">Masuk / Daftar</a>`;
    }
}

function handleLoginEvent(username, password) {
    if (password === '123') { 
        // Hapus role hardcoded. Semua user mulai sebagai 'renter' secara default saat login.
        const userData = { name: username }; 
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        sessionStorage.setItem('appMode', 'renter'); // Default mode
        return true;
    }
    return false;
}

function handleLogout() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('appMode');
    window.location.href = 'index.html';
}