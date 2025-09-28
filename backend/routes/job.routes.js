import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";
import requireRole from "../middlewares/requireRole.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, requireRole('recruiter', 'placement_cell_staff'), postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, requireRole('recruiter', 'placement_cell_staff'), getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);

export default router;
