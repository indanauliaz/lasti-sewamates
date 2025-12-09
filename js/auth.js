/* --- File: js/auth.js --- */

// 1. CONFIG FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyBxwQcXWS19rC6c3CisS3yH36-q9rYZYIg",
    authDomain: "sso-login-sewamates.firebaseapp.com",
    projectId: "sso-login-sewamates",
    storageBucket: "sso-login-sewamates.firebasestorage.app",
    messagingSenderId: "225488273196",
    appId: "1:225488273196:web:2888e738dc26e3afeaf689"
};

// Initialize Firebase (Cek biar gak double init)
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else if (typeof firebase === 'undefined') {
    console.error("Firebase SDK belum dimuat! Pastikan script firebase ada di HTML.");
}

const auth = firebase.auth();
const provider = new firebase.auth.OAuthProvider('microsoft.com');
provider.setCustomParameters({ prompt: 'select_account' });

// --- 2. FUNGSI LOGIN (Pake Microsoft) ---
function loginMicrosoft() {
    const btnLogin = document.getElementById('btnLogin');
    const errorMsg = document.getElementById('errorMsg');
    
    // Ubah tombol jadi loading
    if(btnLogin) btnLogin.innerHTML = "Memproses...";

    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            
            // VALIDASI: Cuma boleh anak ITB
            if (user.email.endsWith('@mahasiswa.itb.ac.id')) {
                console.log("Login Sukses:", user.email);

                // Set default mode kalau baru pertama kali login
                if (!sessionStorage.getItem('appMode')) {
                    sessionStorage.setItem('appMode', 'renter');
                }

                // Cek apakah user sebelumnya mau sewa barang? (Redirect logic)
                const pendingItem = sessionStorage.getItem('pendingOrderId');
                if (pendingItem) {
                    sessionStorage.removeItem('pendingOrderId');
                    window.location.href = `order.html?id=${pendingItem}`;
                } else {
                    window.location.href = 'index.html';
                }

            } else {
                // Tendang user ilegal
                user.delete();
                if(errorMsg) {
                    errorMsg.style.display = 'block';
                    errorMsg.innerText = "Maaf, khusus email @mahasiswa.itb.ac.id 🙏";
                }
                if(btnLogin) btnLogin.innerHTML = "Masuk dengan Microsoft";
            }
        })
        .catch((error) => {
            console.error("Login Error:", error);
            if(errorMsg) {
                errorMsg.style.display = 'block';
                errorMsg.innerText = "Gagal: " + error.message;
            }
            if(btnLogin) btnLogin.innerHTML = "Masuk dengan Microsoft";
        });
}

// --- 3. FUNGSI LOGOUT ---
function handleLogout() {
    auth.signOut().then(() => {
        sessionStorage.removeItem('appMode');
        window.location.href = 'login.html';
    });
}

// --- 4. APP MODE ---
function setAppMode(mode) {
    sessionStorage.setItem('appMode', mode);
    // window.location.reload();  <-- HAPUS BARIS INI (Gak perlu)
}

// --- 5. CHECK AUTH (Listener Firebase) ---
function checkAuth() {
    auth.onAuthStateChanged((user) => {
        const navContainer = document.getElementById('nav-menu');
        
        if (user) {
            // -- USER LOGGED IN --
            // Security check
            if (!user.email.endsWith('@mahasiswa.itb.ac.id')) {
                auth.signOut();
                return;
            }
            renderNavbar(user, true); 
        } else {
            // -- USER NOT LOGGED IN --
            renderNavbar(null, false);
            
            // Proteksi: Kalau user coba buka halaman provider/profile tanpa login, tendang ke login
            const path = window.location.pathname;
            if (path.includes('provider.html') || path.includes('profile.html')) {
                window.location.href = 'login.html';
            }
        }
    });
}

// --- 6. RENDER NAVBAR (Versi FIX: Logout Tulisan Merah) ---
function renderNavbar(user, isLoggedIn) {
    const navContainer = document.getElementById('nav-menu');
    if (!navContainer) return;

    if (isLoggedIn && user) {
        // Cek mode dari penyimpanan browser
        const currentMode = sessionStorage.getItem('appMode') || 'renter';
        
        const isProviderPage = currentMode === 'provider';
        const isRenterPage = currentMode === 'renter'; 

        // Style aktif/tidak aktif
        const activeStyle = 'color: var(--primary-color); font-weight: 700; border-bottom: 2px solid var(--primary-color);';
        const inactiveStyle = 'color: #555; font-weight: 500;';

        const displayName = user.displayName || user.email.split('@')[0];
        const photoURL = user.photoURL 
            ? user.photoURL 
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D8ABC&color=fff`;

        // Render Navbar Lengkap
        navContainer.innerHTML = `
            <div style="display: flex; gap: 20px; margin-right: auto; margin-left: 30px;">
                <a href="index.html" onclick="setAppMode('renter')" style="text-decoration:none; ${isRenterPage ? activeStyle : inactiveStyle}">
                    <i class="fas fa-shopping-bag"></i> Mode Penyewa
                </a>
                <a href="provider.html" onclick="setAppMode('provider')" style="text-decoration:none; ${isProviderPage ? activeStyle : inactiveStyle}">
                    <i class="fas fa-store"></i> Mode Penyedia
                </a>
            </div>

            <div style="display: flex; align-items: center; gap: 15px;">
                
                <a href="profile.html" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:10px; cursor:pointer;">
                    <img src="${photoURL}" 
                         onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D8ABC&color=fff'"
                         style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #eee;">
                         
                    <div style="text-align: right; line-height: 1.2;">
                        <span style="display:block; font-weight:bold; font-size:14px; color:#333;">${displayName}</span>
                        <span style="font-size:11px; color:#666;">${user.email}</span>
                    </div>
                </a>

                <a onclick="handleLogout()" 
                   title="Keluar" 
                   style="color: #ff6b6b; cursor: pointer; font-weight: 600; font-size: 14px; margin-left: 10px; text-decoration: none;">
                    Logout
                </a>
            </div>
        `;
    } else {
        // TAMPILAN TAMU
        navContainer.innerHTML = `
            <div style="margin-left: auto;">
                <a href="login.html" class="btn-main" style="text-decoration:none; padding: 10px 25px; color: white; border-radius: 20px;">
                    Masuk / Daftar
                </a>
            </div>
        `;
    }
}

/* --- File: js/auth.js --- (Tambahkan di bagian bawah) */

// --- 7. HELPER: AMBIL ID PENGGUNA (SAMA DENGAN OWNER NAME) ---
function getCurrentUserName() {
    const user = firebase.auth().currentUser;
    if (user && user.email.endsWith('@mahasiswa.itb.ac.id')) {
        // Ambil bagian sebelum @.
        return user.email.split('@')[0];
    }
    return null; 
}