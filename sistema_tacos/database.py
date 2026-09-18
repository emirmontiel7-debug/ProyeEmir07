import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'taqueria.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Tabla de Productos (Tacos de Marrano/Pollo y Bebidas)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL, -- 'marrano', 'pollo', 'bebida'
            meat_type TEXT NOT NULL, -- 'marrano', 'pollo', 'ninguna'
            description TEXT,
            price REAL NOT NULL,
            stock INTEGER NOT NULL DEFAULT 50,
            image_icon TEXT,
            is_active INTEGER DEFAULT 1
        )
    ''')

    # Tabla de Empleados
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT NOT NULL, -- 'Administrador', 'Cajero', 'Taquero', 'Repartidor'
            phone TEXT,
            status TEXT DEFAULT 'Activo',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Tabla de Pedidos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_number TEXT NOT NULL UNIQUE,
            customer_name TEXT DEFAULT 'Cliente',
            order_type TEXT DEFAULT 'Para Llevar', -- 'Comer Aquí', 'Para Llevar'
            payment_method TEXT NOT NULL, -- 'Efectivo', 'Tarjeta', 'Transferencia'
            total_amount REAL NOT NULL,
            status TEXT NOT NULL DEFAULT 'Pendiente', -- 'Pendiente', 'En Preparación', 'Listo', 'Entregado'
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Tabla de Detalles de Pedidos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            product_name TEXT NOT NULL,
            price REAL NOT NULL,
            quantity INTEGER NOT NULL,
            customization TEXT,
            subtotal REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    ''')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Base de datos inicializada correctamente.")
