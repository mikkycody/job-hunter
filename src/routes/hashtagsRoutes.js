import express from "express";
import HashtagController from "../controllers/hashtagsController"
import checkValidToken from '../middlewares/checkToken';

const router = express.Router();
router.get('/api/v1/hashtags', checkValidToken, HashtagController.getHashtags);
export default router;
