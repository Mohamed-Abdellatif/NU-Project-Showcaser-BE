import { Router } from 'express';
import { login } from '../../src/controllers/userController';

//import { validateProject } from '../middlewares/validation.middleware';

const router = Router();

router.get('/login', login);


export default router;
