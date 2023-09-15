const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('../database/db');

// Configurar Multer para guardar los archivos en una carpeta específica
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadDir = 'uploads/publicos'; // Nombre de la carpeta donde se guardarán los archivos
    const fullPath = path.join(__dirname, '..', uploadDir);

    // Crear la carpeta si no existe
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    callback(null, fullPath);
  },
  filename: (req, file, callback) => {
    // callback(null, Date.now() + '-' + file.originalname); //Para guardar el archivo con fecha + nombre_archivo
    callback(null, file.originalname.replace(/ /g, '_'));
  },
});

// Configurar Multer para permitir cualquier tipo de archivo
const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    callback(null, true);
  },
}).single('archivo'); // Usar 'archivo' como el nombre del campo del formulario

const subirArchivo = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Error al subir el archivo:', err);
        return res.status(400).json({ error: 'Error al subir el archivo' });
      }

      const archivo = req.file;
      if (!archivo) {
        console.error('No se ha proporcionado un archivo válido');
        return res.status(400).json({ error: 'No se ha proporcionado un archivo válido' });
      }

      // Extrae el nombre original del archivo
      const nombreDocumento = archivo.originalname.replace(/ /g, '_');

      // Extrae los valores de los campos del formulario
      const { estatus_id, nombre_documento, usuario_id } = req.body;

      // Valida que los campos tengan valores definidos o establece null si son undefined
      const rutaDocumento = path.join('uploads/publicos', nombreDocumento); // Ruta del archivo guardado en el sistema de archivos
      const fecha_registro = new Date(); // Fecha de registro automática

      // Prepara la consulta SQL con parámetros
      const insertQuery = `
        INSERT INTO documentos_publicos
        (estatus_id, nombre_documento, ruta_documento, fecha_registro)
        VALUES ($1, $2, $3, $4)
      `;

      try {
        // Ejecuta la consulta SQL con los parámetros definidos
        const result = await db.query(insertQuery, [
          estatus_id || null,
          nombreDocumento || null,
          rutaDocumento || null,
          fecha_registro,
        ]);

        res.status(200).json({ mensaje: 'Archivo subido y registrado correctamente', documento: result.rows[0] });
      } catch (error) {
        console.error('Error al guardar en la base de datos:', error);
        return res.status(500).json({ error: 'Error al guardar en la base de datos' });
      }
    });
  } catch (error) {
    console.error('Error en la subida del archivo:', error);
    return res.status(500).json({ error: 'Error en la subida del archivo' });
  }
};

// Obtener la lista de documentos
const listarDocumentos = async (req, res) => {
  try {
    // Consulta SQL para obtener la lista de documentos
    const consulta = `
      SELECT dp.id, e.nombre_estatus, dp.nombre_documento, dp.fecha_registro, dp.ruta_documento
      FROM documentos_publicos dp
      LEFT JOIN estatus e ON dp.estatus_id = e.id
    `;

    // Ejecuta la consulta SQL
    const resultados = await db.query(consulta);

    // Agrega la ruta completa de acceso a cada archivo
    const documentosConRuta = resultados.rows.map((documento) => ({
      ...documento,
      ruta_documento: `${__dirname}/../${documento.ruta_documento}`, // Ruta dinámica
    }));

    // Retorna la lista de documentos con las rutas de acceso
    res.status(200).json(documentosConRuta);
  } catch (error) {
    console.error('Error al obtener la lista de documentos:', error);
    return res.status(500).json({ error: 'Error al obtener la lista de documentos' });
  }
};




module.exports = { subirArchivo, listarDocumentos };