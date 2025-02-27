import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';  // Importamos bcrypt

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Sena2024',
  database: '',  
});

console.log(">> DB Connect");

const tableCreationScripts = [
  `CREATE TABLE IF NOT EXISTS Horario (
    Id_Hor char(4) NOT NULL,
    HoraEntrada DATETIME,
    MiTolerancia DATETIME,
    HoraLimite DATETIME,
    HoraSalida DATETIME,
    PRIMARY KEY (Id_Hor)
  ) ENGINE=INNODB;`,

  `CREATE TABLE IF NOT EXISTS Rol (
    Id_Rol char(7) NOT NULL,
    NomRol VARCHAR(50),
    PRIMARY KEY (Id_Rol)
  ) ENGINE=INNODB;`,

  `CREATE TABLE IF NOT EXISTS TipoDoc (
    IdTipo INT NOT NULL,
    NombreTipo VARCHAR(50),
    Serie VARCHAR(3),
    Numero_D VARCHAR(5),
    PRIMARY KEY (IdTipo)
  ) ENGINE=INNODB;`,

  `CREATE TABLE IF NOT EXISTS Distrito (
    Id_Distrito char(7) NOT NULL,
    Distrito VARCHAR(50) NOT NULL,
    PRIMARY KEY (Id_Distrito)
  ) ENGINE=INNODB;`,

  `CREATE TABLE IF NOT EXISTS Pusuario (
    Id_usuario char(8) NOT NULL,
    Nombre_Completo VARCHAR(150) NOT NULL,
    Avatar VARCHAR(250) NOT NULL,
    Nombre_Usuario VARCHAR(8) NOT NULL,
    Passwords VARCHAR(200),
    Estado_Usuario VARCHAR(15),
    Id_Rol char(7) NOT NULL,
    PRIMARY KEY (Id_usuario),
    FOREIGN KEY (Id_Rol) REFERENCES Rol(Id_Rol)
  ) ENGINE=INNODB;`,

  `CREATE TABLE IF NOT EXISTS Personal (
    Id_Personal char(12) NOT NULL,
    DNICC char(10) NOT NULL,
    Nombre_Completo VARCHAR(150) NOT NULL,
    Fecha_Nacimiento DATE,
    Sexo char(1),
    Domicilio VARCHAR(120),
    Correo VARCHAR(50),
    Celular VARCHAR(11),
    Id_Rol char(7) NOT NULL,
    Foto VARCHAR(50),
    Id_Distrito char(7) NOT NULL,
    FingerPrint VARBINARY(2500),
    Estado_Personal VARCHAR(20),
    PRIMARY KEY (Id_Personal),
    FOREIGN KEY (Id_Rol) REFERENCES Rol(Id_Rol),
    FOREIGN KEY (Id_Distrito) REFERENCES Distrito(Id_Distrito)
  ) ENGINE=INNODB;`,

  `CREATE TABLE IF NOT EXISTS Justificacion (
    Id_Justificacion char(12) NOT NULL,
    Id_Personal char(12) NOT NULL,
    PrincipalMotivo VARCHAR(50),
    Detalle_Justificacion VARCHAR(500) NOT NULL,
    Fecha_Justificacion DATE,
    EstadoJustificacion VARCHAR(50),
    FechaEmision DATE,
    PRIMARY KEY (Id_Justificacion),
    FOREIGN KEY (Id_Personal) REFERENCES Personal(Id_Personal)
  ) ENGINE=INNODB;`,

  `CREATE TABLE IF NOT EXISTS AsistenciaPersonal (
    Id_Asistencia char(50) NOT NULL,
    Id_Personal char(12) NOT NULL,
    Fecha_Asistencia DATE,
    Nombre_Dia VARCHAR(12) NOT NULL,
    Hora_Ingreso VARCHAR(10) NOT NULL,
    Hora_Salida VARCHAR(10) NOT NULL,
    Tardanzas REAL NOT NULL,
    Total_HoraTrabajadas REAL NOT NULL,
    Justificacion VARCHAR(350),
    Estado_Asistencia BIT NULL,
    PRIMARY KEY (Id_Asistencia),
    FOREIGN KEY (Id_Personal) REFERENCES Personal(Id_Personal)
  ) ENGINE=INNODB;`
];

const colombianCities = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
  'Cúcuta', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Manizales',
  'Ibagué', 'Soledad', 'Villavicencio', 'Neiva', 'Valledupar',
  'San Andrés', 'Popayán', 'Risaralda', 'Montería', 'Armenia',
  'Quibdó', 'Pasto', 'Tunja', 'Sincelejo', 'San José del Guaviare'
];

const roles = [
  { id: 'ROLADM', name: 'Administrador' },
  { id: 'ROLUSR', name: 'Usuario' }
];

export const connectBD = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión exitosa a MySQL');

    const [rows] = await connection.query(`SHOW DATABASES LIKE 'sistema_asistencia';`);
    if (rows.length === 0) {
      await connection.query('CREATE DATABASE sistema_asistencia;');
      console.log('Base de datos sistema_asistencia creada.');
    }

    await connection.changeUser({ database: 'sistema_asistencia' });

    // Crear tablas
    for (const script of tableCreationScripts) {
      await connection.query(script);
    }

    // Insertar ciudades si no existen
    for (const city of colombianCities) {
      const [existingCity] = await connection.query(
        'SELECT 1 FROM Distrito WHERE Distrito = ? LIMIT 1', [city]
      );
      if (existingCity.length === 0) {
        const insertDistritoScript = `
          INSERT INTO Distrito (Id_Distrito, Distrito)
          VALUES (?, ?)
        `;
        const idDistrito = `D${('00000' + (colombianCities.indexOf(city) + 1)).slice(-6)}`;
        await connection.query(insertDistritoScript, [idDistrito, city]);
      } 
    }

    // Insertar roles si no existen
    for (const role of roles) {
      const [existingRole] = await connection.query(
        'SELECT 1 FROM Rol WHERE Id_Rol = ? LIMIT 1', [role.id]
      );
      if (existingRole.length === 0) {
        const insertRoleScript = `
          INSERT INTO Rol (Id_Rol, NomRol)
          VALUES (?, ?)
        `;
        await connection.query(insertRoleScript, [role.id, role.name]);
      } 
    }

    // Verificar si la tabla Pusuario está vacía
    const [users] = await connection.query('SELECT COUNT(*) AS total FROM Pusuario');
    if (users[0].total === 0) {
      const insertAdminScript = `
        INSERT INTO Pusuario (Id_usuario, Nombre_Completo, Avatar, Nombre_Usuario, Passwords, Estado_Usuario, Id_Rol)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      
      const passwordHash = await bcrypt.hash('UserAdmin', 10);

      const idUsuario = '1'; 
      await connection.query(insertAdminScript, [idUsuario, 'Administrador', 'default-avatar.png', 'Admin', passwordHash, 'Activo', 'ROLADM']);
      console.log('Usuario administrador (UserAdmin) agregado a la base de datos.');
    } else {
      console.log('La tabla Pusuario ya tiene registros, no se insertó el administrador.');
      
    }

    connection.release(); 
  } catch (error) {
    console.error('Error al conectar o crear la base de datos:', error);
    throw error; 
  }
};

export default pool;
