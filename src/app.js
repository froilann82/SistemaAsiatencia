import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './router/authRouter.js'; 
import imageRoutes from './router/imageRoutes.js'; 
import personaRoutes from './router/personaRoutes.js'; 
import userRoutes from './router/userRouter.js';
import { fileURLToPath } from 'url'; 
import path from 'path';

const app = express();

// Configurar CORS con las opciones correctas
app.use(cors({
  origin: "http://localhost:3000",  // Permite solicitudes solo desde este origen
  credentials: true,               // Permite el envío de cookies y credenciales
}));

// Obtener el __dirname en módulos ES
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Middleware para servir archivos estáticos (imágenes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api', authRouter);      // Ruta para autenticación
app.use('/api', imageRoutes);     // Ruta para manejar imágenes (subir y mostrar)
app.use('/api', personaRoutes);   // Ruta para personas
app.use('/api', userRoutes);      // Ruta para usuarios

// Exportar la app para ser usada en el servidor
export default app;
