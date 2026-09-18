/* ==========================================================================
   INTERFAZ DE ADMINISTRACIÓN - PEDIDOS, INVENTARIO, PRECIOS Y PERSONAL
   ========================================================================== */

// 1. CARGAR Y RENDERIZAR COMANDAS DE PEDIDOS (KANBAN)
async function loadOrders(silent = false) {
    try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        if (data.success) {
            state.orders = data.orders;
            renderOrdersKanban();
            updatePendingBadge();
        }
    } catch (err) {
        if (!silent) console.error("Error al cargar pedidos:", err);
    }
}

function updatePendingBadge() {
    const pendingCount = state.orders.filter(o => o.status === 'Pendiente' || o.status === 'En Preparación').length;
    const badge = document.getElementById('pendingOrdersBadge');
    if (badge) badge.textContent = pendingCount;
}

function renderOrdersKanban() {
    const lists = {
        'Pendiente': document.getElementById('listPendiente'),
        'En Preparación': document.getElementById('listPreparacion'),
        'Listo': document.getElementById('listListo'),
        'Entregado': document.getElementById('listEntregado')
    };

    const counts = {
        'Pendiente': 0,
        'En Preparación': 0,
        'Listo': 0,
        'Entregado': 0
    };

    // Limpiar contenedores
    Object.values(lists).forEach(el => { if (el) el.innerHTML = ''; });

    state.orders.forEach(order => {
        if (counts[order.status] !== undefined) {
            counts[order.status]++;
        }

        const card = document.createElement('div');
        card.className = 'order-card';

        let itemsHtml = order.items.map(i => `
            <li>
                <strong>${i.quantity}x ${i.product_name}</strong>
                ${i.customization ? `<br><span style="font-size:0.75rem; color:#9CA3AF;">(${i.customization})</span>` : ''}
            </li>
        `).join('');

        let actionBtnsHtml = '';
        if (order.status === 'Pendiente') {
            actionBtnsHtml = `<button class="btn btn-primary btn-block" onclick="updateOrderStatus(${order.id}, 'En Preparación')">
                <i class="fa-solid fa-fire"></i> Preparar
            </button>`;
        } else if (order.status === 'En Preparación') {
            actionBtnsHtml = `<button class="btn btn-success btn-block" onclick="updateOrderStatus(${order.id}, 'Listo')">
                <i class="fa-solid fa-bell"></i> Marcar Listo
            </button>`;
        } else if (order.status === 'Listo') {
            actionBtnsHtml = `<button class="btn btn-secondary btn-block" onclick="updateOrderStatus(${order.id}, 'Entregado')">
                <i class="fa-solid fa-check-double"></i> Entregar
            </button>`;
        } else {
            actionBtnsHtml = `<span class="text-muted small-text"><i class="fa-solid fa-circle-check"></i> Completado</span>`;
        }

        card.innerHTML = `
            <div class="order-card-header">
                <span class="order-folio">${order.order_number}</span>
                <span class="order-time">${order.created_at ? order.created_at.split(' ')[1].substring(0,5) : ''}</span>
            </div>
            <div class="order-customer">
                👤 ${order.customer_name} <span class="text-muted">(${order.order_type})</span>
            </div>
            <ul class="order-items-mini">
                ${itemsHtml}
            </ul>
            <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-weight:700;">
                <span>Total:</span>
                <span style="color:var(--primary);">$${order.total_amount.toFixed(2)} (${order.payment_method})</span>
            </div>
            <div class="order-actions">
                ${actionBtnsHtml}
            </div>
        `;

        if (lists[order.status]) {
            lists[order.status].appendChild(card);
        }
    });

    // Actualizar contadores
    document.getElementById('countPendiente').textContent = counts['Pendiente'];
    document.getElementById('countPreparacion').textContent = counts['En Preparación'];
    document.getElementById('countListo').textContent = counts['Listo'];
    document.getElementById('countEntregado').textContent = counts['Entregado'];
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        const data = await response.json();
        if (data.success) {
            showToast(data.message, "success");
            loadOrders();
            loadStats();
        }
    } catch (err) {
        console.error("Error al actualizar orden:", err);
    }
}


