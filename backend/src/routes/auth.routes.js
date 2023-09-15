import { Router } from "express";
const authController = require('../controllers/auth.controller');

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
//crud
router.get('/usuarios', authController.getUsuarios);
router.get('/usuarios/:id', authController.getUser);
router.put('/usuarios/:id', authController.editUsuario);

export default router;
