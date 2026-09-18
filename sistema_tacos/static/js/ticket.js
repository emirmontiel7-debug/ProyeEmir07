/* ==========================================================================
   GENERADOR DE TICKET DE COMPRA E IMPRESIÓN
   ========================================================================== */

function renderAndShowTicket(order) {
    if (!order) return;

    document.getElementById('ticketFolio').textContent = order.order_number || 'TAC-0000';
    document.getElementById('ticketDate').textContent = order.created_at || new Date().toLocaleString();
    document.getElementById('ticketCustomer').textContent = order.customer_name || 'Cliente';
    document.getElementById('ticketType').textContent = order.order_type || 'Para Llevar';
    document.getElementById('ticketPayment').textContent = order.payment_method || 'Efectivo';

    const tbody = document.getElementById('ticketItemsBody');
    tbody.innerHTML = '';

    let subtotal = 0.0;

    order.items.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div><strong>${item.quantity}x ${item.product_name}</strong></div>
                ${item.customization ? `<div class="item-custom-text">${item.customization}</div>` : ''}
            </td>
            <td class="text-right">$${itemSubtotal.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });

    const tax = subtotal * 0.16; // 16% IVA desglose informativo

    document.getElementById('ticketSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('ticketTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('ticketTotal').textContent = `$${subtotal.toFixed(2)} MXN`;

    const cashRow = document.getElementById('ticketCashRow');
    const changeRow = document.getElementById('ticketChangeRow');

    if (order.payment_method === 'Efectivo' && order.cash_given > 0) {
        cashRow.style.display = 'flex';
        changeRow.style.display = 'flex';
        document.getElementById('ticketCashRec').textContent = `$${order.cash_given.toFixed(2)}`;
        document.getElementById('ticketChange').textContent = `$${(order.cash_change || 0).toFixed(2)}`;
    } else {
        cashRow.style.display = 'none';
        changeRow.style.display = 'none';
    }

    openModal('ticketModal');
}

function printReceipt() {
    window.print();
}
