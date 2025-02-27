import axios from './axios';
export const uploadImage = async (imageFile) => {
    if (!imageFile) {
        throw new Error('No se ha seleccionado ningún archivo.');
    }

  
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
       
        const response = await axios.fetch('/upload', {
            method: 'POST',
            body: formData,
        });

     
        if (!response.ok) {
            const errorData = await response.json();
            const message = errorData.message || `Error ${response.status}: ${response.statusText}`;
            throw new Error(message);
        }

        
        const data = await response.json();

        if (!data || !data.imagePath) {
            throw new Error('La respuesta del servidor no contiene la ruta de la imagen.');
        }

        
        const imagePath = `http://localhost:5001${data.imagePath}`; 

        return imagePath; 
    } catch (error) {
        console.error('Error al subir la imagen:', error.message || error);
        throw error; 
    }
};
