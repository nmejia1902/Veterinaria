const express = require('express');
const PDFDocument = require('pdfkit');
const router = express.Router();
const pool = require('../src/db');

router.get('/ventas/:id/factura', async (req, res) => {
  try {
    const { id } = req.params;

    const [ventaRows] = await pool.query(
      'SELECT id, fecha, total FROM ventas WHERE id = ?',
      [id]
    );

    if (ventaRows.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    const venta = ventaRows[0];
    const [detalle] = await pool.query(
      `SELECT p.nombre, dv.cantidad, dv.subtotal
       FROM detalle_ventas dv
       INNER JOIN productos p ON dv.id_producto = p.id
       WHERE dv.id_venta = ?`,
      [id]
    );

    if (detalle.length === 0) {
      return res.status(404).json({ message: 'Detalle de venta vacío' });
    }


    const subtotal = detalle.reduce(
      (sum, d) => sum + Number(d.subtotal),
      0
    );

    const isv = subtotal * 0.15;
    const total = subtotal + isv;

  
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=factura-${id}.pdf`
    );

    doc.pipe(res);
    doc.fontSize(18).text('Veterinaria Patitas Felices', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Fecha: ${venta.fecha}`);
    doc.text(`Factura No: ${venta.id}`);
    doc.moveDown();
    doc.fontSize(14).text('Detalle de productos');
    doc.moveDown();

    detalle.forEach(item => {
      doc.fontSize(12).text(
        `${item.nombre} | Cant: ${item.cantidad} | L. ${Number(item.subtotal).toFixed(2)}`
      );
    });

    doc.moveDown();
    doc.text(`Subtotal: L. ${subtotal.toFixed(2)}`);
    doc.text(`ISV (15%): L. ${isv.toFixed(2)}`);
    doc.fontSize(14).text(`TOTAL: L. ${total.toFixed(2)}`);
    doc.end();
  } catch (error) {
    console.error('Error generando factura:', error);
    res.status(500).json({ message: 'Error generando factura' });
  }
});

module.exports = router;
