const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./src/routes/auth');
const productosRoutes = require('./src/routes/productos');
const ventasRoutes = require('./src/routes/ventas');

const facturaRoutes = require('./routes/factura');

app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api', facturaRoutes);


app.listen(PORT, () => {
  console.log(` Backend corriendo en http://localhost:${PORT}`);
});
