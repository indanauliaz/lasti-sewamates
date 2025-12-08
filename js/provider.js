initData();
const user = checkAuth();

// Pastikan yang akses adalah provider
if (!user || user.role !== 'provider') {
    window.location.href = 'index.html';
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).style.display = 'block';
    event.target.classList.add('active');
}

// Render List Barang Milik Provider Ini
function renderMyInventory() {
    const allProducts = getProducts();
    const myProducts = allProducts.filter(p => p.owner === user.name);
    const container = document.getElementById('myProductList');
    
    container.innerHTML = myProducts.map(p => `
        <div style="border-bottom:1px solid #eee; padding:10px; display:flex; justify-content:space-between;">
            <div><b>${p.name}</b> - ${formatRupiah(p.price)}</div>
            <button style="color:red; background:none; border:none; cursor:pointer;" onclick="deleteProduct(${p.id})">Hapus</button>
        </div>
    `).join('');
}

// Tambah Barang Baru
function addProduct() {
    const name = document.getElementById('pName').value;
    const price = parseInt(document.getElementById('pPrice').value);
    const cat = document.getElementById('pCategory').value;
    const img = document.getElementById('pImg').value || 'https://via.placeholder.com/150';
    const desc = document.getElementById('pDesc').value;

    if(name && price) {
        const products = getProducts();
        const newProduct = {
            id: Date.now(), // Generate ID unik pakai waktu
            name: name,
            category: cat,
            price: price,
            owner: user.name, // Otomatis pakai nama user yang login
            img: img,
            desc: desc
        };
        
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products)); // Simpan ke "Database"
        
        alert('Barang berhasil ditambahkan!');
        renderMyInventory();
        // Reset form...
    } else {
        alert('Lengkapi nama dan harga!');
    }
}

// Hapus Barang
function deleteProduct(id) {
    if(confirm('Yakin hapus?')) {
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        renderMyInventory();
    }
}

// Load awal
renderMyInventory();