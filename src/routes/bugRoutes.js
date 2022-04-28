import express from 'express';
import BugController from '../controllers/bugController';

const router = express.Router();

router.post('/api/v1/report-bug', BugController.storeBug);

export default router;