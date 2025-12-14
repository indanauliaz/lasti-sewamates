function initData() {
    console.log("Menghubungkan ke Firebase...");
}

// Ambil Produk dari Firestore
async function getProducts() {
    try {
        const snapshot = await db.collection('products').get();
        
        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return products;
    } catch (error) {
        console.error("Gagal ambil data:", error);
        return [];
    }
}

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

function formatRupiah(angka) {
    return 'Rp ' + (angka || 0).toLocaleString('id-ID');
}

// Buat Order Baru
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
        method: method || 'Ambil Langsung',
        status: 'unpaid'
    };
    
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    return newOrder.id; 
}

// Ambil Orderan Masuk
function getIncomingOrders(providerName) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders.filter(o => o.owner === providerName && o.status !== 'unpaid');
}

// Ambil Riwayat Belanja
function getOrdersByRenter(renterName) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders.filter(o => o.renter === renterName && o.status !== 'unpaid').reverse();
}

// Update Status Order
function updateOrderStatus(orderId, newStatus) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
        orders[index].status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
    }
}