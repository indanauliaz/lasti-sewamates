let currentSelectedId = null;

// Fungsi Utama Render Katalog
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
        // Saat diklik, buka modal dengan data produk ini
        card.onclick = () => openModal(p); 
        
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

// MODAL LOGIC
let currentProduct = null; // Simpan produk yang lagi dibuka

function openModal(product) {
    currentProduct = product; // Simpan di variabel global biar tombol sewa tau
    
    document.getElementById('modalTitle').innerText = product.name;
    document.getElementById('modalOwner').innerText = 'Penyedia: ' + product.owner;
    document.getElementById('modalDesc').innerText = product.desc;
    document.getElementById('modalPrice').innerText = formatRupiah(product.price) + ' / hari';
    document.getElementById('modalImg').src = product.img;
    
    document.getElementById('productModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// LOGIKA TOMBOL SEWA
function checkLoginAndRent() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (user) {
        // SUDAH LOGIN: Langsung ke order.html bawa ID
        window.location.href = `order.html?id=${currentProduct.id}`;
    } else {
        // BELUM LOGIN: Simpan ID, suruh login dulu
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

// --- MODAL LOGIC (Pop Up) ---
function openModal(product) {
    currentSelectedId = product.id;
    document.getElementById('modalTitle').innerText = product.name;
    document.getElementById('modalOwner').innerText = 'Penyedia: ' + product.owner;
    document.getElementById('modalDesc').innerText = product.desc;
    document.getElementById('modalPrice').innerText = formatRupiah(product.price) + ' / hari';
    document.getElementById('modalImg').src = product.img;
    
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

// --- KLIK TOMBOL SEWA DI MODAL ---
function checkLoginAndRent() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (user) {
        // Jika sudah login, langsung ke halaman Order bawa ID barang
        window.location.href = `order.html?id=${currentSelectedId}`;
    } else {
        // Jika belum login, lempar ke Login
        // (Opsional: Simpan ID barang biar nanti abis login langsung balik sini)
        sessionStorage.setItem('pendingOrderId', currentSelectedId);
        window.location.href = 'login.html'; 
    }
}

// Helper Format Rupiah (Duplikat dr data.js biar aman)
function formatRupiah(angka) {
    return 'Rp ' + angka.toLocaleString('id-ID');
}