import express from "express";
import { repositoryController } from "../controller/repositoryController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router=express.Router();

router.post('/create', authenticateToken, repositoryController.create);
router.get('/all', authenticateToken, repositoryController.getAll);
router.get('/get/:id', authenticateToken, repositoryController.getById);
router.put('/update/:id', authenticateToken, repositoryController.update);
router.delete('/delete/:id', authenticateToken, repositoryController.delete);

export default router;