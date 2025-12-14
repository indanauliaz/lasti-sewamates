let currentProduct = null;

// Render Katalog
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

function openModal(product) {
    currentProduct = product;
    const user = firebase.auth().currentUser;
    let currentDisplayName = null;

    if (user && user.email.endsWith('@mahasiswa.itb.ac.id')) {
        currentDisplayName = (user.displayName || user.email.split('@')[0]).trim();
    }
    
    const rentButton = document.querySelector('.modal-content .btn-main');

    document.getElementById('modalTitle').innerText = product.name;
    document.getElementById('modalOwner').innerText = 'Penyedia: ' + product.owner;
    document.getElementById('modalDesc').innerText = product.desc;
    document.getElementById('modalPrice').innerText = formatRupiah(product.price) + ' / hari';
    document.getElementById('modalImg').src = product.img;
    
    // Gaboleh Sewa Barang Sendiri
    if (rentButton) {
        if (currentDisplayName && product.owner.toLowerCase().trim() === currentDisplayName.toLowerCase()) {
            rentButton.disabled = true;
            rentButton.innerText = 'Ini Barang Milik Anda!';
            rentButton.style.backgroundColor = '#ffc048';
            rentButton.style.cursor = 'not-allowed';
        } else {
            rentButton.disabled = false;
            rentButton.innerText = 'Sewa Sekarang';
            rentButton.style.backgroundColor = ''; 
            rentButton.style.cursor = 'pointer';
        }
    }

    document.getElementById('productModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Sewa
function checkLoginAndRent() {
    const user = firebase.auth().currentUser; 
    let currentDisplayName = null;
    
    if (user && user.email.endsWith('@mahasiswa.itb.ac.id')) {
        currentDisplayName = (user.displayName || user.email.split('@')[0]).trim();
    }

    if (currentDisplayName && currentProduct && currentProduct.owner.toLowerCase().trim() === currentDisplayName.toLowerCase()) {
        alert("Maaf, Anda tidak dapat menyewa barang milik Anda sendiri.");
        closeModal();
        return; 
    }

    if (user) {
        // Udah Login
        window.location.href = `order.html?id=${currentProduct.id}`;
    } else {
        // Belum Login
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
    return 'Rp ' + (angka || 0).toLocaleString('id-ID');
}