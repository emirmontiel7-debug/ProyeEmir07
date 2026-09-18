from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime
import random
from database import get_db_connection, init_db

app = Flask(__name__)
CORS(app)

# Inicializar DB en arranque
init_db()

@app.route('/')
def index():
    return render_template('index.html')

# ==========================================
# RUTAS DE PRODUCTOS
# ==========================================

@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if category and category != 'all':
        cursor.execute("SELECT * FROM products WHERE category = ? AND is_active = 1", (category,))
    else:
        cursor.execute("SELECT * FROM products WHERE is_active = 1 ORDER BY category, name")
        
    products = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify({'success': True, 'products': products})

@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.json
    name = data.get('name')
    category = data.get('category') # 'marrano', 'pollo', 'bebida'
    meat_type = data.get('meat_type', 'ninguna')
    description = data.get('description', '')
    price = float(data.get('price', 75.0))
    stock = int(data.get('stock', 50))
    image_icon = data.get('image_icon', '🌮')

    if not name or not category or price is None:
        return jsonify({'success': False, 'message': 'Nombre, categoría y precio son obligatorios.'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO products (name, category, meat_type, description, price, stock, image_icon)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (name, category, meat_type, description, price, stock, image_icon))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()

    return jsonify({'success': True, 'message': 'Producto agregado exitosamente', 'id': new_id})

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    prod = cursor.fetchone()
    if not prod:
        conn.close()
        return jsonify({'success': False, 'message': 'Producto no encontrado'}), 404

    name = data.get('name', prod['name'])
    category = data.get('category', prod['category'])
    meat_type = data.get('meat_type', prod['meat_type'])
    description = data.get('description', prod['description'])
    price = float(data.get('price', prod['price']))
    stock = int(data.get('stock', prod['stock']))
    image_icon = data.get('image_icon', prod['image_icon'])
    is_active = int(data.get('is_active', prod['is_active']))

    cursor.execute('''
        UPDATE products
        SET name = ?, category = ?, meat_type = ?, description = ?, price = ?, stock = ?, image_icon = ?, is_active = ?
        WHERE id = ?
    ''', (name, category, meat_type, description, price, stock, image_icon, is_active, product_id))
    
    conn.commit()
    conn.close()
    return jsonify({'success': True, 'message': 'Producto actualizado correctamente'})

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    # Marcamos como desactivado para no romper historial de pedidos
    cursor.execute("UPDATE products SET is_active = 0 WHERE id = ?", (product_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True, 'message': 'Producto eliminado correctamente'})


# ==========================================
# RUTAS DE EMPLEADOS
# ==========================================

@app.route('/api/employees', methods=['GET'])
def get_employees():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM employees ORDER BY created_at DESC")
    employees = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify({'success': True, 'employees': employees})

@app.route('/api/employees', methods=['POST'])
def add_employee():
    data = request.json
    name = data.get('name')
    role = data.get('role')
    phone = data.get('phone', '')

    if not name or not role:
        return jsonify({'success': False, 'message': 'El nombre y rol son obligatorios'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO employees (name, role, phone) VALUES (?, ?, ?)", (name, role, phone))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return jsonify({'success': True, 'message': 'Empleado registrado correctamente', 'id': new_id})

@app.route('/api/employees/<int:emp_id>', methods=['PUT'])
def update_employee(emp_id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM employees WHERE id = ?", (emp_id,))
    emp = cursor.fetchone()
    if not emp:
        conn.close()
        return jsonify({'success': False, 'message': 'Empleado no encontrado'}), 404

    name = data.get('name', emp['name'])
    role = data.get('role', emp['role'])
    phone = data.get('phone', emp['phone'])
    status = data.get('status', emp['status'])

    cursor.execute("UPDATE employees SET name = ?, role = ?, phone = ?, status = ? WHERE id = ?",
                   (name, role, phone, status, emp_id))
    conn.commit()
    conn.close()
    return jsonify({'success': True, 'message': 'Empleado actualizado exitosamente'})

@app.route('/api/employees/<int:emp_id>', methods=['DELETE'])
def delete_employee(emp_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM employees WHERE id = ?", (emp_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True, 'message': 'Empleado eliminado correctamente'})


# ==========================================
# RUTAS DE PEDIDOS (CLIENTE Y ADMIN)
# ==========================================

@app.route('/api/orders', methods=['GET'])
def get_orders():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM orders ORDER BY id DESC LIMIT 50")
    orders = [dict(row) for row in cursor.fetchall()]

    for order in orders:
        cursor.execute("SELECT * FROM order_items WHERE order_id = ?", (order['id'],))
        order['items'] = [dict(item) for item in cursor.fetchall()]

    conn.close()
    return jsonify({'success': True, 'orders': orders})

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    customer_name = data.get('customer_name', 'Cliente')
    order_type = data.get('order_type', 'Para Llevar')
    payment_method = data.get('payment_method', 'Efectivo')
    items = data.get('items', [])

    if not items:
        return jsonify({'success': False, 'message': 'El carrito está vacío'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    total_amount = 0.0
    items_to_insert = []

    # Validar stock y precios
    for item in items:
        product_id = item.get('product_id')
        qty = int(item.get('quantity', 1))
        customization = item.get('customization', '')

        cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
        prod = cursor.fetchone()
        if not prod:
            conn.close()
            return jsonify({'success': False, 'message': f'Producto ID {product_id} no encontrado'}), 404

        if prod['stock'] < qty:
            conn.close()
            return jsonify({'success': False, 'message': f'Stock insuficiente para {prod["name"]}. Disponible: {prod["stock"]}'}), 400

        subtotal = prod['price'] * qty
        total_amount += subtotal

        items_to_insert.append({
            'product_id': product_id,
            'product_name': prod['name'],
            'price': prod['price'],
            'quantity': qty,
            'customization': customization,
            'subtotal': subtotal
        })

    # Generar folio único (ej. TAC-8492)
    timestamp = datetime.datetime.now().strftime("%H%M")
    rand_num = random.randint(10, 99)
    order_number = f"TAC-{timestamp}{rand_num}"

    cursor.execute('''
        INSERT INTO orders (order_number, customer_name, order_type, payment_method, total_amount, status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (order_number, customer_name, order_type, payment_method, total_amount, 'Pendiente'))
    order_id = cursor.lastrowid

    # Insertar detalles y descontar stock
    for item in items_to_insert:
        cursor.execute('''
            INSERT INTO order_items (order_id, product_id, product_name, price, quantity, customization, subtotal)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (order_id, item['product_id'], item['product_name'], item['price'], item['quantity'], item['customization'], item['subtotal']))

        cursor.execute("UPDATE products SET stock = stock - ? WHERE id = ?", (item['quantity'], item['product_id']))

    conn.commit()
    
    # Traer el objeto pedido completo creado
    cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
    created_order = dict(cursor.fetchone())
    cursor.execute("SELECT * FROM order_items WHERE order_id = ?", (order_id,))
    created_order['items'] = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return jsonify({
        'success': True,
        'message': '¡Pedido registrado con éxito!',
        'order': created_order
    })

@app.route('/api/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    data = request.json
    new_status = data.get('status')
    valid_statuses = ['Pendiente', 'En Preparación', 'Listo', 'Entregado']

    if new_status not in valid_statuses:
        return jsonify({'success': False, 'message': 'Estado inválido'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE orders SET status = ? WHERE id = ?", (new_status, order_id))
    conn.commit()
    conn.close()

    return jsonify({'success': True, 'message': f'Estado de orden actualizado a: {new_status}'})


# ==========================================
# RUTAS DE ESTADÍSTICAS
# ==========================================

@app.route('/api/stats', methods=['GET'])
def get_stats():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Venta total
    cursor.execute("SELECT SUM(total_amount) FROM orders WHERE status != 'Cancelado'")
    total_sales = cursor.fetchone()[0] or 0.0

    # Total pedidos
    cursor.execute("SELECT COUNT(*) FROM orders")
    total_orders = cursor.fetchone()[0] or 0

    # Pedidos pendientes
    cursor.execute("SELECT COUNT(*) FROM orders WHERE status IN ('Pendiente', 'En Preparación')")
    pending_orders = cursor.fetchone()[0] or 0

    # Alertas de stock bajo (menos de 10 unidades)
    cursor.execute("SELECT * FROM products WHERE stock <= 10 AND is_active = 1")
    low_stock = [dict(row) for row in cursor.fetchall()]

    conn.close()
    return jsonify({
        'success': True,
        'stats': {
            'total_sales': round(total_sales, 2),
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'low_stock_count': len(low_stock),
            'low_stock_products': low_stock
        }
    })

if __name__ == '__main__':
    print("Iniciando servidor de Taquería El Pastorcito en http://127.0.0.1:5000 ...")
    app.run(host='0.0.0.0', port=5000, debug=True)