// 2. GESTIÓN DE PRODUCTOS, PRECIOS Y STOCK (ADMIN)
function renderAdminProducts() {
    const tbody = document.getElementById('adminProductsTable');
    tbody.innerHTML = '';

    state.products.forEach(p => {
        const tr = document.createElement('tr');
        
        let stockBadge = `<span class="stock-tag">Normal</span>`;
        if (p.stock <= 0) stockBadge = `<span class="stock-tag out">Agotado</span>`;
        else if (p.stock <= 10) stockBadge = `<span class="stock-tag low">Stock Bajo</span>`;

        tr.innerHTML = `
            <td style="font-size: 1.5rem;">${p.image_icon || '🌮'}</td>
            <td><strong>${p.name}</strong></td>
            <td><span class="badge" style="text-transform: capitalize;">${p.category}</span></td>
            <td><span class="text-muted" style="text-transform: capitalize;">${p.meat_type}</span></td>
            <td>
                <input type="number" step="0.5" class="table-input" value="${p.price.toFixed(2)}" onchange="updateProductPrice(${p.id}, this.value)">
            </td>
            <td>
                <input type="number" class="table-input" value="${p.stock}" onchange="updateProductStock(${p.id}, this.value)">
            </td>
            <td>${stockBadge}</td>
            <td>
                <button class="btn btn-secondary" style="padding:4px 8px;" onclick="deleteProduct(${p.id})" title="Eliminar Producto">
                    <i class="fa-solid fa-trash text-accent"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function updateProductPrice(productId, newPrice) {
    const priceFloat = parseFloat(newPrice);
    if (isNaN(priceFloat) || priceFloat < 0) {
        showToast("Precio inválido", "error");
        return;
    }
    await sendProductUpdate(productId, { price: priceFloat });
}

async function updateProductStock(productId, newStock) {
    const stockInt = parseInt(newStock);
    if (isNaN(stockInt) || stockInt < 0) {
        showToast("Stock inválido", "error");
        return;
    }
    await sendProductUpdate(productId, { stock: stockInt });
}

async function sendProductUpdate(productId, updateData) {
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        const data = await response.json();
        if (data.success) {
            showToast("Producto actualizado", "success");
            loadProducts();
        }
    } catch (err) {
        console.error("Error actualizando producto:", err);
    }
}

function openAddProductModal() {
    openModal('addProductModal');
}

function toggleMeatSelect(selectEl) {
    const meatSelect = document.getElementById('newProdMeat');
    if (selectEl.value === 'bebida') {
        meatSelect.value = 'ninguna';
    } else {
        meatSelect.value = selectEl.value;
    }
}

async function saveNewProduct() {
    const name = document.getElementById('newProdName').value;
    const category = document.getElementById('newProdCategory').value;
    const meat_type = document.getElementById('newProdMeat').value;
    const price = parseFloat(document.getElementById('newProdPrice').value);
    const stock = parseInt(document.getElementById('newProdStock').value);
    const image_icon = document.getElementById('newProdIcon').value || '🌮';
    const description = document.getElementById('newProdDesc').value;

    if (!name || isNaN(price)) {
        showToast("Completa los campos obligatorios", "error");
        return;
    }

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, category, meat_type, price, stock, image_icon, description })
        });
        const data = await response.json();
        if (data.success) {
            showToast("Producto guardado exitosamente", "success");
            closeModal('addProductModal');
            loadProducts();
        }
    } catch (err) {
        console.error("Error guardando producto:", err);
    }
}

async function deleteProduct(productId) {
    if (!confirm("¿Estás seguro de eliminar este producto del menú?")) return;

    try {
        const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
            showToast("Producto eliminado", "success");
            loadProducts();
        }
    } catch (err) {
        console.error("Error eliminando producto:", err);
    }
}


// 3. GESTIÓN DE EMPLEADOS Y ROLES
async function loadEmployees() {
    try {
        const response = await fetch('/api/employees');
        const data = await response.json();
        if (data.success) {
            state.employees = data.employees;
            if (state.activeAdminTab === 'employees') {
                renderAdminEmployees();
            }
        }
    } catch (err) {
        console.error("Error cargando empleados:", err);
    }
}

function renderAdminEmployees() {
    const tbody = document.getElementById('adminEmployeesTable');
    tbody.innerHTML = '';

    state.employees.forEach(emp => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${emp.id}</td>
            <td><strong>${emp.name}</strong></td>
            <td>
                <select class="form-select" style="padding:4px; font-size:0.85rem;" onchange="updateEmployeeRole(${emp.id}, this.value)">
                    <option value="Administrador" ${emp.role === 'Administrador' ? 'selected' : ''}>👑 Administrador</option>
                    <option value="Cajero" ${emp.role === 'Cajero' ? 'selected' : ''}>💵 Cajero</option>
                    <option value="Taquero / Cocinero" ${emp.role.includes('Taquero') ? 'selected' : ''}>👨‍🍳 Taquero / Cocinero</option>
                    <option value="Repartidor" ${emp.role === 'Repartidor' ? 'selected' : ''}>🛵 Repartidor</option>
                </select>
            </td>
            <td>${emp.phone || 'N/A'}</td>
            <td><span class="text-success"><i class="fa-solid fa-circle small-icon"></i> ${emp.status}</span></td>
            <td class="text-muted small-text">${emp.created_at ? emp.created_at.split(' ')[0] : 'Hoy'}</td>
            <td>
                <button class="btn btn-secondary" style="padding:4px 8px;" onclick="deleteEmployee(${emp.id})" title="Dar de baja empleado">
                    <i class="fa-solid fa-user-minus text-accent"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function updateEmployeeRole(empId, newRole) {
    try {
        const response = await fetch(`/api/employees/${empId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole })
        });
        const data = await response.json();
        if (data.success) {
            showToast("Rol de empleado actualizado", "success");
            loadEmployees();
        }
    } catch (err) {
        console.error("Error al actualizar rol:", err);
    }
}

