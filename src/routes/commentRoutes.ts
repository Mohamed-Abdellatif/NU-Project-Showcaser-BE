import { Router } from 'express';
import * as commentsController from '../controllers/commentController';
import { ensureAuthenticated } from '../middlewares/authGuard';
import { validateComment, validateCommentId } from '../middlewares/validationMiddleware';

const router = Router();

router.get('/project/:id', commentsController.getCommentsByProjectId);
router.post('/', ensureAuthenticated, validateComment, commentsController.addComment);
router.get('/:id', validateCommentId, commentsController.getComment);
router.put('/:id', ensureAuthenticated, validateCommentId, validateComment, commentsController.editComment);
router.delete('/:id', ensureAuthenticated, validateCommentId, commentsController.deleteComment);

export default router;
