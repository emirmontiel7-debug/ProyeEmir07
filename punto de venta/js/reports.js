// ============================================
// REPORTES Y DASHBOARD
// ============================================

function renderDashboard() {
    const todayTotal = salesManager.getTodayTotal();
    const todayTransactions = salesManager.getTodayTransactions();
    const avgTicket = salesManager.getAverageTicket();
    const itemsSold = salesManager.getTodayItemsSold();
    const paymentMethods = salesManager.getSalesByPaymentMethod();
    const topProducts = salesManager.getTopProducts(8);

    // Stats cards
    document.getElementById('statTodayTotal').textContent = `$${todayTotal.toFixed(2)}`;
    document.getElementById('statTransactions').textContent = todayTransactions;
    document.getElementById('statAvgTicket').textContent = `$${avgTicket.toFixed(2)}`;
    document.getElementById('statItemsSold').textContent = itemsSold;

    // Top Products Chart
    renderTopProductsChart(topProducts);

    // Payment Methods Chart
    renderPaymentMethodsChart(paymentMethods);
}

function renderTopProductsChart(topProducts) {
    const container = document.getElementById('topProductsChart');
    if (!container) return;

    if (topProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding: 20px;">
                <div class="empty-icon" style="font-size: 2rem;">📊</div>
                <p>Sin datos de ventas aún</p>
            </div>
        `;
        return;
    }

    const maxQty = Math.max(...topProducts.map(p => p.quantity));

    container.innerHTML = topProducts.map(product => `
        <div class="chart-bar-row">
            <span class="chart-bar-label" title="${product.name}">${product.name}</span>
            <div class="chart-bar-track">
                <div class="chart-bar-fill" style="width: ${(product.quantity / maxQty * 100)}%">
                    <span class="chart-bar-value">${product.quantity} uds</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderPaymentMethodsChart(methods) {
    const container = document.getElementById('paymentMethodsChart');
    if (!container) return;

    const total = methods.cash + methods.card + methods.transfer;

    if (total === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding: 20px;">
                <div class="empty-icon" style="font-size: 2rem;">💳</div>
                <p>Sin datos de ventas aún</p>
            </div>
        `;
        return;
    }

    const methodData = [
        { name: 'Efectivo', value: methods.cash, color: '#10b981', icon: '💵' },
        { name: 'Tarjeta', value: methods.card, color: '#3b82f6', icon: '💳' },
        { name: 'Transferencia', value: methods.transfer, color: '#a855f7', icon: '📱' }
    ];

    container.innerHTML = methodData.map(m => `
        <div class="chart-bar-row">
            <span class="chart-bar-label">${m.icon} ${m.name}</span>
            <div class="chart-bar-track">
                <div class="chart-bar-fill" style="width: ${total > 0 ? (m.value / total * 100) : 0}%; background: ${m.color};">
                    <span class="chart-bar-value" style="color: #fff;">$${m.value.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ─── Corte de Caja ───
function renderCashCut() {
    const todaySales = salesManager.getTodaySales();
    const todayTotal = salesManager.getTodayTotal();
    const transactions = todaySales.length;
    const methods = salesManager.getSalesByPaymentMethod();
    const avgTicket = salesManager.getAverageTicket();
    const itemsSold = salesManager.getTodayItemsSold();

    document.getElementById('cutTotalSales').textContent = `$${todayTotal.toFixed(2)}`;
    document.getElementById('cutTransactions').textContent = transactions;
    document.getElementById('cutCash').textContent = `$${methods.cash.toFixed(2)}`;
    document.getElementById('cutCard').textContent = `$${methods.card.toFixed(2)}`;
    document.getElementById('cutTransfer').textContent = `$${methods.transfer.toFixed(2)}`;
    document.getElementById('cutAvgTicket').textContent = `$${avgTicket.toFixed(2)}`;
    document.getElementById('cutItemsSold').textContent = itemsSold;

    // Render recent sales for cut
    const cutSalesBody = document.getElementById('cutSalesBody');
    if (cutSalesBody) {
        if (todaySales.length === 0) {
            cutSalesBody.innerHTML = `
                <tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-muted);">Sin ventas hoy</td></tr>
            `;
        } else {
            cutSalesBody.innerHTML = todaySales.map(sale => {
                const time = new Date(sale.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
                const methodLabels = { cash: 'Efectivo', card: 'Tarjeta', transfer: 'Transfer.' };
                return `
                    <tr>
                        <td style="font-family:monospace; font-size:0.72rem;">${sale.id}</td>
                        <td>${time}</td>
                        <td>${methodLabels[sale.paymentMethod] || 'Efectivo'}</td>
                        <td class="sale-amount">$${sale.total.toFixed(2)}</td>
                    </tr>
                `;
            }).join('');
        }
    }
}

// ─── Generar ticket para impresión ───
function generateTicketHTML(sale) {
    const date = new Date(sale.date);
    const dateStr = date.toLocaleDateString('es-MX', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });
    const timeStr = date.toLocaleTimeString('es-MX', { 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
    
    const methodLabels = { cash: 'Efectivo', card: 'Tarjeta', transfer: 'Transferencia' };

    return `
        <div class="ticket" id="printableTicket">
            <div class="ticket-header">
                <h4>🔧 FERRETERÍA PRO</h4>
                <div>Punto de Venta</div>
                <div style="margin-top: 8px; font-size: 0.65rem;">
                    ${dateStr}<br>
                    ${timeStr}
                </div>
                <div style="margin-top: 4px; font-size: 0.65rem;">
                    Ticket: ${sale.id}
                </div>
            </div>
            
            <div class="ticket-items">
                ${sale.items.map(item => `
                    <div class="ticket-item">
                        <span class="ticket-item-name">${item.quantity}x ${item.name}</span>
                        <span>$${item.subtotal.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>

            <div class="ticket-totals">
                <div class="ticket-total-row">
                    <span>Subtotal:</span>
                    <span>$${sale.subtotal.toFixed(2)}</span>
                </div>
                ${sale.discountAmount > 0 ? `
                    <div class="ticket-total-row" style="color: #10b981;">
                        <span>Descuento:</span>
                        <span>-$${sale.discountAmount.toFixed(2)}</span>
                    </div>
                ` : ''}
                <div class="ticket-total-row grand-total">
                    <span>TOTAL:</span>
                    <span>$${sale.total.toFixed(2)}</span>
                </div>
                <div class="ticket-total-row" style="margin-top: 8px;">
                    <span>Método de Pago:</span>
                    <span>${methodLabels[sale.paymentMethod] || 'Efectivo'}</span>
                </div>
                ${sale.paymentMethod === 'cash' ? `
                    <div class="ticket-total-row">
                        <span>Recibido:</span>
                        <span>$${sale.amountReceived.toFixed(2)}</span>
                    </div>
                    <div class="ticket-total-row">
                        <span>Cambio:</span>
                        <span>$${sale.change.toFixed(2)}</span>
                    </div>
                ` : ''}
            </div>

            <div class="ticket-footer">
                ¡Gracias por su compra!<br>
                Ferretería Pro - Su ferretería de confianza
            </div>
        </div>

        <div class="ticket-actions">
            <button class="btn-print" onclick="printTicket()">🖨️ Imprimir</button>
            <button class="btn-new-sale" onclick="closeModal()">✓ Listo</button>
        </div>
    `;
}

// Ver ticket de una venta pasada
function viewSaleTicket(saleId) {
    const sales = salesManager.getAll();
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;

    openModal('🧾 Ticket de Venta', generateTicketHTML(sale));
}

// Imprimir ticket
function printTicket() {
    window.print();
}
