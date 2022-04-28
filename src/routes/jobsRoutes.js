import express from "express";
import JobController from "../controllers/jobsController";
import checkValidToken from "../middlewares/checkToken";
import isEmployer from '../middlewares/isEmployer';

const router = express.Router();

router.post('/api/v1/jobs', isEmployer, JobController.createJob);
router.put('/api/v1/jobs/:id', isEmployer, JobController.updateJob);
router.get("/api/v1/jobs/:id", JobController.getJob);
router.get("/api/v1/jobs", JobController.getJobs);
router.get('/api/v1/featured-jobs', JobController.getFeaturedJobs);
router.delete('/api/v1/jobs/:id', isEmployer, JobController.deleteJob);
router.post('/api/v1/jobs/:id/promote', isEmployer, JobController.promoteJob);
router.post('/api/v1/applications/:id/pay-for-campaign', isEmployer, JobController.payForCampaign);
router.post('/api/v1/jobs/promote/stripe-webhook', JobController.promoteJobStripeWebhook);
router.post('/api/v1/jobs/promote/coinbase-webhook', JobController.promoteJobCoinbaseWebhook);
router.get('/api/v1/job-categories', JobController.getCategories);
router.get('/api/v1/job-subcategories/:id', JobController.getSubCategoriesById);
router.get('/api/v1/job-subcategories', JobController.getSubCategories);
router.post('/api/v1/jobs-filter', JobController.filterJobs);
router.get('/api/v1/jobs-search', JobController.searchJobs);
router.post('/api/v1/job-applications/:id', checkValidToken, JobController.applyToJob);
router.get('/api/v1/job-applications/:id', isEmployer, JobController.jobApplications);
router.get('/api/v1/job-applications', isEmployer, JobController.allJobApplications);
router.get('/api/v1/applications/:id', isEmployer, JobController.getApplication);
router.put('/api/v1/applications/:id', isEmployer, JobController.updateApplication);
router.post('/api/v1/bookmarks/:id', checkValidToken, JobController.bookmarkJob);
router.delete('/api/v1/delete-bookmark/:id', checkValidToken, JobController.deleteBookmarkedJob);
router.get('/api/v1/bookmarks', checkValidToken, JobController.getBookmarkedJobs);
router.get('/api/v1/bookmarks-count', checkValidToken, JobController.getBookmarkedJobsCount);
router.get('/api/v1/applied-jobs', checkValidToken, JobController.appliedJobs);

export default router;