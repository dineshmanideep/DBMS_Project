import express from 'express';
import { pullRequestController } from '../controller/pullRequestController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all pull requests for a repository
router.get('/list/:creator_id/:repo_name', 
  authenticateToken,
  pullRequestController.getAllPRs
);

// Create a new pull request
router.post('/create/:creator_id/:repo_name', 
  authenticateToken, 
  pullRequestController.createPR
);

router.get('/:pr_id/:creator_id/:repo_name', authenticateToken, pullRequestController.getPRById);
router.post('/:pr_id/:creator_id/:repo_name/review', authenticateToken, pullRequestController.createReview);

// // Get specific pull request details
// router.get('/:pr_id/:creator_id/:repo_name', 
//   authenticateToken,  
//   pullRequestController.getPRById
// );

// // Update pull request status (merge/close)
// router.put('/status/:pr_id/:creator_id/:repo_name', 
//   authenticateToken, 
//   pullRequestController.updatePRStatus
// );

export default router;