import { Router } from "express";
const tipoDocumentosController = require('../controllers/tipo_documentos.controller');

const router = Router();

// Obtener todos los tipos de documento
router.get('/', tipoDocumentosController.getAllTipoDocumentos);

// Crear un nuevo tipo de documento
router.post('/', tipoDocumentosController.createTipoDocumento);

// Actualizar un tipo de documento existente
router.put('/:id', tipoDocumentosController.updateTipoDocumento);

// Borrar un tipo de documento
router.delete('/:id', tipoDocumentosController.deleteTipoDocumento);

// Obtener un tipo de documento por su ID
router.get('/:id', tipoDocumentosController.getTipoDocumentoById);

export default router;