import axios from './axios';


export const getPersonas = async () => {
  try {
    const response = await axios.get("/listarpersona");
    return response.data; 
  } catch (error) {
    throw new Error(error.message || "Error al obtener los datos");
  }
};
