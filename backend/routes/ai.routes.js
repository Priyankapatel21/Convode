import { Router } from 'express';
import * as aiController from '../controllers/ai.controller.js';
const router = Router();

router.post('/get-result', aiController.getResult);

export default router;