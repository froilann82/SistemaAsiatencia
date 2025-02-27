import { saveImage, getImage } from '../models/imageModel.js';
import fs from 'fs';
import path from 'path';


const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No se ha subido ninguna imagen.' 
            });
        }

        const imagePath = req.file.path;
        const imageName = req.file.filename;

        
        const result = await saveImage(imagePath, imageName);

        res.status(200).json({ 
            success: true, 
            message: 'Imagen subida exitosamente.',
            imagePath: `/uploads/${req.file.filename}` 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al subir la imagen.', 
            error: error.message 
        });
    }
};


const showImage = (req, res) => {
    try {
        const { imageName } = req.params;  

        
        const result = getImage(imageName);

        if (result.success) {
            
            const imagePath = result.path;
            const imageExt = path.extname(imagePath).toLowerCase();

            
            res.setHeader('Content-Type', `image/${imageExt.replace('.', '')}`);
            
            
            const image = fs.createReadStream(imagePath);
            image.pipe(res);
        } else {
            
            res.status(404).json({
                success: false,
                message: result.message,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al mostrar la imagen.',
            error: error.message,
        });
    }
};

export { uploadImage, showImage };
