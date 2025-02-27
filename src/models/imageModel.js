import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();

const saveImage = async (imagePath, imageName) => {
    try {
        
        return {
            success: true,
            message: 'Imagen guardada correctamente.',
            path: `/uploads/${imageName}` 
        };
    } catch (error) {
        throw new Error('Error al procesar la imagen: ' + error.message);
    }
};

const getImage = (imageName) => {
    try {
        
        const imagePath = path.join(__dirname, 'uploads', imageName);
        
       
        if (fs.existsSync(imagePath)) {
            return {
                success: true,
                message: 'Imagen encontrada.',
                path: imagePath,
            };
        } else {
            return {
                success: false,
                message: 'Imagen no encontrada.',
            };
        }
    } catch (error) {
        throw new Error('Error al procesar la imagen: ' + error.message);
    }
};

export { saveImage, getImage };
