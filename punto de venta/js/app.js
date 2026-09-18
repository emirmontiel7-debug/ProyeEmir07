// ============================================
// APP.JS - Lógica principal del Punto de Venta
// ============================================

// ─── Estado de la aplicación ───
let currentView = 'ventas';
let currentCategory = 'all';
let searchQuery = '';

// ─── Inicialización ───
document.addEventListener('DOMContentLoaded', () => {
    initializeStock();
    initClock();
    renderProducts();
    renderCart();
    setupEventListeners();
    updateNavBadges();
});

// ─── Reloj ───
function initClock() {
    function updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('es-MX', { 
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
        });
        const dateStr = now.toLocaleDateString('es-MX', { 
            weekday: 'long', day: 'numeric', month: 'long' 
        });
        
        const clockEl = document.getElementById('clock');
        const dateEl = document.getElementById('dateDisplay');
        
        if (clockEl) clockEl.textContent = timeStr;
        if (dateEl) dateEl.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// ─── Event Listeners ───
function setupEventListeners() {
    // Búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchQuery = e.target.value;
                renderProducts();
            }, 200);
        });
    }

    // Descuento
    const discountInput = document.getElementById('discountInput');
    const discountType = document.getElementById('discountType');
    
    if (discountInput) {
        discountInput.addEventListener('input', (e) => {
            cart.setDiscount(e.target.value, discountType?.value);
        });
    }
    
    if (discountType) {
        discountType.addEventListener('change', (e) => {
            cart.setDiscount(discountInput?.value, e.target.value);
        });
    }

    // Atajos de teclado
    document.addEventListener('keydown', (e) => {
        // F1 - Ventas
        if (e.key === 'F1') {
            e.preventDefault();
            switchView('ventas');
        }
        // F2 - Dashboard
        if (e.key === 'F2') {
            e.preventDefault();
            switchView('dashboard');
        }
        // F3 - Historial
        if (e.key === 'F3') {
            e.preventDefault();
            switchView('historial');
        }
        // F4 - Corte de caja
        if (e.key === 'F4') {
            e.preventDefault();
            switchView('corte');
        }
        // F5 - Buscar (prevenir refresh)
        if (e.key === 'F5') {
            e.preventDefault();
            document.getElementById('searchInput')?.focus();
        }
        // Escape - Cerrar modal
        if (e.key === 'Escape') {
            closeModal();
        }
        // F12 - Cobrar
        if (e.key === 'F12') {
            e.preventDefault();
            if (!cart.isEmpty()) {
                processCheckout();
            }
        }
    });
}

// ─── Navegación entre vistas ───
function switchView(viewName) {
    currentView = viewName;

    // Actualizar nav items
    document.querySelectorAll('.nav-item[data-view]').forEach(item => {
        item.classList.toggle('active', item.dataset.view === viewName);
    });

    // Mostrar/ocultar secciones principales
    const salesView = document.getElementById('salesView');
    const dashboardView = document.getElementById('dashboardView');
    const historyView = document.getElementById('historyView');
    const cashCutView = document.getElementById('cashCutView');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const categoriesBar = document.querySelector('.categories-bar');

    // Ocultar todo
    if (salesView) salesView.style.display = 'none';
    if (dashboardView) dashboardView.classList.remove('active');
    if (historyView) historyView.classList.remove('active');
    if (cashCutView) cashCutView.classList.remove('active');

    // Mostrar vista seleccionada
    switch (viewName) {
        case 'ventas':
            if (salesView) salesView.style.display = 'flex';
            if (cartSidebar) cartSidebar.style.display = 'flex';
            if (categoriesBar) categoriesBar.style.display = 'flex';
            break;
        case 'dashboard':
            if (dashboardView) dashboardView.classList.add('active');
            if (cartSidebar) cartSidebar.style.display = 'none';
            if (categoriesBar) categoriesBar.style.display = 'none';
            renderDashboard();
            break;
        case 'historial':
            if (historyView) historyView.classList.add('active');
            if (cartSidebar) cartSidebar.style.display = 'none';
            if (categoriesBar) categoriesBar.style.display = 'none';
            renderSalesHistory();
            break;
        case 'corte':
            if (cashCutView) cashCutView.classList.add('active');
            if (cartSidebar) cartSidebar.style.display = 'none';
            if (categoriesBar) categoriesBar.style.display = 'none';
            renderCashCut();
            break;
    }
}

