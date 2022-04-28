import express from "express";
import StatController from '../controllers/statController';
import checkValidToken from '../middlewares/checkToken';
import isEmployer from '../middlewares/isEmployer';
import isAdmin from '../middlewares/isAdmin';

const router = express.Router();

router.get('/api/v1/homepage-stats', StatController.homepage);
router.get('/api/v1/candidate-dashboard-stats', checkValidToken, StatController.candidateDashboard);
router.get('/api/v1/applied-jobs-stats', checkValidToken, StatController.appliedJobs);
router.get('/api/v1/affiliates-stats', checkValidToken, StatController.affiliates);

router.get('/api/v1/employer-dashboard-stats', isEmployer, StatController.employerDashboard);

router.get('/api/v1/admin-dashboard-stats', isAdmin, StatController.adminDashboard);


export default router;
