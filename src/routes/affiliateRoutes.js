import express from 'express';
import AffiliateController from '../controllers/affiliateController';
import checkValidToken from '../middlewares/checkToken';

const router = express.Router();

router.get('/api/v1/affiliates', checkValidToken, AffiliateController.getAffiliates);
router.get('/api/v1/affiliates/payments', checkValidToken, AffiliateController.getAffiliatesPayment);
router.get('/api/v1/affiliates/balance', checkValidToken, AffiliateController.getBalance);

export default router;