
const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
  const { cliente, items } = req.body;

  if (!cliente || !cliente.nombre || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Cliente y productos son requeridos' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [clienteResult] = await conn.query(
      'INSERT INTO clientes (nombre, telefono) VALUES (?, ?)',
      [cliente.nombre, cliente.telefono || null]
    );
    const id_cliente = clienteResult.insertId;

    let total = 0;
    const detalles = [];

    for (const item of items) {
      const [prodRows] = await conn.query(
        'SELECT id, nombre, precio, stock FROM productos WHERE id = ?',
        [item.id_producto]
      );

      if (prodRows.length === 0) {
        throw new Error(`Producto con id ${item.id_producto} no existe`);
      }

      const prod = prodRows[0];

      if (prod.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para ${prod.nombre}`);
      }

      const subtotal = prod.precio * item.cantidad;
      total += subtotal;

      detalles.push({
        id_producto: prod.id,
        cantidad: item.cantidad,
        subtotal
      });
    }

    const id_usuario = req.usuario.id;
    const [ventaResult] = await conn.query(
      'INSERT INTO ventas (id_usuario, id_cliente, total) VALUES (?, ?, ?)',
      [id_usuario, id_cliente, total]
    );
    const id_venta = ventaResult.insertId;

    for (const det of detalles) {
      await conn.query(
        'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, subtotal) VALUES (?, ?, ?, ?)',
        [id_venta, det.id_producto, det.cantidad, det.subtotal]
      );

      await conn.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [det.cantidad, det.id_producto]
      );
    }

    await conn.commit();

    res.status(201).json({
      message: 'Venta registrada correctamente',
      id_venta,
      total
    });
  } catch (err) {
    await conn.rollback();
    console.error('Error al registrar venta:', err);
    res.status(500).json({
      message: err.message || 'Error al registrar la venta'
    });
  } finally {
    conn.release();
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  const id_venta = req.params.id;

  try {
    const [ventaRows] = await pool.query(
      `SELECT v.id, v.fecha, v.total,
              u.nombre AS usuario_nombre,
              c.nombre AS cliente_nombre,
              c.telefono AS cliente_telefono
       FROM ventas v
       INNER JOIN usuarios u ON v.id_usuario = u.id
       INNER JOIN clientes c ON v.id_cliente = c.id
       WHERE v.id = ?`,
      [id_venta]
    );

    if (ventaRows.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    const venta = ventaRows[0];

    const [detalleRows] = await pool.query(
      `SELECT dv.id_producto, p.nombre, p.precio, dv.cantidad, dv.subtotal
       FROM detalle_ventas dv
       INNER JOIN productos p ON dv.id_producto = p.id
       WHERE dv.id_venta = ?`,
      [id_venta]
    );

    const veterinaria = {
      nombre: 'Veterinaria Patitas Felices',
      direccion: 'Calle Principal #123',
      telefono: '555-123-4567'
    };

    res.json({
      veterinaria,
      venta,
      detalle: detalleRows
    });
  } catch (err) {
    console.error('Error al obtener factura:', err);
    res.status(500).json({ message: 'Error al obtener la factura' });
  }
});

module.exports = router;
