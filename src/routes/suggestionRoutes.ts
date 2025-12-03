import { Router } from 'express';
import * as suggestionController from '../controllers/suggestionController';

const router = Router();

router.post('/', suggestionController.createSuggestion);
router.get('/all', suggestionController.getAllSuggestions);
router.get('/:id', suggestionController.getSuggestionById);

export default router;
