import { authenticateToken } from "../middleware/authMiddleware.js";
import { fetchAllFiles,createFile } from "../controller/fileController.js";
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });
import express from 'express';
const router= express.Router();

router.get('/all/:creator_id/:repo_name/:branch_name/',authenticateToken,fetchAllFiles);
router.post(
    '/save/:creator_id/:repo_name/:branch_name/',
    authenticateToken,
    upload.single('file'), // this handles the incoming file
    createFile
  );
  
export default router;