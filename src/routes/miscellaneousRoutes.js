import express from "express";
import CompanyController from "../controllers/companyController";
import MessagesController from '../controllers/messagesController';
import checkValidToken from '../middlewares/checkToken';

const router = express.Router();

router.get('/api/v1/companies', CompanyController.getCompanies);
router.get('/api/v1/companies', CompanyController.getCompanies);
router.get('/api/v1/conversations', checkValidToken, MessagesController.getConversations);

export default router;
