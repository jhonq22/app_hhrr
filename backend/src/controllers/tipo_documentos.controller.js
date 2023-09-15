const db = require('../database/db');

// Obtener todos los tipos de documento
exports.getAllTipoDocumentos = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM tipo_documentos');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los tipos de documento.' });
  }
};

// Crear un nuevo tipo de documento
exports.createTipoDocumento = async (req, res) => {
  const { tipo_documento,siglas_codigo, estado  } = req.body;
  const sql = 'INSERT INTO tipo_documentos (tipo_documento, siglas_codigo, estado) VALUES ($1, $2, $3)';

  try {
    const { rowCount } = await db.query(sql, [tipo_documento, siglas_codigo, estado,  ]);
    if (rowCount === 1) {
      res.json({ message: 'Tipo de documento creado con éxito.' });
    } else {
      res.status(500).json({ message: 'Error al crear un nuevo tipo de documento.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear un nuevo tipo de documento.' });
  }
};

// Actualizar un tipo de documento existente
exports.updateTipoDocumento = async (req, res) => {
  const { id } = req.params;
  const { tipo_documento, estado, siglas_codigo } = req.body;
  const sql = 'UPDATE tipo_documentos SET tipo_documento = $1, estado = $2, siglas_codigo = $3 WHERE id = $4';

  try {
    const { rowCount } = await db.query(sql, [tipo_documento, estado, siglas_codigo ,  id]);
    if (rowCount === 1) {
      res.json({ message: 'Tipo de documento actualizado con éxito.' });
    } else {
      res.status(500).json({ message: 'Error al actualizar el tipo de documento.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el tipo de documento.' });
  }
};

// Borrar un tipo de documento
exports.deleteTipoDocumento = async (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tipo_documentos WHERE id = $1';

  try {
    const { rowCount } = await db.query(sql, [id]);
    if (rowCount === 1) {
      res.json({ message: 'Tipo de documento eliminado con éxito.' });
    } else {
      res.status(500).json({ message: 'Error al borrar el tipo de documento.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al borrar el tipo de documento.' });
  }
};

// Obtener un tipo de documento por su ID
exports.getTipoDocumentoById = async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM tipo_documentos WHERE id = $1';

  try {
    const { rows } = await db.query(sql, [id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Tipo de documento no encontrado.' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el tipo de documento por ID.' });
  }
};