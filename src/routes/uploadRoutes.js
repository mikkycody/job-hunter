import express from "express";
import UploadController from "../controllers/uploadController";
import checkValidToken from '../middlewares/checkToken';

const router = express.Router();

router.post('/api/v1/upload-file', checkValidToken, UploadController.upload);

export default router;
