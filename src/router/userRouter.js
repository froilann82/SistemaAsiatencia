import express from "express";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser, 
    login,
    logao,
    verifyToken,
    profile
} from "../controllers/userController.js";

import { requiredAuth } from "../middlewares/Token_validator.js";

import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

const router = express.Router();

// Ruta para registrar un usuario, con validación del esquema
router.post("/userregister", validateSchema(registerSchema), createUser);

// Ruta para obtener todos los usuarios
router.get("/userall", getUsers);

// Ruta para obtener un usuario específico por id
router.get("/user/:id", getUserById);

// Ruta para actualizar la información de un usuario por id
router.put("/updateuser/:id", updateUser);

// Ruta para eliminar un usuario por id
router.delete("/deleteuser/:id", deleteUser);

// Ruta para iniciar sesión de un usuario, validada por el esquema loginSchema
router.post('/login', validateSchema(loginSchema), login);

// Ruta para cerrar sesión (logoff)
router.post('/logao', logao);

// Ruta para verificar el token de autenticación
router.get('/verify', verifyToken);

// Ruta para obtener el perfil de un usuario, con autenticación requerida
router.get('/profile', requiredAuth, profile);

export default router;