function openAddEmployeeModal() {
    openModal('addEmployeeModal');
}

async function saveNewEmployee() {
    const name = document.getElementById('newEmpName').value;
    const role = document.getElementById('newEmpRole').value;
    const phone = document.getElementById('newEmpPhone').value;

    if (!name) {
        showToast("Ingresa el nombre del empleado", "error");
        return;
    }

    try {
        const response = await fetch('/api/employees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, role, phone })
        });
        const data = await response.json();
        if (data.success) {
            showToast("Empleado registrado correctamente", "success");
            closeModal('addEmployeeModal');
            loadEmployees();
        }
    } catch (err) {
        console.error("Error registrando empleado:", err);
    }
}

async function deleteEmployee(empId) {
    if (!confirm("¿Deseas dar de baja a este empleado del sistema?")) return;

    try {
        const response = await fetch(`/api/employees/${empId}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
            showToast("Empleado dado de baja", "success");
            loadEmployees();
        }
    } catch (err) {
        console.error("Error eliminando empleado:", err);
    }
}


// 4. REPORTES Y ESTADÍSTICAS
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        if (data.success) {
            const stats = data.stats;
            document.getElementById('statTotalSales').textContent = `$${stats.total_sales.toFixed(2)} MXN`;
            document.getElementById('statTotalOrders').textContent = stats.total_orders;
            document.getElementById('statPendingOrders').textContent = stats.pending_orders;
            document.getElementById('statLowStock').textContent = stats.low_stock_count;

            const container = document.getElementById('lowStockList');
            container.innerHTML = '';

            if (stats.low_stock_products.length === 0) {
                container.innerHTML = `<span class="text-muted">No hay productos en inventario crítico.</span>`;
            } else {
                stats.low_stock_products.forEach(p => {
                    const div = document.createElement('div');
                    div.className = 'low-stock-item';
                    div.innerHTML = `
                        <span>${p.image_icon} <strong>${p.name}</strong></span>
                        <strong style="color:var(--accent);">Stock: ${p.stock}</strong>
                    `;
                    container.appendChild(div);
                });
            }
        }
    } catch (err) {
        console.error("Error cargando estadísticas:", err);
    }
}
