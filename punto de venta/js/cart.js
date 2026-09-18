// ============================================
// CARRITO DE COMPRAS - Gestión completa
// ============================================

class Cart {
    constructor() {
        this.items = [];
        this.discount = 0;
        this.discountType = 'percent'; // 'percent' o 'fixed'
        this.paymentMethod = 'cash';
        this.onUpdate = null;
    }

    // Agregar producto al carrito
    addItem(product) {
        const existing = this.items.find(item => item.product.id === product.id);
        
        if (existing) {
            const currentStock = getCurrentStock(product.id);
            if (existing.quantity < currentStock) {
                existing.quantity++;
                this.notify();
                return true;
            } else {
                showToast('Sin stock suficiente', 'error');
                return false;
            }
        } else {
            const currentStock = getCurrentStock(product.id);
            if (currentStock > 0) {
                this.items.push({
                    product: product,
                    quantity: 1
                });
                this.notify();
                return true;
            } else {
                showToast('Producto sin stock', 'error');
                return false;
            }
        }
    }

    // Remover producto del carrito
    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
        this.notify();
    }

    // Actualizar cantidad
    updateQuantity(productId, change) {
        const item = this.items.find(i => i.product.id === productId);
        if (!item) return;

        const newQty = item.quantity + change;
        
        if (newQty <= 0) {
            this.removeItem(productId);
            return;
        }

        const currentStock = getCurrentStock(item.product.id);
        if (newQty > currentStock) {
            showToast('Stock máximo alcanzado', 'error');
            return;
        }

        item.quantity = newQty;
        this.notify();
    }

    // Limpiar carrito
    clear() {
        this.items = [];
        this.discount = 0;
        this.notify();
    }

    // Obtener subtotal
    getSubtotal() {
        return this.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    }

    // Obtener descuento calculado
    getDiscountAmount() {
        const subtotal = this.getSubtotal();
        if (this.discountType === 'percent') {
            return subtotal * (this.discount / 100);
        }
        return Math.min(this.discount, subtotal);
    }

    // Obtener total
    getTotal() {
        return this.getSubtotal() - this.getDiscountAmount();
    }

    // Obtener cantidad total de items
    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Establecer descuento
    setDiscount(value, type) {
        this.discount = parseFloat(value) || 0;
        if (type) this.discountType = type;
        this.notify();
    }

    // Establecer método de pago
    setPaymentMethod(method) {
        this.paymentMethod = method;
        this.notify();
    }

    // Notificar cambios
    notify() {
        if (this.onUpdate) {
            this.onUpdate();
        }
    }

    // Verificar si está vacío
    isEmpty() {
        return this.items.length === 0;
    }
}

// ─── Renderizar el carrito en el DOM ───
function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartDiscount = document.getElementById('cartDiscount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (!cartItemsContainer) return;

    // Actualizar contador
    const totalItems = cart.getTotalItems();
    cartCount.textContent = totalItems;

    // Actualizar botón checkout
    checkoutBtn.disabled = cart.isEmpty();

    if (cart.isEmpty()) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <div class="empty-icon">🛒</div>
                <p>El carrito está vacío</p>
                <p style="font-size: 0.72rem; margin-top: 8px; color: var(--text-muted);">
                    Selecciona productos para comenzar
                </p>
            </div>
        `;
        cartSubtotal.textContent = '$0.00';
        cartDiscount.textContent = '-$0.00';
        cartTotal.textContent = '$0.00';
        return;
    }

    // Renderizar items
    cartItemsContainer.innerHTML = cart.items.map(item => `
        <div class="cart-item" data-id="${item.product.id}">
            <div class="cart-item-info">
                <div class="cart-item-name" title="${item.product.name}">${item.product.name}</div>
                <div class="cart-item-price">$${item.product.price.toFixed(2)} × ${item.quantity}</div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn danger" onclick="cart.updateQuantity('${item.product.id}', -1)">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" onclick="cart.updateQuantity('${item.product.id}', 1)">+</button>
            </div>
            <div class="cart-item-total">
                <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
                <button class="cart-item-delete" onclick="cart.removeItem('${item.product.id}')">✕ Quitar</button>
            </div>
        </div>
    `).join('');

    // Actualizar totales
    cartSubtotal.textContent = `$${cart.getSubtotal().toFixed(2)}`;
    cartDiscount.textContent = `-$${cart.getDiscountAmount().toFixed(2)}`;
    cartTotal.textContent = `$${cart.getTotal().toFixed(2)}`;
}

// Instancia global del carrito
const cart = new Cart();
cart.onUpdate = renderCart;
