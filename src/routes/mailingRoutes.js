import express from 'express';
import MailingController from '../controllers/mailingController';
import isEmployer from '../middlewares/isEmployer';

const router = express.Router();

router.post('/api/v1/mailing-list/send-mail', isEmployer, MailingController.sendMail);
router.get('/api/v1/mailing-list', isEmployer, MailingController.getList);

export default router;