// ─── Categorías ───
function filterByCategory(categoryId) {
    currentCategory = categoryId;
    
    // Actualizar pills activos
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.category === categoryId);
    });

    renderProducts();
}

// ─── Renderizar productos ───
function renderProducts() {
    const container = document.getElementById('productsGrid');
    const headerText = document.getElementById('productsHeaderText');
    const productCount = document.getElementById('productCount');
    if (!container) return;

    let products = PRODUCTS;

    // Filtrar por categoría
    if (currentCategory !== 'all') {
        products = products.filter(p => p.category === currentCategory);
    }

    // Filtrar por búsqueda
    if (searchQuery) {
        products = searchProducts(searchQuery);
        if (currentCategory !== 'all') {
            products = products.filter(p => p.category === currentCategory);
        }
    }

    // Actualizar header
    if (currentCategory === 'all') {
        if (headerText) headerText.textContent = 'Todos los Productos';
    } else {
        const cat = CATEGORIES.find(c => c.id === currentCategory);
        if (headerText && cat) headerText.textContent = `${cat.icon} ${cat.name}`;
    }
    if (productCount) productCount.textContent = `${products.length} productos`;

    // Renderizar
    if (products.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-icon">🔍</div>
                <h3>No se encontraron productos</h3>
                <p>Intenta con otra búsqueda o categoría</p>
            </div>
        `;
        return;
    }

    const categoryIcons = {};
    CATEGORIES.forEach(c => { categoryIcons[c.id] = c.icon; });

    container.innerHTML = products.map(product => {
        const stock = getCurrentStock(product.id);
        const stockClass = stock <= 5 ? 'low-stock' : '';
        const icon = categoryIcons[product.category] || '📦';

        return `
            <div class="product-card" onclick="addToCart('${product.id}')" title="${product.name}">
                <button class="add-btn" onclick="event.stopPropagation(); addToCart('${product.id}')">+</button>
                <div class="product-icon">${icon}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-id">${product.id} · ${product.unit}</div>
                <div class="product-bottom">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <span class="product-stock ${stockClass}">Stock: ${stock}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ─── Agregar al carrito ───
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;

    if (cart.addItem(product)) {
        showToast(`${product.name} agregado`, 'success');
        
        // Animación visual en la card
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            if (card.querySelector('.product-id')?.textContent.includes(productId)) {
                card.style.borderColor = 'var(--accent-primary)';
                card.style.boxShadow = 'var(--accent-glow)';
                setTimeout(() => {
                    card.style.borderColor = '';
                    card.style.boxShadow = '';
                }, 300);
            }
        });
    }
}

// ─── Métodos de pago ───
function selectPaymentMethod(method) {
    cart.setPaymentMethod(method);
    
    document.querySelectorAll('.payment-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.method === method);
    });
}

// ─── Proceso de cobro ───
function processCheckout() {
    if (cart.isEmpty()) return;

    const total = cart.getTotal();

    if (cart.paymentMethod === 'cash') {
        // Mostrar calculadora de cambio
        showChangeCalculator(total);
    } else {
        // Para tarjeta/transferencia, completar directamente
        completeSale(total, total, 0);
    }
}

