const mysql = require('mysql2');
import config from "./../config";

const db = mysql.createConnection({
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos exitosa');
  }
});

module.exports = db;
