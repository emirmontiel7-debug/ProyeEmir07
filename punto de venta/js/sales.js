// ============================================
// VENTAS - Registro e historial de ventas
// ============================================

class SalesManager {
    constructor() {
        this.storageKey = 'ferreteria_sales';
    }

    // Obtener todas las ventas
    getAll() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    // Guardar una venta
    saveSale(saleData) {
        const sales = this.getAll();
        const sale = {
            id: this.generateId(),
            date: new Date().toISOString(),
            items: saleData.items.map(item => ({
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                subtotal: item.product.price * item.quantity
            })),
            subtotal: saleData.subtotal,
            discount: saleData.discount,
            discountType: saleData.discountType,
            discountAmount: saleData.discountAmount,
            total: saleData.total,
            paymentMethod: saleData.paymentMethod,
            amountReceived: saleData.amountReceived || saleData.total,
            change: saleData.change || 0,
            itemCount: saleData.items.reduce((sum, i) => sum + i.quantity, 0)
        };

        sales.unshift(sale);
        localStorage.setItem(this.storageKey, JSON.stringify(sales));

        // Actualizar stock
        sale.items.forEach(item => {
            updateStock(item.id, item.quantity);
        });

        return sale;
    }

    // Generar ID único para la venta
    generateId() {
        const now = new Date();
        const datePart = now.getFullYear().toString().slice(-2) +
            String(now.getMonth() + 1).padStart(2, '0') +
            String(now.getDate()).padStart(2, '0');
        const timePart = String(now.getHours()).padStart(2, '0') +
            String(now.getMinutes()).padStart(2, '0') +
            String(now.getSeconds()).padStart(2, '0');
        const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        return `V${datePart}-${timePart}-${random}`;
    }

    // Obtener ventas de hoy
    getTodaySales() {
        const today = new Date().toDateString();
        return this.getAll().filter(sale => new Date(sale.date).toDateString() === today);
    }

    // Obtener total de ventas de hoy
    getTodayTotal() {
        return this.getTodaySales().reduce((sum, sale) => sum + sale.total, 0);
    }

    // Obtener número de transacciones de hoy
    getTodayTransactions() {
        return this.getTodaySales().length;
    }

    // Obtener productos más vendidos de hoy
    getTopProducts(limit = 10) {
        const todaySales = this.getTodaySales();
        const productCount = {};
        
        todaySales.forEach(sale => {
            sale.items.forEach(item => {
                if (!productCount[item.name]) {
                    productCount[item.name] = { name: item.name, quantity: 0, revenue: 0 };
                }
                productCount[item.name].quantity += item.quantity;
                productCount[item.name].revenue += item.subtotal;
            });
        });

        return Object.values(productCount)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, limit);
    }

    // Obtener ventas por método de pago
    getSalesByPaymentMethod() {
        const todaySales = this.getTodaySales();
        const methods = { cash: 0, card: 0, transfer: 0 };
        
        todaySales.forEach(sale => {
            if (methods[sale.paymentMethod] !== undefined) {
                methods[sale.paymentMethod] += sale.total;
            }
        });

        return methods;
    }

    // Obtener promedio de venta
    getAverageTicket() {
        const todaySales = this.getTodaySales();
        if (todaySales.length === 0) return 0;
        return this.getTodayTotal() / todaySales.length;
    }

    // Obtener items vendidos hoy
    getTodayItemsSold() {
        return this.getTodaySales().reduce((sum, sale) => sum + sale.itemCount, 0);
    }

    // Limpiar historial
    clearHistory() {
        localStorage.removeItem(this.storageKey);
    }

    // Eliminar una venta específica
    deleteSale(saleId) {
        const sales = this.getAll().filter(s => s.id !== saleId);
        localStorage.setItem(this.storageKey, JSON.stringify(sales));
    }
}

// ─── Renderizar historial de ventas ───
function renderSalesHistory() {
    const container = document.getElementById('salesHistoryBody');
    if (!container) return;

    const sales = salesManager.getAll();

    if (sales.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    <div class="empty-state">
                        <div class="empty-icon">📋</div>
                        <h3>Sin ventas registradas</h3>
                        <p>Las ventas aparecerán aquí conforme se registren</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    container.innerHTML = sales.slice(0, 50).map(sale => {
        const date = new Date(sale.date);
        const dateStr = date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
        const timeStr = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        
        const methodLabels = {
            cash: { text: 'Efectivo', class: 'cash' },
            card: { text: 'Tarjeta', class: 'card' },
            transfer: { text: 'Transfer.', class: 'transfer' }
        };
        const method = methodLabels[sale.paymentMethod] || methodLabels.cash;

        return `
            <tr>
                <td style="font-family: monospace; font-size: 0.72rem;">${sale.id}</td>
                <td>${dateStr} ${timeStr}</td>
                <td>${sale.itemCount} artículos</td>
                <td><span class="sale-method ${method.class}">${method.text}</span></td>
                <td class="sale-amount">$${sale.total.toFixed(2)}</td>
                <td>
                    <button class="top-bar-btn" onclick="viewSaleTicket('${sale.id}')" title="Ver ticket" style="width:28px;height:28px;">
                        🧾
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Instancia global
const salesManager = new SalesManager();
