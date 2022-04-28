import express from "express";
import LanguageController from '../controllers/languageController';
import checkValidToken from '../middlewares/checkToken';

const router = express.Router();
router.get('/api/v1/languages', checkValidToken, LanguageController.getLanguages);
export default router;
