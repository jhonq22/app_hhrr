const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = (req, res) => {
    // Obtener los datos del cuerpo de la solicitud
    
    const { cedula, nombres, apellidos, usuario, password, rol_id, estado } = req.body;
    
  
    // Hashear la contraseña antes de guardarla en la base de datos
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: 'Error interno' });
      }
  
      // Insertar el nuevo usuario en la base de datos
      
      const sql = 'INSERT INTO usuarios (cedula, nombres, apellidos, usuario, password, rol_id, estado) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.query(sql, [cedula, nombres, apellidos, usuario, hash, rol_id, estado], (err, result) => {
        if (err) {
          console.error('Error al registrar el usuario en la base de datos:', err);

          return res.status(500).json({ error: 'Error al registrar el usuario' });
        }
  
        return res.status(201).json({ message: 'Usuario registrado exitosamente' });
      });
    });
  };
  
  const login = (req, res) => {
    const { usuario, password } = req.body;
  
    // Consultar el usuario por nombre de usuario en la base de datos
    const sql = 'SELECT * FROM usuarios WHERE usuario = ?';
    db.query(sql, [usuario], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error interno' });
      }
  
      if (result.length === 0) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }
  
      const user = result[0];
  
      // Verificar la contraseña
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (err || !isValid) {
          return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
  
        // Generar un token JWT
        const token = jwt.sign(
          {
            cedula: user.cedula,
            usuario: user.usuario,
            rol_id: user.rol_id,
          },
          'w4186', // Cambia esto a una cadena secreta segura
          { expiresIn: '1h' }
        );
  
        return res.status(200).json({ token });
      });
    });
  };
  

  //CRUD de Usuarios
  const getUsuarios = (req, res) => {
    // Consultar la lista de usuarios en la base de datos
    const sql = 'SELECT * FROM usuarios';
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error al obtener la lista de usuarios:', err);
        return res.status(500).json({ error: 'Error interno' });
      }
      return res.status(200).json(result);
    });

  }


  //listar usuario por id
  const getUser = (req, res) => {
    const userId = req.params.id;
  
    // Realiza la consulta en la base de datos para obtener los datos del usuario por su ID
    const sql = 'SELECT * FROM usuarios WHERE id = ?';
  
    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.error('Error al obtener el usuario:', err);
        return res.status(500).json({ error: 'Error interno' });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      const usuario = result[0];
      return res.status(200).json(usuario);
    });
  };






      //Actualizar
      const editUsuario = (req, res) => {
        const userId = req.params.id;
        const { cedula, nombres, apellidos, usuario, password, rol_id, estado } = req.body;
      
        // Realiza la actualización en la base de datos
        const sql = `
          UPDATE usuarios
          SET cedula = ?, nombres = ?, apellidos = ?, usuario = ?, password = ?, rol_id = ?, estado = ?
          WHERE id = ?;
        `;
      
        db.query(
          sql,
          [cedula, nombres, apellidos, usuario, password, rol_id, estado, userId],
          (err, result) => {
            if (err) {
              console.error('Error al actualizar el usuario:', err);
              return res.status(500).json({ error: 'Error interno' });
            }
      
            return res.status(200).json({ message: 'Usuario actualizado exitosamente' });
          }
        );
      };
    





  module.exports = { register, login, getUsuarios,getUser, editUsuario };