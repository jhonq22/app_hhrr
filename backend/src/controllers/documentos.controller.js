const pool = require('../database/db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('../database/db');

// Configurar Multer para guardar los archivos en una carpeta específica
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadDir = 'uploads'; // Nombre de la carpeta donde se guardarán los archivos
    const fullPath = path.join(__dirname, '..', uploadDir);

    // Crear la carpeta si no existe
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    callback(null, fullPath);
  },
  filename: (req, file, callback) => {
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

      const nombreDocumento = archivo.originalname.replace(/ /g, '_');
      const { organigrama_id, tipo_documento_id, estatus_id, nombre_documento, usuario_id } = req.body;

      const rutaDocumento = path.join('uploads', nombreDocumento);
      const fecha_registro = new Date();

      const insertQuery = `
        INSERT INTO documentos 
        (organigrama_id, tipo_documento_id, estatus_id, nombre_documento, ruta_documento, usuario_id, fecha_registro) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `;

      try {
        const result = await pool.query(insertQuery, [
          organigrama_id || null,
          tipo_documento_id || null,
          estatus_id || null,
          nombreDocumento || null,
          rutaDocumento || null,
          usuario_id || null,
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

const listarDocumentos = async (req, res) => {
  const rutaProyecto = __dirname;
  try {
    const consulta = `
      SELECT documentos.id, organigrama.descripcion, nombre_estatus, tipo_documento, nombre_documento, documentos.fecha_registro 
      FROM documentos
      LEFT JOIN organigrama ON organigrama_id = organigrama.id
      LEFT JOIN estatus ON estatus_id = estatus.id
      LEFT JOIN tipo_documentos ON tipo_documento_id = tipo_documentos.id
    `;

    const resultados = await pool.query(consulta);

    const documentosConRuta = resultados.rows.map((documento) => ({
      ...documento,
      ruta_documento: `${rutaProyecto}/${documento.ruta_documento}`,
    }));

    res.status(200).json(documentosConRuta);
  } catch (error) {
    console.error('Error al obtener la lista de documentos:', error);
    return res.status(500).json({ error: 'Error al obtener la lista de documentos' });
  }
};

module.exports = { subirArchivo, listarDocumentos };