/* --- File: js/catalog.js (FINAL FIX) --- */

// Variabel untuk menyimpan produk yang sedang dilihat di modal
let currentProduct = null;

// RENDER KATALOG
function renderCatalog(products) {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (products.length === 0) {
        grid.innerHTML = '<p style="text-align:center; width:100%;">Tidak ada barang.</p>';
        return;
    }

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => openModal(p); // Pass object produknya
        
        card.innerHTML = `
            <div class="product-img"><img src="${p.img}" alt="${p.name}"></div>
            <div class="product-info">
                <div style="font-weight:bold;">${p.name}</div>
                <div style="font-size:12px; color:#888;">Penyedia: ${p.owner}</div>
                <div style="color:#4a69bd; font-weight:600; margin-top:5px;">${formatRupiah(p.price)}/hari</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- MODAL LOGIC (Pop Up) ---
function openModal(product) {
    currentProduct = product; // Simpan produk di variabel global
    const user = firebase.auth().currentUser;
    let currentDisplayName = null;

    if (user && user.email.endsWith('@mahasiswa.itb.ac.id')) {
        // 2. Hitung Display Name (Logika yang sama dengan di Navbar)
        currentDisplayName = (user.displayName || user.email.split('@')[0]).trim();
    }
    
    const rentButton = document.querySelector('.modal-content .btn-main');

    document.getElementById('modalTitle').innerText = product.name;
    document.getElementById('modalOwner').innerText = 'Penyedia: ' + product.owner;
    document.getElementById('modalDesc').innerText = product.desc;
    document.getElementById('modalPrice').innerText = formatRupiah(product.price) + ' / hari';
    document.getElementById('modalImg').src = product.img;
    
    // >> LOGIKA PENCEGAHAN SEWA BARANG SENDIRI <<
    if (rentButton) {
        // >> LOGIKA PENCEGAHAN SEWA BARANG SENDIRI <<
        if (currentDisplayName && product.owner.toLowerCase().trim() === currentDisplayName.toLowerCase()) {
            rentButton.disabled = true;
            rentButton.innerText = 'Ini Barang Milik Anda!';
            rentButton.style.backgroundColor = '#ffc048'; // Warna kuning/oranye
            rentButton.style.cursor = 'not-allowed';
        } else {
            // Bukan barang milik sendiri
            rentButton.disabled = false;
            rentButton.innerText = 'Sewa Sekarang';
            // Reset style ke default
            rentButton.style.backgroundColor = ''; 
            rentButton.style.cursor = 'pointer';
        }
    }

    document.getElementById('productModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Tutup modal kalau klik di luar kotak putih
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// --- LOGIKA TOMBOL SEWA (FIXED: Pake Firebase Check) ---
function checkLoginAndRent() {
    // 💡 CEK STATUS LOGIN VIA FIREBASE
    const user = firebase.auth().currentUser; 
    let currentDisplayName = null;
    
    if (user && user.email.endsWith('@mahasiswa.itb.ac.id')) {
        currentDisplayName = (user.displayName || user.email.split('@')[0]).trim();
    }

    // Lapisan Proteksi Kedua (case-insensitive)
    if (currentDisplayName && currentProduct && currentProduct.owner.toLowerCase().trim() === currentDisplayName.toLowerCase()) {
        // KASUS PENCEGAHAN: Barang milik sendiri
        alert("Maaf, Anda tidak dapat menyewa barang milik Anda sendiri.");
        closeModal();
        return; 
    }

    if (user) {
        // SKENARIO A: SUDAH LOGIN
        // Langsung ke halaman Order bawa ID barang
        window.location.href = `order.html?id=${currentProduct.id}`;
    } else {
        // SKENARIO B: BELUM LOGIN
        // Simpan ID barang yang mau disewa
        sessionStorage.setItem('pendingOrderId', currentProduct.id);
        window.location.href = 'login.html'; 
    }
}

// Fungsi Search
function handleSearch(keyword) {
    const allProducts = getProducts();
    const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(keyword.toLowerCase()) || 
        p.category.toLowerCase().includes(keyword.toLowerCase())
    );
    renderCatalog(filtered);
}

// Helper Format Rupiah 
function formatRupiah(angka) {
    // Memastikan format Rupiah berjalan lancar
    return 'Rp ' + (angka || 0).toLocaleString('id-ID');
}