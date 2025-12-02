import { Router } from 'express';
import * as notifyController from '../controllers/notifyController';

const router = Router();

router.post('/send-mail', notifyController.sendMail);

export default router;

