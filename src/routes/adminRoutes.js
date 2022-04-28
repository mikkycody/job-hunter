import express from "express";
import JobController from "../controllers/admin/jobsController";
import UserController from "../controllers/admin/usersController";
import WithdrawController from '../controllers/admin/withdrawController';
import CompanyController from '../controllers/admin/companyController';
import BugController from '../controllers/admin/bugController';
import isAdmin from "../middlewares/isAdmin";

const router = express.Router()

router.get('/api/v1/admin/jobs/latest', isAdmin, JobController.latestJobs);
router.get('/api/v1/admin/jobs', isAdmin, JobController.allJobs);
router.get('/api/v1/admin/jobs/:id/applications', isAdmin, JobController.getApplicationsById);


router.get('/api/v1/admin/users/admins', isAdmin, UserController.getAdmins);
router.get('/api/v1/admin/users/employers', isAdmin, UserController.getEmployers);
router.get('/api/v1/admin/users/candidates', isAdmin, UserController.getCandidates);
router.get('/api/v1/admin/users/:id', isAdmin, UserController.getUser);
router.put('/api/v1/admin/users/:id', isAdmin, UserController.updateUser);

router.get('/api/v1/admin/withdrawals', isAdmin, WithdrawController.getWithdrawals);


router.get('/api/v1/admin/companies', isAdmin, CompanyController.getCompanies);
router.put('/api/v1/admin/companies/:id', isAdmin, CompanyController.updateCompany);
router.post('/api/v1/admin/companies', isAdmin, CompanyController.createCompany);
router.delete('/api/v1/admin/companies/:id', isAdmin, CompanyController.destroy);

router.get('/api/v1/admin/reported-bugs', isAdmin, BugController.getBugs);


export default router;