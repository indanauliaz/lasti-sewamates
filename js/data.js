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
        img: 'https://id-test-11.slatic.net/p/e2b610057022138139e80e3034293f77.jpg', 
        desc: 'Hangat, cocok untuk jurit malam atau camping.' 
    }
];

// FUNGSI UTAMA
function initData() {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
}

function getProducts() { return JSON.parse(localStorage.getItem('products')) || []; }

// Helper: Pakai '==' biar angka 1 sama dengan string "1" dari URL
function getProductById(id) { 
    return getProducts().find(p => p.id == id); 
}

function formatRupiah(angka) { return 'Rp ' + angka.toLocaleString('id-ID'); }

// LOGIKA ORDER
function createOrder(product, renter, startDate, endDate, totalDays, totalPrice) {
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
        status: 'unpaid'
    };
    
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    return newOrder.id; 
}

// LOGIKA UPDATE STATUS & GET ORDER
function updateOrderStatus(orderId, newStatus) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
        orders[index].status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
    }
}

function getOrdersByRenter(renterName) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders.filter(o => o.renter === renterName && o.status !== 'unpaid').reverse();
}

function getIncomingOrders(providerName) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders.filter(o => o.owner === providerName && o.status !== 'unpaid');
}