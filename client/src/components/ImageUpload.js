import React, { useState } from 'react';
import { uploadImage } from '../api/imageApi';

const ImageUpload = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState('');
    const [imagePath, setImagePath] = useState(''); 
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedImage) {
            setMessage('Por favor, selecciona una imagen primero.');
            return;
        }

        try {
          
            const response = await uploadImage(selectedImage);
          
            if (response && response.imagePath) {
                setImagePath(response.imagePath);  
                setMessage(`Imagen subida correctamente: ${response.imagePath}`);
            } else {
                throw new Error('No se recibió la ruta de la imagen');
            }
        } catch (error) {
            setMessage(`Error al subir la imagen: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Subir Imagen</h2>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && (
                <div>
                    <img src={preview} alt="Preview" style={{ width: '200px', height: '200px' }} />
                </div>
            )}
            <button onClick={handleUpload}>Guardar Imagen</button>
            {message && <p>{message}</p>}

           
            {imagePath && (
                <div>
                    <h3>Imagen subida:</h3>
                    <img src={imagePath} alt="Imagen subida" style={{ width: '200px', height: '200px' }} />
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
