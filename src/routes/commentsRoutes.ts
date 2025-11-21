import { Router } from 'express';
import * as commentsController from '../controllers/commentsController';
import { ensureAuthenticated } from '../middlewares/authGuard';

const router = Router();

router.post('/', ensureAuthenticated, commentsController.addComment);
router.get('/:id', commentsController.getComment);
router.put('/:id', ensureAuthenticated, commentsController.editComment);
router.delete('/:id', ensureAuthenticated, commentsController.deleteComment);

export default router;
