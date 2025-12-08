// DATABASE HARDCODED
const users = {
    'indana': { pass: '123', role: 'renter' },
    'budi': { pass: '123', role: 'provider' }
};

// 1. SYNC LISTENER (Supaya window sebelah update otomatis)
window.addEventListener('storage', (event) => {
    if (event.key === 'sewa_order_db') {
        renderApp(); 
    }
});

// 2. SISTEM LOGIN
function handleLogin() {
    const u = document.getElementById('usernameInput').value.toLowerCase();
    const p = document.getElementById('passwordInput').value;

    if (users[u] && users[u].pass === p) {
        sessionStorage.setItem('currentUser', JSON.stringify({ name: u, role: users[u].role }));
        renderApp();
    } else {
        alert("Salah username/password");
    }
}

function handleLogout() {
    sessionStorage.removeItem('currentUser');
    renderApp();
}

// 3. LOGIKA UTAMA (RENDERER)
function renderApp() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('app-page').style.display = 'none';
        return;
    }

    document.getElementById('login-page').style.display = 'none';
    document.getElementById('app-page').style.display = 'block';
    document.getElementById('userDisplay').innerText = `Halo, ${currentUser.name}`;

    // Ambil Data dari LocalStorage
    const orderData = JSON.parse(localStorage.getItem('sewa_order_db'));

    // --- TAMPILAN PENYEWA ---
    if (currentUser.role === 'renter') {
        document.getElementById('renter-view').style.display = 'block';
        document.getElementById('provider-view').style.display = 'none';
        hideAllRenterSections();

        if (!orderData) {
            document.getElementById('renter-form-section').style.display = 'block';
        } else if (orderData.status === 'pending') {
            document.getElementById('renter-wait-section').style.display = 'block';
        } else if (orderData.status === 'approved') {
            document.getElementById('renter-pay-section').style.display = 'block';
        } else if (orderData.status === 'done') {
            document.getElementById('renter-done-section').style.display = 'block';
            document.getElementById('pickupInstruction').innerText = 
                orderData.method === 'COD Labtek V' ? "Temui Budi di Labtek V" : "Kode Locker: 8821";
        }

    } 
    // --- TAMPILAN PENYEDIA ---
    else {
        document.getElementById('renter-view').style.display = 'none';
        document.getElementById('provider-view').style.display = 'block';

        if (!orderData) {
            document.getElementById('provider-empty').style.display = 'block';
            document.getElementById('provider-card').style.display = 'none';
            document.getElementById('provider-waiting-pay').style.display = 'none';
            document.getElementById('provider-done').style.display = 'none';
        } else if (orderData.status === 'pending') {
            document.getElementById('provider-empty').style.display = 'none';
            document.getElementById('provider-card').style.display = 'block';
            
            // Tampilkan Info Tanggal & Total
            document.getElementById('prov-info').innerHTML = `
                📅 ${formatDate(orderData.start)} - ${formatDate(orderData.end)}<br>
                💰 <b>Rp ${orderData.total.toLocaleString()}</b> (${orderData.days} Hari)
            `;
            document.getElementById('prov-method').innerText = orderData.method;

        } else if (orderData.status === 'approved') {
            document.getElementById('provider-card').style.display = 'none';
            document.getElementById('provider-waiting-pay').style.display = 'block';
        } else if (orderData.status === 'done') {
            document.getElementById('provider-waiting-pay').style.display = 'none';
            document.getElementById('provider-done').style.display = 'block';
        }
    }
}

function hideAllRenterSections() {
    ['renter-form-section', 'renter-wait-section', 'renter-pay-section', 'renter-done-section']
        .forEach(id => document.getElementById(id).style.display = 'none');
}

// 4. LOGIKA HITUNG TANGGAL (UPDATE TERBARU)
function calcPrice() {
    const startVal = document.getElementById('startDate').value;
    const endVal = document.getElementById('endDate').value;
    const btn = document.getElementById('btnSewa');
    const display = document.getElementById('priceDisplay');

    if (startVal && endVal) {
        const start = new Date(startVal);
        const end = new Date(endVal);

        if (end >= start) {
            // Hitung selisih hari (+1 agar minimal 1 hari)
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
            const total = diffDays * 5000;

            display.innerText = `Total: Rp ${total.toLocaleString()}`;
            btn.disabled = false;
            btn.innerText = `Ajukan Sewa (${diffDays} Hari)`;
            return;
        }
    }
    
    // Jika tanggal tidak valid
    display.innerText = "Total: Rp 0";
    btn.disabled = true;
    btn.innerText = "Pilih Tanggal Dulu";
}

// Helper untuk format tanggal jadi "10 Okt"
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// 5. ACTION FUNCTIONS
function submitOrder() {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    const method = document.getElementById('pickupMethod').value;
    
    // Hitung ulang untuk simpan data
    const sDate = new Date(start);
    const eDate = new Date(end);
    const days = Math.ceil(Math.abs(eDate - sDate) / (1000 * 60 * 60 * 24)) + 1;

    const newOrder = {
        start: start,
        end: end,
        days: days,
        total: days * 5000,
        method: method,
        status: 'pending'
    };
    
    localStorage.setItem('sewa_order_db', JSON.stringify(newOrder));
    renderApp();
}

function approveOrder() {
    const orderData = JSON.parse(localStorage.getItem('sewa_order_db'));
    orderData.status = 'approved';
    localStorage.setItem('sewa_order_db', JSON.stringify(orderData));
    renderApp();
}

function payOrder() {
    const orderData = JSON.parse(localStorage.getItem('sewa_order_db'));
    orderData.status = 'done';
    localStorage.setItem('sewa_order_db', JSON.stringify(orderData));
    renderApp();
}

function resetSystem() {
    localStorage.removeItem('sewa_order_db');
    renderApp();
}

document.addEventListener('DOMContentLoaded', renderApp);