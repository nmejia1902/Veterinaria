
const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre, precio, stock FROM productos');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;
    if (!nombre || precio == null) {
      return res.status(400).json({ message: 'nombre y precio son requeridos' });
    }
    const [result] = await pool.query(
      'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
      [nombre, parseFloat(precio), stock || 0]
    );
    res.status(201).json({ message: 'Producto creado', id: result.insertId });
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ message: 'Error al crear producto' });
  }
});

module.exports = router;
