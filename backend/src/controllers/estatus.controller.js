const db = require('../database/db');

// Obtener todos los registros de estatus
exports.getAllEstatus = (req, res) => {
  db.query('SELECT * FROM public.estatus', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener los registros de estatus.' });
    }
    res.json(results.rows);
  });
};

// Crear un nuevo registro de estatus
exports.createEstatus = (req, res) => {
  const { nombre_estatus, estado } = req.body;
  const sql = 'INSERT INTO public.estatus (nombre_estatus, estado) VALUES ($1, $2)';
  db.query(sql, [nombre_estatus, estado], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al crear un nuevo registro de estatus.' });
    }
    res.json({ message: 'Registro de estatus creado con éxito.', id: result.rows[0].id });
  });
};

// Actualizar un registro de estatus existente
exports.updateEstatus = (req, res) => {
  const { id } = req.params;
  const { nombre_estatus, estado } = req.body;
  const sql = 'UPDATE public.estatus SET nombre_estatus=$1, estado=$2 WHERE id=$3';
  db.query(sql, [nombre_estatus, estado, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al actualizar el registro de estatus.' });
    }
    res.json({ message: 'Registro de estatus actualizado con éxito.' });
  });
};

// Borrar un registro de estatus
exports.deleteEstatus = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM public.estatus WHERE id=$1';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al borrar el registro de estatus.' });
    }
    res.json({ message: 'Registro de estatus eliminado con éxito.' });
  });
};