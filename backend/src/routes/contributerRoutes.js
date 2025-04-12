import express from 'express'
const router= express.Router();
import { authenticateToken } from '../middleware/authMiddleware.js';
import { addContributor, getAllContributers,getCurrentContributer, removeContributor, updateContributorRole } from '../controller/contributerController.js';
router.get('/:creator_id/:repo_name/me',authenticateToken,getCurrentContributer);
//for stats and all for contributers page
router.get('/all/:creator_id/:repo_name/',authenticateToken,getAllContributers);
router.post('/:creator_id/:repo_name/add',authenticateToken,addContributor);
router.put('/:creator_id/:repo_name/:user_id/role',authenticateToken,updateContributorRole);
router.delete('/:creator_id/:repo_name/:user_id',authenticateToken,removeContributor);


export default router;