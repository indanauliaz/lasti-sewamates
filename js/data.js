// DATA DUMMY PRODUK
const defaultProducts = [
    { 
        id: 1, 
        name: 'Kalkulator FX-991', 
        category: 'Alat Tulis', 
        price: 5000, 
        owner: 'belinda', 
        img: 'https://images.unsplash.com/photo-1594910072328-765083dc8d33?q=80&w=1000', 
        desc: 'Cocok untuk ujian Fisdas/Kalkulus. Baterai baru ganti.' 
    },
    { 
        id: 2, 
        name: 'Jas Lab Putih (L)', 
        category: 'Pakaian', 
        price: 10000, 
        owner: 'kamala', 
        img: 'https://down-id.img.susercontent.com/file/646247924409540b793666c043029f60', 
        desc: 'Bahan oxford, ukuran L, bersih habis di-laundry.' 
    },
    { 
        id: 3, 
        name: 'Sleeping Bag Eiger', 
        category: 'Outdoor', 
        price: 25000, 
        owner: 'farrel', 
        img: 'https://id-test-11.slatic.net/p/e27435f303f848f08149f1a21f7c706d.jpg', 
        desc: 'Untuk kemping di Dago. Hangat dan ringan.' 
    },
    { 
        id: 4, 
        name: 'Kamera DSLR Canon', 
        category: 'Elektronik', 
        price: 50000, 
        owner: 'belinda', 
        img: 'https://images.unsplash.com/photo-1560942502-d9612984b917', 
        desc: 'Cocok buat dokumentasi acara himpunan. Lensa 50mm.' 
    },
    { 
        id: 5, 
        name: 'Drone DJI Mini', 
        category: 'Elektronik', 
        price: 70000, 
        owner: 'budi', 
        img: 'https://images.unsplash.com/photo-1506820556276-218228303038', 
        desc: 'Drone kecil, cocok buat pemula. Termasuk 2 baterai.' 
    }
];

// FUNGSI INIT
function initData() {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
    // Pastikan database orders juga ada biar gak error null
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
}

// FUNGSI GET PRODUCTS
function getProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

// 💡 FUNGSI PENTING: Cari Produk berdasarkan ID
function getProductById(id) {
    const products = getProducts();
    // PENTING: Pakai '==' biar angka (1) dan string ('1') dianggap sama
    return products.find(p => p.id == id);
}

// Helper format Rupiah
function formatRupiah(angka) { 
    return 'Rp ' + parseInt(angka).toLocaleString('id-ID'); 
}

// --- LOGIKA ORDER ---

// 1. Buat Order Baru
function createOrder(product, renter, startDate, endDate, totalDays, totalPrice, method) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    const newOrder = {
        id: 'ORD-' + Date.now(),
        productId: product.id,
        productName: product.name,
        productImg: product.img,
        owner: product.owner,
        renter: renter,
        start: startDate,
        end: endDate,
        days: totalDays,
        total: totalPrice,
        method: method || 'Ambil Langsung', // Default method jika kosong
        status: 'unpaid'
    };
    
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    return newOrder.id; 
}

// 2. Ambil Orderan Masuk (Untuk Provider)
function getIncomingOrders(providerName) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    // Filter: Barang milik provider INI, dan statusnya bukan unpaid
    return orders.filter(o => o.owner === providerName && o.status !== 'unpaid');
}

// 3. Ambil Riwayat Belanja (Untuk Renter/Profil)
function getOrdersByRenter(renterName) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders.filter(o => o.renter === renterName && o.status !== 'unpaid').reverse();
}

// 4. Update Status Order
function updateOrderStatus(orderId, newStatus) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
        orders[index].status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
    }
}