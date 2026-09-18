// ============================================
// PRODUCTOS - Base de datos de Ferretería
// +150 productos organizados en 12 categorías
// ============================================

const CATEGORIES = [
    { id: 'herramientas-manuales', name: 'Herramientas Manuales', icon: '🔨', color: '#f59e0b' },
    { id: 'herramientas-electricas', name: 'Herramientas Eléctricas', icon: '⚡', color: '#3b82f6' },
    { id: 'tornilleria', name: 'Tornillería y Fijación', icon: '🔩', color: '#8b5cf6' },
    { id: 'pintura', name: 'Pintura', icon: '🎨', color: '#ec4899' },
    { id: 'electricidad', name: 'Electricidad', icon: '💡', color: '#eab308' },
    { id: 'plomeria', name: 'Plomería', icon: '🚿', color: '#06b6d4' },
    { id: 'cerrajeria', name: 'Cerrajería', icon: '🔐', color: '#f97316' },
    { id: 'adhesivos', name: 'Adhesivos y Selladores', icon: '🧴', color: '#14b8a6' },
    { id: 'jardineria', name: 'Jardinería', icon: '🌿', color: '#22c55e' },
    { id: 'construccion', name: 'Material de Construcción', icon: '🧱', color: '#ef4444' },
    { id: 'seguridad', name: 'Seguridad Industrial', icon: '🦺', color: '#f59e0b' },
    { id: 'iluminacion', name: 'Iluminación', icon: '💡', color: '#a855f7' }
];

