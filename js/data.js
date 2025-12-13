// (Kita tidak butuh defaultProducts lagi karena data sudah di Cloud)

function initData() {
    // Kosongkan saja, atau gunakan untuk listener realtime nanti
    console.log("Menghubungkan ke Firebase...");
}

// 🔥 FUNGSI BARU: Ambil Produk dari Firestore (Async)
async function getProducts() {
    try {
        // Minta data ke collection 'products'
        const snapshot = await db.collection('products').get();
        
        // Ubah formatnya biar jadi Array biasa
        const products = snapshot.docs.map(doc => ({
            id: doc.id,       // Ambil ID dokumen Firebase
            ...doc.data()     // Ambil sisa datanya (name, price, dll)
        }));

        return products;
    } catch (error) {
        console.error("Gagal ambil data:", error);
        return [];
    }
}

// 🔥 Cari Produk by ID (Juga Async karena harus nunggu data)
async function getProductById(id) {
    try {
        const doc = await db.collection('products').doc(id).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error cari barang:", error);
        return null;
    }
}

// Helper Format Rupiah (Tetap sama)
function formatRupiah(angka) {
    return 'Rp ' + (angka || 0).toLocaleString('id-ID');
}

// ... (Fungsi Order biarkan dulu, kita fokus nampilin barang dulu) ...

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