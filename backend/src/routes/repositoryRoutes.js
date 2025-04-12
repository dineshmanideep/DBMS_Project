import express from "express";
import { repositoryController } from "../controller/repositoryController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router=express.Router();

router.post('/create', authenticateToken, repositoryController.create);
router.get('/all', authenticateToken, repositoryController.getAll);
router.get('/specific/:user_id',authenticateToken,repositoryController.getPersonalRepo);
router.get('/get/:creator_id/:repo_name', authenticateToken, repositoryController.getById);
router.put('/:creator_id/:repo_name', authenticateToken, repositoryController.update);
router.delete('/:creator_id/:repo_name', authenticateToken, repositoryController.delete);
export default router;