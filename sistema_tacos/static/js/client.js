/* ==========================================================================
   INTERFAZ DE CLIENTE - LÓGICA DE CATÁLOGO, CARRITO Y PERSONALIZACIÓN
   ========================================================================== */

// Cargar productos desde el backend Flask
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.success) {
            state.products = data.products;
            renderProductsGrid();
            if (state.activeAdminTab === 'products') {
                renderAdminProducts();
            }
        }
    } catch (err) {
        console.error("Error al cargar productos:", err);
        showToast("Error de conexión con el servidor", "error");
    }
}

// Renderizar tarjetas de productos en el kiosco cliente
function renderProductsGrid() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    const filtered = state.products.filter(p => {
        if (state.activeCategory === 'all') return true;
        return p.category === state.activeCategory;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 3rem;">No hay productos disponibles en esta categoría.</div>`;
        return;
    }

    filtered.forEach(prod => {
        let stockClass = 'stock-tag';
        let stockText = `Stock: ${prod.stock}`;
        if (prod.stock <= 0) {
            stockClass += ' out';
            stockText = 'AGOTADO';
        } else if (prod.stock <= 10) {
            stockClass += ' low';
            stockText = `¡Últimos ${prod.stock}!`;
        }

        const isTaco = prod.category === 'marrano' || prod.category === 'pollo';

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-header">
                <span class="product-icon">${prod.image_icon || '🌮'}</span>
                <span class="${stockClass}">${stockText}</span>
            </div>
            <div>
                <h3 class="product-name">${prod.name}</h3>
                <p class="product-desc">${prod.description || ''}</p>
            </div>
            <div class="product-footer">
                <span class="product-price">$${prod.price.toFixed(2)} MXN</span>
                <button class="btn btn-primary" onclick="initAddToCart(${prod.id})" ${prod.stock <= 0 ? 'disabled' : ''}>
                    <i class="fa-solid fa-plus"></i> ${isTaco ? 'Personalizar' : 'Agregar'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Filtrar por categoría
function filterCategory(category, chipElement) {
    state.activeCategory = category;
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chipElement.classList.add('active');
    renderProductsGrid();
}

// Iniciar proceso de agregar al carrito (Modal si es Taco)
function initAddToCart(productId) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;

    if (prod.category === 'marrano' || prod.category === 'pollo') {
        // Abrir modal de personalización
        state.selectedCustomProduct = prod;
        document.getElementById('custModalTitle').textContent = `Personalizar ${prod.name}`;
        document.getElementById('custProdDesc').textContent = prod.description;
        document.getElementById('custProdId').value = prod.id;
        openModal('customizeModal');
    } else {
        // Bebida o complemento estándar
        addToCartDirectly(prod, "Sin personalización");
    }
}

// Confirmar personalización de tacos
function confirmAddToCart() {
    if (!state.selectedCustomProduct) return;

    const tortilla = document.querySelector('input[name="custTortilla"]:checked')?.value || 'Tortilla de Maíz';
    const salsa = document.querySelector('input[name="custSalsa"]:checked')?.value || 'Salsa Verde';
    
    const extraTodo = document.getElementById('extraTodo').checked;
    const extraPina = document.getElementById('extraPina').checked;
    const extraLimon = document.getElementById('extraLimon').checked;

    let extrasList = [];
    if (extraTodo) extrasList.push("Con Todo (Cebolla y Cilantro)");
    else extrasList.push("Sin cebolla/cilantro");
    if (extraPina) extrasList.push("Con Piña");
    if (extraLimon) extrasList.push("Con Limones");

    const customization = `${tortilla}, ${salsa}, ${extrasList.join(', ')}`;
    addToCartDirectly(state.selectedCustomProduct, customization);
    closeModal('customizeModal');
}

function toggleConTodo(checkbox) {
    // Helper visual
}

// Agregar item al array de carrito
function addToCartDirectly(product, customization) {
    const existingIndex = state.cart.findIndex(item => item.product.id === product.id && item.customization === customization);

    if (existingIndex > -1) {
        if (state.cart[existingIndex].quantity + 1 > product.stock) {
            showToast(`¡No hay más stock disponible de ${product.name}!`, "error");
            return;
        }
        state.cart[existingIndex].quantity += 1;
    } else {
        state.cart.push({
            product: product,
            quantity: 1,
            customization: customization
        });
    }

    updateCartUI();
    showToast(`¡${product.name} agregado al carrito!`, "success");
}

// Actualizar Drawer del Carrito
function updateCartUI() {
    const container = document.getElementById('cartItemsContainer');
    const badge = document.getElementById('cartCountBadge');
    const totalDisplay = document.getElementById('cartTotalAmount');
    const btnCheckout = document.getElementById('btnProceedCheckout');

    container.innerHTML = '';
    let totalItems = 0;
    let grandTotal = 0.0;

    if (state.cart.length === 0) {
        container.innerHTML = `<div class="text-muted" style="text-align:center; margin-top:3rem;">El carrito está vacío 🌮</div>`;
        btnCheckout.disabled = true;
    } else {
        btnCheckout.disabled = false;
        state.cart.forEach((item, index) => {
            totalItems += item.quantity;
            const subtotal = item.product.price * item.quantity;
            grandTotal += subtotal;

            const card = document.createElement('div');
            card.className = 'cart-item-card';
            card.innerHTML = `
                <div class="cart-item-row">
                    <span class="cart-item-title">${item.product.image_icon || '🌮'} ${item.product.name}</span>
                    <strong style="color: var(--primary);">$${subtotal.toFixed(2)}</strong>
                </div>
                <div class="cart-item-custom">${item.customization}</div>
                <div class="cart-item-row" style="margin-top:0.4rem;">
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="changeCartQty(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="changeCartQty(${index}, 1)">+</button>
                    </div>
                    <button class="btn btn-secondary" style="padding: 2px 8px; font-size: 0.75rem;" onclick="removeCartItem(${index})">
                        <i class="fa-solid fa-trash text-accent"></i>
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    badge.textContent = totalItems;
    totalDisplay.textContent = `$${grandTotal.toFixed(2)} MXN`;
}

function changeCartQty(index, delta) {
    const item = state.cart[index];
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
        state.cart.splice(index, 1);
    } else {
        if (newQty > item.product.stock) {
            showToast(`Límite de stock alcanzado (${item.product.stock})`, "error");
            return;
        }
        item.quantity = newQty;
    }
    updateCartUI();
}

function removeCartItem(index) {
    state.cart.splice(index, 1);
    updateCartUI();
}

function toggleCartDrawer() {
    document.getElementById('cartDrawer').classList.toggle('active');
    document.getElementById('cartOverlay').classList.toggle('active');
}

// CHECKOUT Y PROCESAMIENTO DE PAGO
function openCheckoutModal() {
    if (state.cart.length === 0) return;

    let grandTotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    document.getElementById('chkTotalAmount').textContent = `$${grandTotal.toFixed(2)} MXN`;

    // Cerrar carrito drawer
    toggleCartDrawer();
    openModal('checkoutModal');
    calculateChange();
}

function selectPaymentMethod(method, btnElement) {
    state.selectedPaymentMethod = method;
    document.querySelectorAll('.pay-method-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');

    const cashBox = document.getElementById('cashCalculatorBox');
    if (method === 'Efectivo') {
        cashBox.style.display = 'block';
    } else {
        cashBox.style.display = 'none';
    }
}

function calculateChange() {
    let grandTotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const cashGivenInput = document.getElementById('cashGivenInput');
    const display = document.getElementById('cashChangeDisplay');

    const cashGiven = floatVal(cashGivenInput.value);
    if (cashGiven >= grandTotal) {
        const change = cashGiven - grandTotal;
        display.textContent = `$${change.toFixed(2)} MXN`;
        display.style.color = "var(--success)";
    } else {
        display.textContent = "Monto insuficiente";
        display.style.color = "var(--accent)";
    }
}

function floatVal(val) {
    const f = parseFloat(val);
    return isNaN(f) ? 0 : f;
}

// PROCESAR Y GUARDAR PEDIDO EN FLASK
async function processOrderPayment() {
    if (state.cart.length === 0) return;

    const customerName = document.getElementById('cartCustomerName').value || 'Cliente';
    const orderType = document.getElementById('cartOrderType').value || 'Para Llevar';
    const paymentMethod = state.selectedPaymentMethod;

    let grandTotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const cashGiven = floatVal(document.getElementById('cashGivenInput').value);

    if (paymentMethod === 'Efectivo' && cashGiven < grandTotal) {
        showToast("El monto ingresado es menor al total a pagar", "error");
        return;
    }

    const payload = {
        customer_name: customerName,
        order_type: orderType,
        payment_method: paymentMethod,
        items: state.cart.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
            customization: item.customization
        }))
    };

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (data.success) {
            showToast("¡Pedido y Pago registrados correctamente!", "success");
            closeModal('checkoutModal');

            // Guardar orden para ticket y limpiar carrito
            state.currentOrderForTicket = data.order;
            state.currentOrderForTicket.cash_given = cashGiven;
            state.currentOrderForTicket.cash_change = (paymentMethod === 'Efectivo') ? (cashGiven - grandTotal) : 0;

            state.cart = [];
            updateCartUI();

            // Recargar productos para actualizar stock en pantalla
            loadProducts();

            // Abrir Ticket generado listo para imprimir
            renderAndShowTicket(state.currentOrderForTicket);
        } else {
            showToast(data.message || "Error al procesar el pedido", "error");
        }
    } catch (err) {
        console.error("Error enviando pedido:", err);
        showToast("Error de conexión al procesar el pedido", "error");
    }
}
