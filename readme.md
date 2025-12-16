# 🐾 Sistema de Gestión Veterinaria – Patitas Felices

Este proyecto es un **sistema web fullstack** para la gestión de una veterinaria, que permite administrar usuarios, productos y ventas, incorporando autenticación y control de acceso.

Está dividido en **backend (Node.js + Express)** y **frontend (Angular)**, siguiendo una arquitectura desacoplada cliente–servidor.

---

## 🎯 Objetivo del Proyecto

Digitalizar y centralizar los procesos básicos de una veterinaria:
- Autenticación de usuarios
- Gestión de productos
- Registro de ventas
- Control de acceso mediante tokens

El sistema está pensado para ser **escalable**, **seguro** y **fácil de mantener**.

---

## 🧱 Arquitectura General
[ Angular Frontend ] → [ API REST Node.js ] → [ Base de Datos ]

- Frontend consume la API mediante HTTP
- Backend expone endpoints REST protegidos
- Autenticación basada en JWT

---

## 🛠 Tecnologías Utilizadas

### Backend
- Node.js
- Express
- JWT (JSON Web Token)
- Middleware de autenticación
- MySQL / MariaDB
- dotenv

### Frontend
- Angular
- TypeScript
- HTML / SCSS
- Servicios Angular para consumo de API
- Componentes modulares

---

## 📁 Estructura del Proyecto

Veterinaria/
│
├── backend/
│ ├── server.js
│ ├── .env
│ ├── package.json
│ └── src/
│ ├── db.js
│ ├── middleware/
│ │ └── auth.js
│ └── routes/
│ ├── auth.js
│ ├── productos.js
│ └── ventas.js
│
└── frontend/
├── angular.json
├── package.json
└── src/
└── app/
└── component/
├── login/
├── home/
├── product/
└── users/






---

## 🔐 Funcionalidades Principales

### Autenticación
- Login de usuarios
- Generación de token JWT
- Protección de rutas mediante middleware

### Productos
- Listado de productos
- Creación y administración desde frontend
- Consumo vía API REST

### Ventas
- Registro de ventas
- Asociación de productos
- Validaciones en backend

### Usuarios
- Gestión básica de usuarios
- Control de acceso según autenticación

---

## ▶️ Ejecución del Proyecto

### Backend

cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
ng serve
