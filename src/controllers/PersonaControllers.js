import { getAllPersonas } from '../models/personaModel.js';  


const listarPersonas = async (req, res) => {
  try {
    const personas = await getAllPersonas();  
    res.status(200).json(personas); 
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las personas' }); 
  }
};


export { listarPersonas };
