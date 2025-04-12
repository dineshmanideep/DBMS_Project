import express from 'express';
const router = express.Router();
import { authenticateToken } from '../middleware/authMiddleware.js';
import { 
    updateUser,
    getUserById,
    deleteUser 
} from '../controller/userController.js';

router.put('/update/:user_id', authenticateToken, updateUser);
router.get('/:user_id', authenticateToken, getUserById);
router.delete('/delete/:user_id', authenticateToken, deleteUser);

export default router;