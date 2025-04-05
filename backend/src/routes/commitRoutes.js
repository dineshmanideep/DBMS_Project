import express from 'express'
const router= express.Router();
import { getAllcommits } from '../controller/commitsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
router.get('/all/:creator_id/:repo_name/:branch_name/',authenticateToken,getAllcommits);


export default router;