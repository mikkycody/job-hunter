import express from "express";
import HashtagController from "../controllers/hashtagsController"

const router = express.Router();
router.get('/api/v1/hashtags', HashtagController.getHashtags);
export default router;
