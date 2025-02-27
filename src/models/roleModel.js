import pool from '../db.js'; 


export const getAllRoles = async () => {
  const [roles] = await pool.query('SELECT * FROM rol');
  return roles;
};

export const getDistrictos = async () => {
  const [districts] = await pool.query('SELECT * FROM distrito');
  return districts;
};


export const createRole = async (idRol, nombreRol) => {
  const [result] = await pool.query(
    'INSERT INTO rol (Id_Rol, NomRol) VALUES (?, ?)',
    [idRol, nombreRol]
  );
  return result;
};

export const checkRoleExistence = async (idRol) => {
  const [existingRole] = await pool.query('SELECT * FROM rol WHERE Id_Rol = ?', [idRol]);
  return existingRole;
};


export const getNextIdPersona = async () => {
  
  const [result] = await pool.query('SELECT MAX(CAST(id_personal AS UNSIGNED)) AS max_id FROM personal');
  
  
  const maxId = result[0].max_id || 0;
  
 
  const nextIdNum = maxId + 1;
  
  
  const formattedId = nextIdNum.toString().padStart(4, '0');
  
  return formattedId;
};




export const createPersona = async (personaData) => {
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
  } = personaData;

  
  const [result] = await pool.query(
    `INSERT INTO personal (Id_Personal, DNICC, Nombre_Completo, Fecha_Nacimiento, Sexo, Domicilio, Correo, Celular, Id_Rol, Foto, Id_Distrito, FingerPrint, Estado_Personal) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
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
    ]
  );
  
  return result;
};

export const checkDNIExistence = async (dni) => {
  const [result] = await pool.query('SELECT * FROM personal WHERE DNICC = ?', [dni]);
  return result;
};

export const checkCorreoExistence = async (correo) => {
  const [result] = await pool.query('SELECT * FROM personal WHERE Correo = ?', [correo]);
  return result;
};




