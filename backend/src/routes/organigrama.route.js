import { Router } from "express";
const organigramaController = require('../controllers/organigrama.controller');

const router = Router();

// Obtener todos los registros
router.get('/organigrama', organigramaController.getAllOrganigrama);
//obtener un registro

router.get('/organigrama/:id', organigramaController.getOrganigramaById);

// Crear un nuevo registro
router.post('/', organigramaController.createOrganigrama);

// Actualizar un registro existente
router.put('/organigrama/:id', organigramaController.updateOrganigrama);

// Borrar un registro
router.delete('/organigrama/:id', organigramaController.deleteOrganigrama);

router.get('/obtener-documentos', organigramaController.getDocumentosOrganigrama);



export default router;