const PRODUCTS = [
    // ==========================================
    // 🔨 HERRAMIENTAS MANUALES (18 productos)
    // ==========================================
    { id: 'HM001', name: 'Martillo Uña 16oz', category: 'herramientas-manuales', price: 189.00, stock: 45, unit: 'pza', barcode: '7501000001' },
    { id: 'HM002', name: 'Martillo Bola 32oz', category: 'herramientas-manuales', price: 249.00, stock: 30, unit: 'pza', barcode: '7501000002' },
    { id: 'HM003', name: 'Desarmador Plano 1/4"', category: 'herramientas-manuales', price: 45.00, stock: 80, unit: 'pza', barcode: '7501000003' },
    { id: 'HM004', name: 'Desarmador Cruz Phillips #2', category: 'herramientas-manuales', price: 49.00, stock: 75, unit: 'pza', barcode: '7501000004' },
    { id: 'HM005', name: 'Juego Desarmadores 6 pzas', category: 'herramientas-manuales', price: 189.00, stock: 35, unit: 'juego', barcode: '7501000005' },
    { id: 'HM006', name: 'Pinza de Presión 10"', category: 'herramientas-manuales', price: 159.00, stock: 40, unit: 'pza', barcode: '7501000006' },
    { id: 'HM007', name: 'Pinza de Electricista 8"', category: 'herramientas-manuales', price: 139.00, stock: 50, unit: 'pza', barcode: '7501000007' },
    { id: 'HM008', name: 'Pinza de Corte Diagonal 7"', category: 'herramientas-manuales', price: 119.00, stock: 45, unit: 'pza', barcode: '7501000008' },
    { id: 'HM009', name: 'Llave Inglesa Ajustable 10"', category: 'herramientas-manuales', price: 199.00, stock: 35, unit: 'pza', barcode: '7501000009' },
    { id: 'HM010', name: 'Juego Llaves Allen Métricas', category: 'herramientas-manuales', price: 129.00, stock: 60, unit: 'juego', barcode: '7501000010' },
    { id: 'HM011', name: 'Llave Stilson 14"', category: 'herramientas-manuales', price: 289.00, stock: 25, unit: 'pza', barcode: '7501000011' },
    { id: 'HM012', name: 'Segueta con Marco 12"', category: 'herramientas-manuales', price: 129.00, stock: 40, unit: 'pza', barcode: '7501000012' },
    { id: 'HM013', name: 'Flexómetro 5m', category: 'herramientas-manuales', price: 89.00, stock: 70, unit: 'pza', barcode: '7501000013' },
    { id: 'HM014', name: 'Flexómetro 8m', category: 'herramientas-manuales', price: 149.00, stock: 45, unit: 'pza', barcode: '7501000014' },
    { id: 'HM015', name: 'Nivel de Burbuja 24"', category: 'herramientas-manuales', price: 179.00, stock: 30, unit: 'pza', barcode: '7501000015' },
    { id: 'HM016', name: 'Cincel Frío 3/4"', category: 'herramientas-manuales', price: 69.00, stock: 50, unit: 'pza', barcode: '7501000016' },
    { id: 'HM017', name: 'Espátula 4"', category: 'herramientas-manuales', price: 49.00, stock: 60, unit: 'pza', barcode: '7501000017' },
    { id: 'HM018', name: 'Arco para Segueta Profesional', category: 'herramientas-manuales', price: 219.00, stock: 25, unit: 'pza', barcode: '7501000018' },

    // ==========================================
    // ⚡ HERRAMIENTAS ELÉCTRICAS (12 productos)
    // ==========================================
    { id: 'HE001', name: 'Taladro Percutor 1/2" 750W', category: 'herramientas-electricas', price: 1299.00, stock: 15, unit: 'pza', barcode: '7502000001' },
    { id: 'HE002', name: 'Taladro Inalámbrico 20V', category: 'herramientas-electricas', price: 1899.00, stock: 12, unit: 'pza', barcode: '7502000002' },
    { id: 'HE003', name: 'Rotomartillo SDS Plus 800W', category: 'herramientas-electricas', price: 2499.00, stock: 8, unit: 'pza', barcode: '7502000003' },
    { id: 'HE004', name: 'Esmeril Angular 4-1/2" 850W', category: 'herramientas-electricas', price: 899.00, stock: 20, unit: 'pza', barcode: '7502000004' },
    { id: 'HE005', name: 'Sierra Circular 7-1/4" 1500W', category: 'herramientas-electricas', price: 1799.00, stock: 10, unit: 'pza', barcode: '7502000005' },
    { id: 'HE006', name: 'Sierra Caladora 650W', category: 'herramientas-electricas', price: 1199.00, stock: 12, unit: 'pza', barcode: '7502000006' },
    { id: 'HE007', name: 'Lijadora Orbital 250W', category: 'herramientas-electricas', price: 899.00, stock: 15, unit: 'pza', barcode: '7502000007' },
    { id: 'HE008', name: 'Pulidora 7" 1200W', category: 'herramientas-electricas', price: 1599.00, stock: 8, unit: 'pza', barcode: '7502000008' },
    { id: 'HE009', name: 'Pistola de Calor 1800W', category: 'herramientas-electricas', price: 699.00, stock: 18, unit: 'pza', barcode: '7502000009' },
    { id: 'HE010', name: 'Compresor de Aire 50L', category: 'herramientas-electricas', price: 4599.00, stock: 5, unit: 'pza', barcode: '7502000010' },
    { id: 'HE011', name: 'Soldadora Inversora 200A', category: 'herramientas-electricas', price: 3999.00, stock: 6, unit: 'pza', barcode: '7502000011' },
    { id: 'HE012', name: 'Dremel Multifuncional 175W', category: 'herramientas-electricas', price: 1499.00, stock: 10, unit: 'pza', barcode: '7502000012' },

    // ==========================================
    // 🔩 TORNILLERÍA Y FIJACIÓN (15 productos)
    // ==========================================
    { id: 'TF001', name: 'Tornillo p/Madera 1" (100pz)', category: 'tornilleria', price: 35.00, stock: 200, unit: 'bolsa', barcode: '7503000001' },
    { id: 'TF002', name: 'Tornillo p/Madera 2" (100pz)', category: 'tornilleria', price: 55.00, stock: 180, unit: 'bolsa', barcode: '7503000002' },
    { id: 'TF003', name: 'Tornillo p/Madera 3" (50pz)', category: 'tornilleria', price: 49.00, stock: 150, unit: 'bolsa', barcode: '7503000003' },
    { id: 'TF004', name: 'Tornillo Tablaroca 1-5/8" (100pz)', category: 'tornilleria', price: 39.00, stock: 200, unit: 'bolsa', barcode: '7503000004' },
    { id: 'TF005', name: 'Tornillo Tablaroca 2-1/2" (100pz)', category: 'tornilleria', price: 59.00, stock: 170, unit: 'bolsa', barcode: '7503000005' },
    { id: 'TF006', name: 'Clavo 2" (kg)', category: 'tornilleria', price: 45.00, stock: 100, unit: 'kg', barcode: '7503000006' },
    { id: 'TF007', name: 'Clavo 3" (kg)', category: 'tornilleria', price: 42.00, stock: 100, unit: 'kg', barcode: '7503000007' },
    { id: 'TF008', name: 'Clavo 4" (kg)', category: 'tornilleria', price: 40.00, stock: 80, unit: 'kg', barcode: '7503000008' },
    { id: 'TF009', name: 'Taquete Plástico 1/4" (100pz)', category: 'tornilleria', price: 25.00, stock: 250, unit: 'bolsa', barcode: '7503000009' },
    { id: 'TF010', name: 'Taquete Plástico 3/8" (50pz)', category: 'tornilleria', price: 35.00, stock: 200, unit: 'bolsa', barcode: '7503000010' },
    { id: 'TF011', name: 'Ancla de Expansión 1/4"', category: 'tornilleria', price: 8.00, stock: 300, unit: 'pza', barcode: '7503000011' },
    { id: 'TF012', name: 'Tuerca Hexagonal 1/4" (50pz)', category: 'tornilleria', price: 29.00, stock: 150, unit: 'bolsa', barcode: '7503000012' },
    { id: 'TF013', name: 'Rondana Plana 1/4" (100pz)', category: 'tornilleria', price: 22.00, stock: 180, unit: 'bolsa', barcode: '7503000013' },
    { id: 'TF014', name: 'Pija p/Lámina 1" (100pz)', category: 'tornilleria', price: 69.00, stock: 120, unit: 'bolsa', barcode: '7503000014' },
    { id: 'TF015', name: 'Tornillo Hexagonal 3/8"x2" (25pz)', category: 'tornilleria', price: 45.00, stock: 100, unit: 'bolsa', barcode: '7503000015' },

    // ==========================================
    // 🎨 PINTURA (14 productos)
    // ==========================================
    { id: 'PT001', name: 'Pintura Vinílica Blanca 4L', category: 'pintura', price: 389.00, stock: 40, unit: 'cubeta', barcode: '7504000001' },
    { id: 'PT002', name: 'Pintura Vinílica Blanca 19L', category: 'pintura', price: 1299.00, stock: 20, unit: 'cubeta', barcode: '7504000002' },
    { id: 'PT003', name: 'Pintura Esmalte Blanco 1L', category: 'pintura', price: 199.00, stock: 35, unit: 'lata', barcode: '7504000003' },
    { id: 'PT004', name: 'Pintura Esmalte Negro 1L', category: 'pintura', price: 199.00, stock: 30, unit: 'lata', barcode: '7504000004' },
    { id: 'PT005', name: 'Pintura Aerosol Varios Colores', category: 'pintura', price: 89.00, stock: 100, unit: 'lata', barcode: '7504000005' },
    { id: 'PT006', name: 'Primer Anticorrosivo Rojo 1L', category: 'pintura', price: 169.00, stock: 30, unit: 'lata', barcode: '7504000006' },
    { id: 'PT007', name: 'Brocha 2"', category: 'pintura', price: 39.00, stock: 60, unit: 'pza', barcode: '7504000007' },
    { id: 'PT008', name: 'Brocha 4"', category: 'pintura', price: 69.00, stock: 50, unit: 'pza', barcode: '7504000008' },
    { id: 'PT009', name: 'Rodillo 9" con Felpa', category: 'pintura', price: 89.00, stock: 45, unit: 'pza', barcode: '7504000009' },
    { id: 'PT010', name: 'Charola para Rodillo', category: 'pintura', price: 49.00, stock: 40, unit: 'pza', barcode: '7504000010' },
    { id: 'PT011', name: 'Thinner Estándar 1L', category: 'pintura', price: 69.00, stock: 50, unit: 'lata', barcode: '7504000011' },
    { id: 'PT012', name: 'Aguarrás 1L', category: 'pintura', price: 79.00, stock: 35, unit: 'lata', barcode: '7504000012' },
    { id: 'PT013', name: 'Lija de Agua #120 (hoja)', category: 'pintura', price: 12.00, stock: 200, unit: 'hoja', barcode: '7504000013' },
    { id: 'PT014', name: 'Lija de Agua #220 (hoja)', category: 'pintura', price: 12.00, stock: 200, unit: 'hoja', barcode: '7504000014' },

    // ==========================================
    // 💡 ELECTRICIDAD (15 productos)
    // ==========================================
    { id: 'EL001', name: 'Cable THW Cal. 12 (m)', category: 'electricidad', price: 18.00, stock: 500, unit: 'metro', barcode: '7505000001' },
    { id: 'EL002', name: 'Cable THW Cal. 14 (m)', category: 'electricidad', price: 12.00, stock: 500, unit: 'metro', barcode: '7505000002' },
    { id: 'EL003', name: 'Cable THW Cal. 10 (m)', category: 'electricidad', price: 28.00, stock: 300, unit: 'metro', barcode: '7505000003' },
    { id: 'EL004', name: 'Cable Uso Rudo 3x12 (m)', category: 'electricidad', price: 55.00, stock: 200, unit: 'metro', barcode: '7505000004' },
    { id: 'EL005', name: 'Apagador Sencillo', category: 'electricidad', price: 39.00, stock: 80, unit: 'pza', barcode: '7505000005' },
    { id: 'EL006', name: 'Apagador de Escalera', category: 'electricidad', price: 59.00, stock: 50, unit: 'pza', barcode: '7505000006' },
    { id: 'EL007', name: 'Contacto Duplex Polarizado', category: 'electricidad', price: 35.00, stock: 80, unit: 'pza', barcode: '7505000007' },
    { id: 'EL008', name: 'Placa para Apagador', category: 'electricidad', price: 15.00, stock: 100, unit: 'pza', barcode: '7505000008' },
    { id: 'EL009', name: 'Cinta de Aislar Negra 18m', category: 'electricidad', price: 25.00, stock: 120, unit: 'rollo', barcode: '7505000009' },
    { id: 'EL010', name: 'Centro de Carga 2 Polos', category: 'electricidad', price: 399.00, stock: 15, unit: 'pza', barcode: '7505000010' },
    { id: 'EL011', name: 'Interruptor Termomagnético 1P 20A', category: 'electricidad', price: 149.00, stock: 30, unit: 'pza', barcode: '7505000011' },
    { id: 'EL012', name: 'Foco LED 9W Luz Blanca', category: 'electricidad', price: 45.00, stock: 100, unit: 'pza', barcode: '7505000012' },
    { id: 'EL013', name: 'Foco LED 9W Luz Cálida', category: 'electricidad', price: 45.00, stock: 100, unit: 'pza', barcode: '7505000013' },
    { id: 'EL014', name: 'Extensión Eléctrica 5m', category: 'electricidad', price: 129.00, stock: 25, unit: 'pza', barcode: '7505000014' },
    { id: 'EL015', name: 'Multicontacto 6 Entradas c/Supresor', category: 'electricidad', price: 199.00, stock: 30, unit: 'pza', barcode: '7505000015' },

    // ==========================================
    // 🚿 PLOMERÍA (14 productos)
    // ==========================================
    { id: 'PL001', name: 'Tubo PVC Hidráulico 1/2" (3m)', category: 'plomeria', price: 49.00, stock: 50, unit: 'tramo', barcode: '7506000001' },
    { id: 'PL002', name: 'Tubo PVC Hidráulico 3/4" (3m)', category: 'plomeria', price: 65.00, stock: 40, unit: 'tramo', barcode: '7506000002' },
    { id: 'PL003', name: 'Tubo PVC Sanitario 2" (3m)', category: 'plomeria', price: 89.00, stock: 30, unit: 'tramo', barcode: '7506000003' },
    { id: 'PL004', name: 'Tubo PVC Sanitario 4" (3m)', category: 'plomeria', price: 169.00, stock: 25, unit: 'tramo', barcode: '7506000004' },
    { id: 'PL005', name: 'Codo PVC 1/2" 90°', category: 'plomeria', price: 5.00, stock: 200, unit: 'pza', barcode: '7506000005' },
    { id: 'PL006', name: 'Tee PVC 1/2"', category: 'plomeria', price: 7.00, stock: 150, unit: 'pza', barcode: '7506000006' },
    { id: 'PL007', name: 'Llave de Paso 1/2" PVC', category: 'plomeria', price: 35.00, stock: 60, unit: 'pza', barcode: '7506000007' },
    { id: 'PL008', name: 'Llave de Nariz 1/2" Cromada', category: 'plomeria', price: 89.00, stock: 40, unit: 'pza', barcode: '7506000008' },
    { id: 'PL009', name: 'Válvula Esférica 1/2" Latón', category: 'plomeria', price: 129.00, stock: 30, unit: 'pza', barcode: '7506000009' },
    { id: 'PL010', name: 'Manguera Flexible p/Lavabo 40cm', category: 'plomeria', price: 49.00, stock: 50, unit: 'pza', barcode: '7506000010' },
    { id: 'PL011', name: 'Cinta Teflón 3/4"', category: 'plomeria', price: 12.00, stock: 200, unit: 'rollo', barcode: '7506000011' },
    { id: 'PL012', name: 'Pegamento PVC 250ml', category: 'plomeria', price: 89.00, stock: 40, unit: 'bote', barcode: '7506000012' },
    { id: 'PL013', name: 'Flotador p/Tinaco', category: 'plomeria', price: 79.00, stock: 25, unit: 'pza', barcode: '7506000013' },
    { id: 'PL014', name: 'Válvula de Llenado p/WC', category: 'plomeria', price: 149.00, stock: 20, unit: 'pza', barcode: '7506000014' },

    // ==========================================
    // 🔐 CERRAJERÍA (10 productos)
    // ==========================================
    { id: 'CR001', name: 'Candado Latón 40mm', category: 'cerrajeria', price: 129.00, stock: 50, unit: 'pza', barcode: '7507000001' },
    { id: 'CR002', name: 'Candado Latón 50mm', category: 'cerrajeria', price: 179.00, stock: 40, unit: 'pza', barcode: '7507000002' },
    { id: 'CR003', name: 'Cerradura de Pomo Baño', category: 'cerrajeria', price: 249.00, stock: 25, unit: 'pza', barcode: '7507000003' },
    { id: 'CR004', name: 'Cerradura de Pomo Entrada', category: 'cerrajeria', price: 349.00, stock: 20, unit: 'pza', barcode: '7507000004' },
    { id: 'CR005', name: 'Cerrojo Sencillo', category: 'cerrajeria', price: 199.00, stock: 30, unit: 'pza', barcode: '7507000005' },
    { id: 'CR006', name: 'Cerrojo Doble', category: 'cerrajeria', price: 299.00, stock: 20, unit: 'pza', barcode: '7507000006' },
    { id: 'CR007', name: 'Bisagra 3" (par)', category: 'cerrajeria', price: 35.00, stock: 80, unit: 'par', barcode: '7507000007' },
    { id: 'CR008', name: 'Bisagra 4" (par)', category: 'cerrajeria', price: 49.00, stock: 60, unit: 'par', barcode: '7507000008' },
    { id: 'CR009', name: 'Pasador Tubular 4"', category: 'cerrajeria', price: 29.00, stock: 50, unit: 'pza', barcode: '7507000009' },
    { id: 'CR010', name: 'Gancho para Hamaca (par)', category: 'cerrajeria', price: 39.00, stock: 40, unit: 'par', barcode: '7507000010' },

    // ==========================================
    // 🧴 ADHESIVOS Y SELLADORES (10 productos)
    // ==========================================
    { id: 'AS001', name: 'Silicón Transparente 280ml', category: 'adhesivos', price: 79.00, stock: 50, unit: 'tubo', barcode: '7508000001' },
    { id: 'AS002', name: 'Silicón Blanco 280ml', category: 'adhesivos', price: 79.00, stock: 45, unit: 'tubo', barcode: '7508000002' },
    { id: 'AS003', name: 'Pegamento Contacto 250ml', category: 'adhesivos', price: 89.00, stock: 40, unit: 'bote', barcode: '7508000003' },
    { id: 'AS004', name: 'Pegamento Blanco 500ml', category: 'adhesivos', price: 59.00, stock: 50, unit: 'bote', barcode: '7508000004' },
    { id: 'AS005', name: 'Kola Loka 3g', category: 'adhesivos', price: 25.00, stock: 100, unit: 'pza', barcode: '7508000005' },
    { id: 'AS006', name: 'Cinta Masking 24mm x 50m', category: 'adhesivos', price: 39.00, stock: 80, unit: 'rollo', barcode: '7508000006' },
    { id: 'AS007', name: 'Cinta Canela 48mm x 150m', category: 'adhesivos', price: 45.00, stock: 70, unit: 'rollo', barcode: '7508000007' },
    { id: 'AS008', name: 'Sellador Acrílico Blanco 300ml', category: 'adhesivos', price: 69.00, stock: 40, unit: 'tubo', barcode: '7508000008' },
    { id: 'AS009', name: 'Espuma de Poliuretano 500ml', category: 'adhesivos', price: 149.00, stock: 25, unit: 'lata', barcode: '7508000009' },
    { id: 'AS010', name: 'Cinta Duct Tape Gris 48mm', category: 'adhesivos', price: 79.00, stock: 50, unit: 'rollo', barcode: '7508000010' },

    // ==========================================
    // 🌿 JARDINERÍA (10 productos)
    // ==========================================
    { id: 'JD001', name: 'Manguera Reforzada 1/2" x 15m', category: 'jardineria', price: 249.00, stock: 20, unit: 'pza', barcode: '7509000001' },
    { id: 'JD002', name: 'Manguera Reforzada 1/2" x 30m', category: 'jardineria', price: 429.00, stock: 15, unit: 'pza', barcode: '7509000002' },
    { id: 'JD003', name: 'Pistola p/Manguera 7 Funciones', category: 'jardineria', price: 119.00, stock: 30, unit: 'pza', barcode: '7509000003' },
    { id: 'JD004', name: 'Pala Redonda Mango Largo', category: 'jardineria', price: 189.00, stock: 20, unit: 'pza', barcode: '7509000004' },
    { id: 'JD005', name: 'Pala Cuadrada Mango Largo', category: 'jardineria', price: 199.00, stock: 18, unit: 'pza', barcode: '7509000005' },
    { id: 'JD006', name: 'Rastrillo 16 Dientes', category: 'jardineria', price: 159.00, stock: 15, unit: 'pza', barcode: '7509000006' },
    { id: 'JD007', name: 'Tijera de Podar 8"', category: 'jardineria', price: 139.00, stock: 25, unit: 'pza', barcode: '7509000007' },
    { id: 'JD008', name: 'Carretilla 5ft³', category: 'jardineria', price: 1299.00, stock: 8, unit: 'pza', barcode: '7509000008' },
    { id: 'JD009', name: 'Aspersor Giratorio p/Jardín', category: 'jardineria', price: 89.00, stock: 30, unit: 'pza', barcode: '7509000009' },
    { id: 'JD010', name: 'Conector Rápido p/Manguera', category: 'jardineria', price: 35.00, stock: 50, unit: 'pza', barcode: '7509000010' },

    // ==========================================
    // 🧱 MATERIAL DE CONSTRUCCIÓN (12 productos)
    // ==========================================
    { id: 'MC001', name: 'Cemento Gris 50kg', category: 'construccion', price: 249.00, stock: 100, unit: 'saco', barcode: '7510000001' },
    { id: 'MC002', name: 'Cemento Blanco 1kg', category: 'construccion', price: 35.00, stock: 60, unit: 'bolsa', barcode: '7510000002' },
    { id: 'MC003', name: 'Mortero Premezclado 50kg', category: 'construccion', price: 139.00, stock: 50, unit: 'saco', barcode: '7510000003' },
    { id: 'MC004', name: 'Varilla 3/8" (9.5m)', category: 'construccion', price: 129.00, stock: 80, unit: 'tramo', barcode: '7510000004' },
    { id: 'MC005', name: 'Alambre Recocido Cal. 18 (kg)', category: 'construccion', price: 45.00, stock: 100, unit: 'kg', barcode: '7510000005' },
    { id: 'MC006', name: 'Alambrón Cal. 8 (kg)', category: 'construccion', price: 39.00, stock: 80, unit: 'kg', barcode: '7510000006' },
    { id: 'MC007', name: 'Malla Electrosoldada 6x6-10/10', category: 'construccion', price: 799.00, stock: 15, unit: 'pieza', barcode: '7510000007' },
    { id: 'MC008', name: 'Impermeabilizante Rojo 4L', category: 'construccion', price: 499.00, stock: 25, unit: 'cubeta', barcode: '7510000008' },
    { id: 'MC009', name: 'Impermeabilizante Rojo 19L', category: 'construccion', price: 1799.00, stock: 12, unit: 'cubeta', barcode: '7510000009' },
    { id: 'MC010', name: 'Block 15x20x40', category: 'construccion', price: 12.00, stock: 500, unit: 'pza', barcode: '7510000010' },
    { id: 'MC011', name: 'Tabique Rojo', category: 'construccion', price: 5.00, stock: 1000, unit: 'pza', barcode: '7510000011' },
    { id: 'MC012', name: 'Yeso 40kg', category: 'construccion', price: 99.00, stock: 40, unit: 'saco', barcode: '7510000012' },

    // ==========================================
    // 🦺 SEGURIDAD INDUSTRIAL (10 productos)
    // ==========================================
    { id: 'SI001', name: 'Guantes de Carnaza (par)', category: 'seguridad', price: 59.00, stock: 50, unit: 'par', barcode: '7511000001' },
    { id: 'SI002', name: 'Guantes de Latex (caja 100pz)', category: 'seguridad', price: 149.00, stock: 30, unit: 'caja', barcode: '7511000002' },
    { id: 'SI003', name: 'Lentes de Seguridad Claros', category: 'seguridad', price: 49.00, stock: 60, unit: 'pza', barcode: '7511000003' },
    { id: 'SI004', name: 'Lentes de Seguridad Oscuros', category: 'seguridad', price: 55.00, stock: 50, unit: 'pza', barcode: '7511000004' },
    { id: 'SI005', name: 'Casco de Seguridad Blanco', category: 'seguridad', price: 89.00, stock: 30, unit: 'pza', barcode: '7511000005' },
    { id: 'SI006', name: 'Casco de Seguridad Amarillo', category: 'seguridad', price: 89.00, stock: 30, unit: 'pza', barcode: '7511000006' },
    { id: 'SI007', name: 'Chaleco Reflejante', category: 'seguridad', price: 69.00, stock: 40, unit: 'pza', barcode: '7511000007' },
    { id: 'SI008', name: 'Tapones Auditivos (par)', category: 'seguridad', price: 15.00, stock: 100, unit: 'par', barcode: '7511000008' },
    { id: 'SI009', name: 'Mascarilla N95 (10pz)', category: 'seguridad', price: 129.00, stock: 40, unit: 'paquete', barcode: '7511000009' },
    { id: 'SI010', name: 'Arnés de Seguridad Completo', category: 'seguridad', price: 899.00, stock: 8, unit: 'pza', barcode: '7511000010' },

    // ==========================================
    // 💡 ILUMINACIÓN (10 productos)
    // ==========================================
    { id: 'IL001', name: 'Foco LED A19 12W Luz Blanca', category: 'iluminacion', price: 59.00, stock: 80, unit: 'pza', barcode: '7512000001' },
    { id: 'IL002', name: 'Foco LED A19 12W Luz Cálida', category: 'iluminacion', price: 59.00, stock: 80, unit: 'pza', barcode: '7512000002' },
    { id: 'IL003', name: 'Tubo LED T8 18W 120cm', category: 'iluminacion', price: 99.00, stock: 50, unit: 'pza', barcode: '7512000003' },
    { id: 'IL004', name: 'Panel LED Cuadrado 24W', category: 'iluminacion', price: 249.00, stock: 25, unit: 'pza', barcode: '7512000004' },
    { id: 'IL005', name: 'Reflector LED 50W', category: 'iluminacion', price: 399.00, stock: 20, unit: 'pza', barcode: '7512000005' },
    { id: 'IL006', name: 'Reflector LED 100W', category: 'iluminacion', price: 699.00, stock: 15, unit: 'pza', barcode: '7512000006' },
    { id: 'IL007', name: 'Tira LED 5m Blanca', category: 'iluminacion', price: 199.00, stock: 25, unit: 'rollo', barcode: '7512000007' },
    { id: 'IL008', name: 'Tira LED 5m RGB', category: 'iluminacion', price: 349.00, stock: 20, unit: 'rollo', barcode: '7512000008' },
    { id: 'IL009', name: 'Socket E27 con Roseta', category: 'iluminacion', price: 25.00, stock: 80, unit: 'pza', barcode: '7512000009' },
    { id: 'IL010', name: 'Lámpara de Emergencia LED', category: 'iluminacion', price: 299.00, stock: 20, unit: 'pza', barcode: '7512000010' }
];

