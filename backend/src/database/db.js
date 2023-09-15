const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin',
  host: '172.16.0.65',
  database: 'app_higiene',
  password: '12345',
  port: 5432,
});

// Agrega un evento 'error' para manejar errores de conexión
pool.on('error', (err) => {
  console.error('Error de conexión a la base de datos:', err);
  process.exit(-1); // Termina la aplicación en caso de error
});

// Agrega un evento 'connect' para verificar la conexión exitosa
pool.on('connect', () => {
  console.log('Conexión a la base de datos exitosa');
});

module.exports = pool;