function showChangeCalculator(total) {
    const quickAmounts = [20, 50, 100, 200, 500, 1000].filter(a => a >= total);
    // Ensure we always have some quick amounts
    if (quickAmounts.length === 0) {
        quickAmounts.push(Math.ceil(total / 100) * 100);
        quickAmounts.push(Math.ceil(total / 500) * 500);
        quickAmounts.push(Math.ceil(total / 1000) * 1000);
    }

    const content = `
        <div class="change-calculator">
            <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 4px;">Total a cobrar</div>
            <div class="change-total">$${total.toFixed(2)}</div>
            
            <div class="change-input-group">
                <label>Monto recibido del cliente:</label>
                <input type="number" id="amountReceived" placeholder="0.00" 
                       step="0.01" min="0" oninput="calculateChange(${total})" autofocus>
            </div>

            <div class="quick-amounts">
                ${quickAmounts.map(amount => `
                    <button class="quick-amount-btn" onclick="setQuickAmount(${amount}, ${total})">
                        $${amount.toFixed(2)}
                    </button>
                `).join('')}
            </div>

            <div class="change-result" id="changeResult" style="display:none;">
                <div class="label">Cambio a devolver:</div>
                <div class="value" id="changeValue">$0.00</div>
            </div>

            <div class="change-actions">
                <button class="btn-cancel-sale" onclick="closeModal()">Cancelar</button>
                <button class="btn-confirm-sale" id="confirmSaleBtn" onclick="confirmCashSale(${total})" disabled>
                    ✓ Confirmar Venta
                </button>
            </div>
        </div>
    `;

    openModal('💰 Cobro en Efectivo', content);
    
    // Focus en el input
    setTimeout(() => {
        document.getElementById('amountReceived')?.focus();
    }, 300);
}

function setQuickAmount(amount, total) {
    const input = document.getElementById('amountReceived');
    if (input) {
        input.value = amount.toFixed(2);
        calculateChange(total);
    }
}

function calculateChange(total) {
    const amountInput = document.getElementById('amountReceived');
    const changeResult = document.getElementById('changeResult');
    const changeValue = document.getElementById('changeValue');
    const confirmBtn = document.getElementById('confirmSaleBtn');

    const amount = parseFloat(amountInput?.value) || 0;
    const change = amount - total;

    if (changeResult) changeResult.style.display = 'block';

    if (amount >= total) {
        changeResult.classList.remove('negative');
        changeValue.textContent = `$${change.toFixed(2)}`;
        confirmBtn.disabled = false;
    } else if (amount > 0) {
        changeResult.classList.add('negative');
        changeValue.textContent = `Faltan $${Math.abs(change).toFixed(2)}`;
        confirmBtn.disabled = true;
    } else {
        changeResult.style.display = 'none';
        confirmBtn.disabled = true;
    }
}

function confirmCashSale(total) {
    const amount = parseFloat(document.getElementById('amountReceived')?.value) || 0;
    const change = amount - total;
    
    if (amount >= total) {
        completeSale(total, amount, change);
    }
}

function completeSale(total, amountReceived, change) {
    const saleData = {
        items: [...cart.items],
        subtotal: cart.getSubtotal(),
        discount: cart.discount,
        discountType: cart.discountType,
        discountAmount: cart.getDiscountAmount(),
        total: total,
        paymentMethod: cart.paymentMethod,
        amountReceived: amountReceived,
        change: change
    };

    const sale = salesManager.saveSale(saleData);

    // Mostrar ticket
    closeModal();
    setTimeout(() => {
        openModal('🧾 Venta Completada', generateTicketHTML(sale));
    }, 200);

    // Limpiar carrito
    cart.clear();
    document.getElementById('discountInput').value = '';

    // Actualizar productos (stock)
    renderProducts();
    updateNavBadges();

    showToast(`Venta ${sale.id} completada ✓`, 'success');
}

// ─── Limpiar carrito ───
function clearCart() {
    if (cart.isEmpty()) return;
    
    if (confirm('¿Limpiar el carrito?')) {
        cart.clear();
        document.getElementById('discountInput').value = '';
        showToast('Carrito limpiado', 'info');
    }
}

// ─── Modal ───
function openModal(title, content) {
    const overlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.innerHTML = content;
    if (overlay) overlay.classList.add('active');
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.remove('active');
}

// ─── Toasts / Notificaciones ───
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    toast.innerHTML = `
        <span>${icons[type] || 'ℹ️'}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ─── Actualizar badges del nav ───
function updateNavBadges() {
    const todaySales = salesManager.getTodayTransactions();
    const badge = document.getElementById('salesBadge');
    if (badge) {
        badge.textContent = todaySales;
        badge.style.display = todaySales > 0 ? 'inline' : 'none';
    }
}

// ─── Cerrar modal al hacer clic fuera ───
document.addEventListener('click', (e) => {
    const overlay = document.getElementById('modalOverlay');
    if (e.target === overlay) {
        closeModal();
    }
});