// Función helper para obtener productos por categoría
function getProductsByCategory(categoryId) {
    return PRODUCTS.filter(p => p.category === categoryId);
}

// Función helper para buscar productos
function searchProducts(query) {
    const q = query.toLowerCase().trim();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.barcode.includes(q)
    );
}

// Función helper para obtener un producto por ID
function getProductById(productId) {
    return PRODUCTS.find(p => p.id === productId);
}

// Inicializar stock en localStorage si no existe
function initializeStock() {
    if (!localStorage.getItem('ferreteria_stock')) {
        const stock = {};
        PRODUCTS.forEach(p => {
            stock[p.id] = p.stock;
        });
        localStorage.setItem('ferreteria_stock', JSON.stringify(stock));
    }
}

// Obtener stock actual
function getCurrentStock(productId) {
    const stock = JSON.parse(localStorage.getItem('ferreteria_stock') || '{}');
    return stock[productId] !== undefined ? stock[productId] : (getProductById(productId)?.stock || 0);
}

// Actualizar stock
function updateStock(productId, quantity) {
    const stock = JSON.parse(localStorage.getItem('ferreteria_stock') || '{}');
    if (stock[productId] !== undefined) {
        stock[productId] -= quantity;
        if (stock[productId] < 0) stock[productId] = 0;
        localStorage.setItem('ferreteria_stock', JSON.stringify(stock));
    }
}
