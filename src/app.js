document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
            { id: 1, name: 'Robusta Brazil', img: 'img/products/1.jpg', price: 20000 },
            { id: 2, name: 'Arabica Blend', img: 'img/products/1.jpg', price: 21000 },
            { id: 3, name: 'Primo Passo', img: 'img/products/1.jpg', price: 22000 },
            { id: 4, name: 'Aceh Gayo', img: 'img/products/1.jpg', price: 23000 },
            { id: 5, name: 'Sumatera Mandheling', img: 'img/products/1.jpg', price: 24000 },
            { id: 6, name: 'Dalgona Coffee', img: 'img/products/1.jpg', price: 25000 },
            { id: 7, name: 'Luwak White Coffee', img: 'img/products/1.jpg', price: 26000 },
            { id: 8, name: 'Torabika Kapal Api', img: 'img/products/1.jpg', price: 27000 },
            { id: 9, name: 'Torabika Kapal Laut', img: 'img/products/1.jpg', price: 28000 },
            { id: 10, name: 'Torabika Kapal Selam', img: 'img/products/1.jpg', price: 29000 },
        ],
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,

        add(newItem) {
            // cek apakah ada barang yang sama di cart
            const cartItem = this.items.find((item) => item.id === newItem.id);

            // jika belum ada / cart masih kosong
            if (!cartItem) {
                this.items.push({ ...newItem, quantity: 1, total: newItem.price });
                this.quantity++;
                this.total += newItem.price;
            } else {
                // jika barang sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
                this.items = this.items.map((item) => {
                    // jika barang berbeda
                    if (item.id !== newItem.id) {
                        return item;
                    } else {
                        // jika barang sudah ada, tambah quantity dan totalnya
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += item.price;
                        return item;
                    }
                });
            }
        },

        remove(id) {
            // ambil item yang mau di remove berdasarkan id
            const cartItem = this.items.find((item) => item.id === id);

            // jika item lebih dari 1
            if (cartItem.quantity > 1) {
                // telusuri 1 1
                this.items = this.items.map((item) => {
                    // jika bukan barang yang di klik
                    if (item.id !== id) {
                        return item;
                    } else {
                        item.quantity--;
                        item.total = item.price * item.quantity;
                        this.quantity--;
                        this.total -= item.price;
                        return item;
                    }
                })
            } else if (cartItem.quantity === 1) {
                // jika barangnya sisa 1
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= cartItem.price;
            }
        }
    });
});

const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function () {
    let enableButton = true;

    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i].type !== 'submit' && form.elements[i].value.length === 0) {
            enableButton = false;
            break;
        }
    }

    checkoutButton.disabled = !enableButton;

    if (enableButton) {
        checkoutButton.classList.remove('disabled');
    } else {
        checkoutButton.classList.add('disabled');
    }
});

checkoutButton.addEventListener('click', function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    const message = formatMessage(objData);
    window.open('https://wa.me/+6285156406238?text=' + encodeURIComponent(message));
    console.log(message);
});

const formatMessage = (obj) => {
    return `Data Customer
    Nama: ${obj.name}
    Email: ${obj.email}
    No HP: ${obj.phone}
Data Pesanan
    ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}
    TOTAL: ${rupiah(obj.total)}
    TERIMA KASIH.`;
};

const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
}