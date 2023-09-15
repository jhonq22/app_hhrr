const db = require('../database/db');

// Obtener todos los registros
exports.getAllOrganigrama = (req, res) => {
  db.query('SELECT * FROM organigrama', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de organigrama.' });
    }
    res.json(results.rows);
  });
};

// Obtener documentos por organigrama
exports.getDocumentosOrganigrama = async (req, res) => {
  const organigramaId = req.query.organigrama_id;

  const sql = `
    SELECT documentos.*
    FROM documentos
    INNER JOIN organigrama ON documentos.organigrama_id = organigrama.id
    WHERE organigrama.id = $1;
  `;

  try {
    const { rows } = await db.query(sql, [organigramaId]);
    res.json(rows);
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ error: 'Error al obtener los documentos' });
  }
};

// Crear un nuevo registro
exports.createOrganigrama = async (req, res) => {
  const { codigo, descripcion, padre, estado } = req.body;
  const sql = 'INSERT INTO organigrama (codigo, descripcion, padre, estado) VALUES ($1, $2, $3, $4)';

  try {
    const { rowCount } = await db.query(sql, [codigo, descripcion, padre, estado]);
    if (rowCount === 1) {
      res.json({ message: 'Registro de organigrama creado con éxito.' });
    } else {
      res.status(500).json({ message: 'Error al crear un nuevo registro de organigrama.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear un nuevo registro de organigrama.' });
  }
};

exports.getOrganigramaById = async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM organigrama WHERE id = $1';

  try {
    const { rows } = await db.query(sql, [id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Organigrama no encontrado.' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el organigrama por ID.' });
  }
};


// Actualizar un registro existente
exports.updateOrganigrama = async (req, res) => {
  const { id } = req.params;
  const { codigo, descripcion, padre, estado } = req.body;
  const sql = 'UPDATE organigrama SET codigo = $1, descripcion = $2, padre = $3, estado = $4 WHERE id = $5';

  try {
    const { rowCount } = await db.query(sql, [codigo, descripcion, padre, estado, id]);
    if (rowCount === 1) {
      res.json({ message: 'Registro de organigrama actualizado con éxito.' });
    } else {
      res.status(500).json({ message: 'Error al actualizar el registro de organigrama.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el registro de organigrama.' });
  }
};

// Borrar un registro
exports.deleteOrganigrama = async (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM organigrama WHERE id = $1';

  try {
    const { rowCount } = await db.query(sql, [id]);
    if (rowCount === 1) {
      res.json({ message: 'Registro de organigrama eliminado con éxito.' });
    } else {
      res.status(500).json({ message: 'Error al borrar el registro de organigrama.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al borrar el registro de organigrama.' });
  }
};