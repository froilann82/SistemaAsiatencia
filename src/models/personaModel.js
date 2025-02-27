import pool from '../db.js';

export const getAllPersonas = async () => {
    const [personas] = await pool.query(`
      SELECT 
        p.Id_Personal,
        p.DNICC,
        p.Nombre_Completo,
        p.Fecha_Nacimiento,
        p.Sexo,
        p.Domicilio,
        p.Correo,
        p.Celular,
        p.Id_Rol,
        r.NomRol, -- Campo de la tabla rol
        p.Foto,
        p.Id_Distrito,
        p.FingerPrint,
        p.Estado_Personal
      FROM personal p
      INNER JOIN rol r ON p.Id_Rol = r.Id_Rol
    `);
  
    return personas;
};
