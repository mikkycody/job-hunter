import express from "express";
import UserController from "../controllers/userController";
import WithdrawalController from "../controllers/withdrawalController";
import checkValidToken from '../middlewares/checkToken';

const router = express.Router();

router.delete('/api/v1/user/resume/:id', checkValidToken, UserController.deleteResume);

router.get('/api/v1/user/work-experiences/', checkValidToken, UserController.getWorkExperiences);
router.post('/api/v1/user/work-experiences/', checkValidToken, UserController.addWorkExperience);
router.put('/api/v1/user/work-experiences/:id', checkValidToken, UserController.updateWorkExperience);
router.delete('/api/v1/user/work-experiences/:id', checkValidToken, UserController.deleteWorkExperience);

router.get('/api/v1/user/educational-background/', checkValidToken, UserController.getEducation);
router.post('/api/v1/user/educational-background/', checkValidToken, UserController.addEducation);
router.put('/api/v1/user/educational-background/:id', checkValidToken, UserController.updateEducation);
router.delete('/api/v1/user/educational-background/:id', checkValidToken, UserController.deleteEducation);


router.put('/api/v1/user/update', checkValidToken, UserController.updateUser);
router.post('/api/v1/user/update-password', checkValidToken, UserController.updatePassword);
router.post('/api/v1/user/setup-sub-account', checkValidToken, UserController.setupSubAccount);
router.post('/api/v1/user/resend-account-link', checkValidToken, UserController.resendAccountLink);
router.post('/api/v1/user/validate-sub-account', checkValidToken, UserController.updateSubAccount);
router.post('/api/v1/user/withdraw', checkValidToken, WithdrawalController.makeWithdrawal);
router.get('/api/v1/user/withdrawals/all', checkValidToken, WithdrawalController.allWithdrawals);
router.get('/api/v1/user/:username', checkValidToken, UserController.getUser);


export default router;
