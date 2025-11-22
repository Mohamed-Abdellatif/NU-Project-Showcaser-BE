import { Router } from 'express';
import { uploadImage, uploadVideo } from '../config/multer';
import * as uploadController from '../controllers/uploadController';
import { handleMulterError } from '../middlewares/multerErrorHandler';
import { ensureAuthenticated } from '../middlewares/authGuard';

const router = Router();

// Image route supports both single and multiple files (up to 10 files)
router.post('/image', uploadImage.array('file', 10), handleMulterError, ensureAuthenticated, uploadController.uploadImage);
router.post('/video', uploadVideo.single('file'), handleMulterError, ensureAuthenticated, uploadController.uploadVideo);

export default router;

