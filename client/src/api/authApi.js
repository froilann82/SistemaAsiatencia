import axios from './axios'; 
import Swal from 'sweetalert2';


const alertSuccess = (message) => {
  console.log('Mostrando alerta de éxito:', message);
  
  Swal.fire({
    icon: 'success',
    title: 'Éxito',
    text: message,
  });
};


const alertError = (message) => {
  console.log('Mostrando alerta de error:', message);

  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
  });
};


const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(endpoint);  

  
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(`Error HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error al cargar los datos desde ${endpoint}:`, error);
    throw error;
  }
};


export const getRoles = () => fetchData('roles-handler?action=getRoles');
export const getDistrictos = () => fetchData('roles-handler?action=getDistrictos');
export const getNextIdPersona = () => fetchData('roles-handler?action=getNextIdPersona');
export const getPersonas = () => fetchData('roles-handler?action=getPersonas');


export const createPersona = async (personaData) => {
  try {
    const response = await axios.post('/roles-handler?action=createPersona', personaData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });


    if (response.status >= 200 && response.status < 300) {
      alertSuccess(response.data.message);
      return response.data;
    } else {
      throw new Error('Hubo un error al procesar la solicitud');
    }
  } catch (error) {
    
    if (error.response && error.response.data) {
      alertError(error.response.data.message || 'Hubo un error al procesar los datos');
    } else {
      alertError('Hubo un error al procesar los datos.');
    }
    throw error;
  }
};


export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await axios.post('/images/post', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });


    if (response.status >= 200 && response.status < 300) {
      console.log('Imagen cargada exitosamente:', response.data);
      return response.data;  
    } else {
      throw new Error('Hubo un problema al cargar la imagen');
    }
  } catch (error) {
    console.error('Error al cargar la imagen:', error);
    alertError('Error al cargar la imagen');
    throw error;
  }
};
