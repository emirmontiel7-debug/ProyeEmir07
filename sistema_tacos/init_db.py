from database import get_db_connection, init_db

def seed_database():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Verificar si ya existen productos
    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] == 0:
        products = [
            # TACOS DE MARRANO (Todas las órdenes a $75 por defecto)
            ("Orden Tacos al Pastor", "marrano", "marrano", "5 tacos con piña, cilantro y cebolla recién cortados", 75.0, 60, "🌮"),
            ("Orden Tacos de Carnitas", "marrano", "marrano", "5 tacos de maciza, cuerito y surtida estilo Michoacán", 75.0, 50, "🥩"),
            ("Orden Tacos de Suadero de Cerdo", "marrano", "marrano", "5 tacos de suadero tierno doradito a la plancha", 75.0, 45, "🌮"),
            ("Orden Tacos de Chicharrón Prensado", "marrano", "marrano", "5 tacos de chicharrón en salsa roja guajillo", 75.0, 40, "🌶️"),

            # TACOS DE POLLO (Todas las órdenes a $75 por defecto)
            ("Orden Tacos de Pollo Asado", "pollo", "pollo", "5 tacos de pechuga de pollo marinada al carbón", 75.0, 50, "🍗"),
            ("Orden Tacos de Tinga de Pollo", "pollo", "pollo", "5 tacos de pechuga deshebrada en caldillo de chipotle y cebolla", 75.0, 40, "🌮"),
            ("Orden Tacos de Pollo con Mole", "pollo", "pollo", "5 tacos de pollo bañados en rico mole poblano casero", 75.0, 35, "🥘"),

            # BEBIDAS
            ("Boing Guayaba 500ml", "bebida", "ninguna", "Jugo de guayaba 100% pulpa natural en botella de vidrio", 25.0, 50, "🧃"),
            ("Boing Mango 500ml", "bebida", "ninguna", "Jugo de mango maduro tradicional en botella de vidrio", 25.0, 50, "🧃"),
            ("Boing Uva 500ml", "bebida", "ninguna", "Refresco sabor uva súper helado", 25.0, 40, "🧃"),
            ("Coca-Cola Original 600ml", "bebida", "ninguna", "Refresco Coca-Cola helado en botella no retornable", 30.0, 80, "🥤"),
            ("Coca-Cola Sin Azúcar 600ml", "bebida", "ninguna", "Sabor original cero azúcar bien frío", 30.0, 50, "🥤"),
            ("Jarritos Mandarina 600ml", "bebida", "ninguna", "Refresco con sabor a fruta real estilo mexicano", 25.0, 40, "🍾"),
            ("Agua de Horchata Casera 1L", "bebida", "ninguna", "Agua fresca de arroz, canela y leche cremosa helada", 35.0, 60, "🥛"),
            ("Agua de Jamaica Natural 1L", "bebida", "ninguna", "Agua fresca de flor de jamaica 100% natural", 35.0, 60, "🍷")
        ]

        cursor.executemany('''
            INSERT INTO products (name, category, meat_type, description, price, stock, image_icon)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', products)
        print("Productos de prueba creados exitosamente.")

    # Verificar si ya existen empleados
    cursor.execute("SELECT COUNT(*) FROM employees")
    if cursor.fetchone()[0] == 0:
        employees = [
            ("Roberto Gómez", "Administrador", "555-123-4567"),
            ("José Luis Hernández", "Taquero / Cocinero", "555-987-6543"),
            ("María Fernanda López", "Cajero", "555-456-7890"),
            ("Carlos Alberto Ruiz", "Repartidor", "555-321-6549")
        ]

        cursor.executemany('''
            INSERT INTO employees (name, role, phone)
            VALUES (?, ?, ?)
        ''', employees)
        print("Empleados de prueba creados exitosamente.")

    conn.commit()
    conn.close()

if __name__ == '__main__':
    seed_database()
