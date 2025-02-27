import  pool  from "../db.js";
import bcrypt from 'bcryptjs';
import { createTokenAccesss } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from "../config.js";



export const createUser = async (req, res) => {
    const { Id_usuario, Nombre_Completo, Avatar, Nombre_Usuario, Passwords, Estado_Usuario, Id_Rol } = req.body;

    try {
       
        const [userExists] = await pool.query(
            'SELECT * FROM Pusuario WHERE Nombre_Usuario = ? OR Id_usuario = ?', 
            [Nombre_Usuario, Id_usuario]
        );

        if (userExists.length > 0) {
            return res.status(400).json({ message: "El Nombre de Usuario o el ID de Usuario ya están en uso." });
        }

       
        const passwordHash = await bcrypt.hash(Passwords, 10);

        
        const [result] = await pool.query(
            'INSERT INTO Pusuario (Id_usuario, Nombre_Completo, Avatar, Nombre_Usuario, Passwords, Estado_Usuario, Id_Rol) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [Id_usuario, Nombre_Completo, Avatar, Nombre_Usuario, passwordHash, Estado_Usuario, Id_Rol]
        );

        
        res.status(201).json({ message: "Usuario creado exitosamente", Id_usuario: result.insertId });
    } catch (error) {
        console.error("Error en createUser:", error);
        res.status(500).json({ error: "Error interno en el servidor" });
    }
};


export const getUsers = async (req, res) => {
    try {
        const [result] = await pool.query("SELECT * FROM Pusuario");
        res.status(200).json(result);
    } catch (error) {
        console.error("Error en getUsers:", error);
        res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
};


export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query("SELECT * FROM Pusuario WHERE Id_usuario = ?", [id]);
        if (result.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error en getUserById:", error);
        res.status(500).json({ message: "Error al obtener el usuario", error });
    }
};


export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { Nombre_Completo, Avatar, Nombre_Usuario, Passwords, Estado_Usuario, Id_Rol } = req.body;

    try {
       
        const passwordHash = Passwords ? await bcrypt.hash(Passwords, 10) : undefined;

        const query = `
            UPDATE Pusuario 
            SET Nombre_Completo = ?, Avatar = ?, Nombre_Usuario = ?, 
                ${passwordHash ? "Passwords = ?," : ""} 
                Estado_Usuario = ?, Id_Rol = ? 
            WHERE Id_usuario = ?`;
        
        const params = passwordHash
            ? [Nombre_Completo, Avatar, Nombre_Usuario, passwordHash, Estado_Usuario, Id_Rol, id]
            : [Nombre_Completo, Avatar, Nombre_Usuario, Estado_Usuario, Id_Rol, id];

        await pool.query(query, params);

        res.status(200).json({ message: "Usuario actualizado exitosamente" });
    } catch (error) {
        console.error("Error en updateUser:", error);
        res.status(500).json({ message: "Error al actualizar el usuario", error });
    }
};


export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query("DELETE FROM Pusuario WHERE Id_usuario = ?", [id]);
        res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        console.error("Error en deleteUser:", error);
        res.status(500).json({ message: "Error al eliminar el usuario", error });
    }
};


export const login = async (req, res) => {
    const { Nombre_Usuario, Passwords } = req.body;

    if (!Nombre_Usuario || !Passwords) {
        return res.status(400).json({ message: "Se requieren tanto el Nombre de Usuario como la Contraseña" });
    }

    try {
        const [rows] = await pool.execute('SELECT * FROM Pusuario WHERE Nombre_Usuario = ?', [Nombre_Usuario]);

        if (rows.length === 0) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        const userFound = rows[0];

        if (!userFound.Passwords) {
            return res.status(400).json({ message: "La contraseña del usuario está ausente" });
        }

        const isMatch = await bcrypt.compare(Passwords, userFound.Passwords);

        if (!isMatch) {
            return res.status(400).json({ message: "Credenciales inválidas" });
        }

       
        const token = await createTokenAccesss({ Id_usuario: userFound.Id_usuario });

        if (!token) {
            return res.status(500).json({ message: "Error al generar el token" });
        }

        res.cookie('token', token);

        res.status(201).json({
            Id_usuario: userFound.Id_usuario,
            Nombre_Usuario: userFound.Nombre_Usuario
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const logao = (req, res) => {
    res.cookie('token', '', {
        expires: new Date(0),
    });
    return res.sendStatus(200);
};


export const profile = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Pusuario WHERE Id_usuario = ?', [req.user.Id_usuario]);

        if (rows.length === 0) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        const userFound = rows[0];

        res.status(201).json({
            Id_usuario: userFound.Id_usuario,
            Nombre_Completo: userFound.Nombre_Completo,
            Nombre_Usuario: userFound.Nombre_Usuario
        });
    } catch (error) {
        console.error("Error en profile:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};


export const verifyToken = async (req, res) => {
    const { token } = req.cookies;

    if (!token) return res.status(401).json({ message: "No autorizado" });

    try {
        jwt.verify(token, TOKEN_SECRET, async (err, user) => {
            if (err) return res.status(401).json({ message: "No autorizado" });

            const [rows] = await pool.query('SELECT * FROM Pusuario WHERE Id_usuario = ?', [user.Id_usuario]);

            if (rows.length === 0) return res.status(401).json({ message: "No autorizado" });

            const userFound = rows[0];

            return res.json({
                id: userFound.Id_usuario,
                Nombre_Usuario: userFound.Nombre_Usuario,
                Nombre_Completo: userFound.Nombre_Completo,
            });
        });
    } catch (error) {
        console.error("Error en verifyToken:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};