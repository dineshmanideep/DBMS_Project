import  express from 'express'
import {authenticateToken} from '../middleware/authMiddleware.js'
import {signup,login,getCurrentUser,logout} from '../controller/authController.js'
const router=express.Router();


router.post('/signup',signup);
router.post('/login',login);
router.get('/logout',authenticateToken,logout);
router.get('/me',authenticateToken,getCurrentUser);


export default router;