import { authenticateToken } from "../middleware/authMiddleware.js";
import { fetchAllFiles,createFile,updateFile,fetchFileByName,getFileHistory } from "../controller/fileController.js";
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });
import express from 'express';
const router= express.Router();

router.get('/all/:creator_id/:repo_name/:branch_name/',authenticateToken,fetchAllFiles);
router.get('/history/:creator_id/:repo_name/:branch_name/:file_name',authenticateToken,getFileHistory)
router.post(
    '/save/:creator_id/:repo_name/:branch_name/',
    authenticateToken,
    upload.single('file'), // this handles the incoming file
    createFile
  );

  router.get(
    '/get/:creator_id/:repo_name/:branch_name/:file_name/',
    authenticateToken,
    fetchFileByName
  );
  router.get(
    '/get/:creator_id/:repo_name/:branch_name/:file_name/:commit_id',
    authenticateToken,
    fetchFileByName
  );
  
  router.put(
    '/update/:creator_id/:repo_name/:branch_name/:file_name',
    authenticateToken,
    updateFile
  );
  
  
export default router;