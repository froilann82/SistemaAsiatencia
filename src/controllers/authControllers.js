import { 
  getNextIdPersona as getNextIdPersonaModel, 
  getAllRoles, 
  createRole, 
  getDistrictos, 
  checkRoleExistence, 
  checkDNIExistence,
  checkCorreoExistence,
  createPersona
   
} from '../models/roleModel.js'; 
import { parse, isDate } from 'date-fns';
import pool from '../db.js';
import validator from 'validator';
import moment from 'moment';

export const handleRolesAndIdPersona = async (req, res) => {
  try {
    const { action } = req.query; 
    
    switch (action) {
      case 'register':
        
        const { idRol, nombreRol } = req.body;
        const existingRole = await checkRoleExistence(idRol);

        if (existingRole.length > 0) {
          return res.status(400).json({ message: 'El rol ya existe.' });
         
        }

        const result = await createRole(idRol, nombreRol);
        return res.status(201).json({ message: 'Rol creado con éxito', result });

      case 'getRoles':
        
        const roles = await getAllRoles();
        return res.status(200).json(roles);

      case 'getNextIdPersona':
        
        const nextId = await getNextIdPersonaModel();
        return res.status(200).json({ nextIdPersona: nextId });

      case 'getDistrictos':
        
        const distritos = await getDistrictos();
        return res.status(200).json(distritos);

        case 'createPersona': {
          const { 
            Id_Personal, 
            DNICC, 
            Nombre_Completo, 
            Fecha_Nacimiento, 
            Sexo, 
            Domicilio, 
            Correo, 
            Celular, 
            Id_Rol, 
            Foto, 
            Id_Distrito, 
            FingerPrint, 
            Estado_Personal 
          } = req.body;
        
          console.log('Datos recibidos:', req.body);
        
          
          const existingDNI = await checkDNIExistence(DNICC);
          if (existingDNI.length > 0) {
            return res.status(400).json({ message: 'El Numero de Documento ya está registrado.' });
          }
        
          const existingCorreo = await checkCorreoExistence(Correo);
          if (existingCorreo.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado.' });
          }
        
          if (!/^\d{8,12}$/.test(DNICC)) {
            return res.status(400).json({ message: 'El DNI no es válido.' });
          }
        
          if (!Nombre_Completo || Nombre_Completo.trim().length === 0) {
            return res.status(400).json({
              message: 'El campo Nombre no puede estar vacío.'
            });
          }
        
          if (Nombre_Completo.length < 5) {
            return res.status(400).json({ message: 'El Nombre debe tener al menos 5 caracteres.' });
          }
        
          if (Fecha_Nacimiento === '') {
            return res.status(400).json({ message: 'Seleccione la Fecha de Nacimiento.' });
          }
        
          if (Celular === '') {
            return res.status(400).json({ message: 'Ingrese su Número de Celular.' });
          } else if (Celular.length < 10) {
            return res.status(400).json({ message: 'El Número de Celular debe Tener al Menos 10 Dígitos.' });
          }
        
          if (Sexo === '' || Sexo === 'Seleccionar sexo...') {
            return res.status(400).json({ message: 'Seleccione un sexo válido del menú desplegable.' });
          }
        
          if (Id_Rol === '' || Id_Rol === 'Seleccionar rol...') {
            return res.status(400).json({ message: 'Seleccione un Tipo de Rol.' });
          }
        
          if (Id_Distrito === '' || Id_Distrito === 'Seleccionar ciudad...') {
            return res.status(400).json({ message: 'Seleccione una Ciudad.' });
          }
        
          const em = /^[a-zA-Z0-9._%+-]+@(?:gmail\.com|hotmail\.com|yahoo\.com|outlook\.com)$/;
        
          if (!Correo) {
            return res.status(400).json({ message: 'El campo Correo no puede estar vacío.' });
          } else if (!em.test(Correo)) {
            return res.status(400).json({ message: 'El correo no tiene un formato válido o el dominio no está permitido.' });
          }
        
          
          const resultPersona = await createPersona({
            Id_Personal,
            DNICC,
            Nombre_Completo,
            Fecha_Nacimiento,
            Sexo,
            Domicilio,
            Correo,
            Celular,
            Id_Rol,
            Foto,
            Id_Distrito,
            FingerPrint,
            Estado_Personal
          });
        
          return res.status(201).json({ message: 'Registro Exitoso' });
        }
        
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
  };


export const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ninguna imagen.' });
    }

    
    const imageUrl = `/uploads/${req.file.filename}`;  
    
    

    res.status(200).json({ message: 'Imagen cargada exitosamente', file: req.file, imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al cargar la imagen.' });
  }
};





