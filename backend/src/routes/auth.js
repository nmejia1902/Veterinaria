const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "MiClaveSecretaSuperSegura";

router.post("/register", async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res
        .status(400)
        .json({ message: "nombre, correo y password son requeridos." });
    }

    const [existe] = await pool.query(
      "SELECT id FROM usuarios WHERE correo = ?",
      [correo]
    );
    if (existe.length > 0) {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)",
      [nombre, correo, hashedPass]
    );

    res
      .status(201)
      .json({ message: "Usuario registrado", id: result.insertId });
  } catch (err) {
    console.error("Error register:", err);
    res
      .status(500)
      .json({ message: "Error al registrar usuario", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res
        .status(400)
        .json({ message: "correo y password son requeridos" });
    }

    const [rows] = await pool.query("SELECT * FROM usuarios WHERE correo = ?", [
      correo,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const usuario = rows[0];
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
      },
    });
  } catch (err) {
    console.error("Error login:", err);
    res.status(500).json({ message: "Error en login", error: err.message });
  }
});

module.exports = router;
