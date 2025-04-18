import express from 'express'
const router=express.Router();
import{branchController}  from '../controller/branchController.js'
import { authenticateToken } from '../middleware/authMiddleware.js';

router.get(`/list/:creator_id/:repo_name`,authenticateToken,branchController.getAllByRepository);
router.post(`/create/:creator_id/:repo_name`,authenticateToken,branchController.create)
export default router;