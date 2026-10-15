import { Router } from "express";
import UsuariosController from "./controllers/usuarios";
import PersonagensController from "./controllers/personagens";


const router = Router();

// Rota de login
router.post("/login", UsuariosController.login);

// Outras rotas de usuários
router.post("/usuarios", UsuariosController.create);
router.get("/usuarios", UsuariosController.list);
router.get("/usuarios/:id", UsuariosController.getById);
router.put("/usuarios/:id", UsuariosController.update);
router.delete("/usuarios/:id", UsuariosController.delete);

// Outras rotas de personagens
router.post("/personagens", PersonagensController.create);
router.get("/personagens", PersonagensController.list);
router.get("/personagens/:id", PersonagensController.getById);
router.put("/personagens/:id", PersonagensController.update);
router.delete("/personagens/:id", PersonagensController.delete);

export default router;