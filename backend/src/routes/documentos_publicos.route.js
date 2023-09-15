import { Router } from "express";
const documentosPublicosController = require('../controllers/documentos_publicos.controller');
const path = require('path');

const router = Router();


router.post('/subir-archivo', documentosPublicosController.subirArchivo);
router.get('/listado', documentosPublicosController.listarDocumentos);

// Configura una ruta para acceder a los archivos como una API
router.get('/archivos/:nombreArchivo', (req, res) => {
    const nombreArchivo = req.params.nombreArchivo;
    const rutaArchivo = path.join(__dirname, '..', 'uploads/publicos', nombreArchivo); // Utiliza '..', 'uploads' para subir un nivel y entrar en la carpeta 'uploads'

  
    // Envía el archivo como respuesta
    res.sendFile(rutaArchivo);
  });


export default router;
