const multer = require('multer');
const path = require('path');

// Configura el almacenamiento para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './imagenes'); // Guarda las imágenes en la carpeta "imagenes"
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Nombrado único para evitar colisiones
  }
});

// Inicializa multer
const upload = multer({ storage: storage });

module.exports = upload;
