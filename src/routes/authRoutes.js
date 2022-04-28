import express from "express";
import AuthController from "../controllers/authController";

const router = express.Router();

router.post("/api/v1/auth/signup", AuthController.signupUser);
router.post("/api/v1/auth/signin", AuthController.loginUser);
router.post('/api/v1/auth/verify/:confirmationCode', AuthController.verifyUser);
router.post('/api/v1/auth/resend-verification-email', AuthController.resendVerificationEmail);
router.post('/api/v1/auth/reset-password', AuthController.resetPassword);
router.post('/api/v1/auth/change-password', AuthController.changePassword);

export default router;
