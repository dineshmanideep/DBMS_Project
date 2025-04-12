import express from 'express';
const router = express.Router();
import { authenticateToken } from '../middleware/authMiddleware.js';
import { 
    getAllIssues,
    createIssue,
    updateIssue,
    getIssueById
} from '../controller/issueController.js';

router.get('/:creator_id/:repo_name', authenticateToken, getAllIssues);
router.post('/:creator_id/:repo_name/create', authenticateToken, createIssue);
router.get('/:creator_id/:repo_name/:issue_id', authenticateToken, getIssueById);
router.put('/:creator_id/:repo_name/:issue_id', authenticateToken, updateIssue);
// router.get('/:creator_id/:repo_name/:issue_id', authenticateToken, getIssueById);

export default router;