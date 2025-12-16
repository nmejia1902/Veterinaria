require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'MiClaveSecretaSuperSegura';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET_KEY, (err, usuario) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.usuario = usuario;
    next();
  });
}

module.exports = authMiddleware;