import express from 'express';
// import path from "path";
import authRoutes from './authRoutes';
import jobRoutes from './jobsRoutes';
import interviewsRoutes from './interviewsRoutes';
import hashtagRoute from './hashtagsRoutes';
import languageRoutes from './languagesRoutes';
import userRoutes from './userRoutes';
import affiliateRoutes from './affiliateRoutes';
import uploadRoutes from './uploadRoutes';
import statsRoutes from './statsRoutes';
import adminRoutes from './adminRoutes';
import miscellaneousRoutes from './miscellaneousRoutes';
import mailingRoutes from './mailingRoutes';
import bugRoutes from './bugRoutes';

const router = express.Router();

router.get('/api/v1', (req, res) => {
  res.status(200).json({
    status: 'Success',
    message: 'Welcome to Job Hunter Api v1.0.0',
  });
});

// router.get("/api/v1/apidocs", (req, res) => {
//   res.sendFile(path.join(__dirname, "/../../api-spec.json"));
// });

router.use(authRoutes);
router.use(jobRoutes);
router.use(hashtagRoute);
router.use(languageRoutes);
router.use(userRoutes);
router.use(interviewsRoutes);
router.use(affiliateRoutes);
router.use(uploadRoutes);
router.use(statsRoutes);
router.use(adminRoutes);
router.use(miscellaneousRoutes);
router.use(mailingRoutes);
router.use(bugRoutes);

export default router;
