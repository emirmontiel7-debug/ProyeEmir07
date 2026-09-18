/* ==========================================================================
   TAQUERÍA EL PASTORCITO - MAIN JAVASCRIPT ARCHITECTURE
   ========================================================================== */

// Estado global de la aplicación
const state = {
    currentMode: 'client',      // 'client' | 'admin'
    activeCategory: 'all',      // 'all' | 'marrano' | 'pollo' | 'bebida'
    activeAdminTab: 'orders',   // 'orders' | 'products' | 'employees' | 'stats'
    products: [],
    employees: [],
    orders: [],
    cart: [],
    selectedCustomProduct: null,
    selectedPaymentMethod: 'Efectivo',
    currentOrderForTicket: null
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    loadProducts();
    loadEmployees();
    loadOrders();
    loadStats();
    
    // Auto-actualizar comanda de pedidos cada 10 segundos
    setInterval(() => {
        if (state.currentMode === 'admin' && state.activeAdminTab === 'orders') {
            loadOrders(true);
        }
    }, 10000);
}

// Cambiar entre Modo Cliente y Modo Administrador
function switchMode(mode) {
    state.currentMode = mode;

    const clientView = document.getElementById('clientView');
    const adminView = document.getElementById('adminView');
    const btnClient = document.getElementById('btnClientMode');
    const btnAdmin = document.getElementById('btnAdminMode');

    if (mode === 'client') {
        clientView.classList.add('active');
        adminView.classList.remove('active');
        btnClient.classList.add('active');
        btnAdmin.classList.remove('active');
    } else {
        clientView.classList.remove('active');
        adminView.classList.add('active');
        btnClient.classList.remove('active');
        btnAdmin.classList.add('active');
        
        // Cargar datos frescos de administración
        loadOrders();
        loadProducts();
        loadEmployees();
        loadStats();
    }
}

// Cambiar pestañas del Administrador
function switchAdminTab(tabName, element) {
    state.activeAdminTab = tabName;

    // Actualizar botones de pestaña
    document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
    if (element) element.classList.add('active');

    // Actualizar contenidos
    document.querySelectorAll('.admin-tab-content').forEach(content => content.classList.remove('active'));
    
    if (tabName === 'orders') {
        document.getElementById('adminTabOrders').classList.add('active');
        loadOrders();
    } else if (tabName === 'products') {
        document.getElementById('adminTabProducts').classList.add('active');
        renderAdminProducts();
    } else if (tabName === 'employees') {
        document.getElementById('adminTabEmployees').classList.add('active');
        renderAdminEmployees();
    } else if (tabName === 'stats') {
        document.getElementById('adminTabStats').classList.add('active');
        loadStats();
    }
}

// Control de Modales
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Notificaciones Toast
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-xmark';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
