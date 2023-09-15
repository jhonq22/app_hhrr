import { Router } from "express";
const estatusController = require('../controllers/estatus.controller');

const router = Router();


//router.get("/:id", EstatusController.getEstatu);


// Obtener todos los registros de estatus
router.get('/', estatusController.getAllEstatus);

// Crear un nuevo registro de estatus
router.post('/', estatusController.createEstatus);

// Actualizar un registro de estatus existente
router.put('/:id', estatusController.updateEstatus);

// Borrar un registro de estatus
router.delete('/:id', estatusController.deleteEstatus);


export default router;
