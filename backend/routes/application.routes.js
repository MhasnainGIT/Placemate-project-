import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus, checkEligibility, mentorApproval, scheduleInterview, submitFeedback, issueCertificate } from "../controllers/application.controller.js";
import requireRole from "../middlewares/requireRole.js";
 
const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);

// New endpoints for CPWO workflows
router.route("/eligibility/:id").get(isAuthenticated, requireRole('student'), checkEligibility);
router.route("/mentor-approval/:id").post(isAuthenticated, requireRole('placement_cell_staff'), mentorApproval);
router.route("/schedule/:id").post(isAuthenticated, requireRole('recruiter', 'placement_cell_staff'), scheduleInterview);
router.route("/feedback/:id").post(isAuthenticated, requireRole('placement_cell_staff', 'recruiter'), submitFeedback);
router.route("/certificate/:id").post(isAuthenticated, requireRole('placement_cell_staff'), issueCertificate);
 

export default router;
