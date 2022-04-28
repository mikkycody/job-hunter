import express from 'express';
import InterviewController from '../controllers/interviewsController';
import checkValidToken from '../middlewares/checkToken';

const router = express.Router();

router.post('/api/v1/calendly-webhook', InterviewController.webhook);
router.get(
  '/api/v1/interviews',
  checkValidToken,
  InterviewController.getInterviews
);

export default router;
