import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

// helper: compute basic eligibility based on user's skills vs job requirements
const computeEligibility = (user, job) => {
    try {
        const userSkills = (user?.profile?.skills || []).map(s => (typeof s === 'string' ? s : s?.name)?.toLowerCase()).filter(Boolean);
        const reqs = (job?.requirements || []).map(r => String(r).toLowerCase());
        if (reqs.length === 0) {
            return { isEligible: true, reasons: ["No explicit requirements listed"] };
        }
        const missing = reqs.filter(r => !userSkills.some(s => r.includes(s) || s.includes(r)));
        return {
            isEligible: missing.length === 0,
            reasons: missing.length ? missing.map(m => `Missing: ${m}`) : ["All requirements satisfied"],
        };
    } catch (e) {
        return { isEligible: true, reasons: ["Eligibility fallback: unable to evaluate"] };
    }
}

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        // fetch applicant + compute eligibility
        const user = await User.findById(userId);
        const eligibility = computeEligibility(user, job);
        const autoApproved = eligibility.isEligible;
        // create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            status: autoApproved ? 'pending' : 'under_review',
            eligibility: { ...eligibility, checkedAt: new Date() },
            mentorApproval: { status: autoApproved ? 'auto_approved' : 'pending_review' }
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message: autoApproved ? "Job applied successfully (auto-approved)." : "Job applied successfully (pending mentor review).",
            success: true,
            applicationId: newApplication._id,
            eligibility
        })
    } catch (error) {
        console.log(error);
    }
};
export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            succees:true
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}

// New: check eligibility on demand
export const checkEligibility = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        const user = await User.findById(userId);
        if (!job || !user) {
            return res.status(404).json({ message: 'User or Job not found', success: false });
        }
        const eligibility = computeEligibility(user, job);
        return res.status(200).json({ success: true, eligibility });
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Failed to check eligibility' });
    }
}

// New: mentor approval endpoint
export const mentorApproval = async (req, res) => {
    try {
        const { decision, notes } = req.body; // decision: approved | rejected
        const applicationId = req.params.id;
        const application = await Application.findById(applicationId);
        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
        application.mentorApproval = {
            status: decision === 'approved' ? 'approved' : 'rejected',
            reviewedBy: req.id,
            reviewedAt: new Date(),
            notes
        };
        if (decision === 'approved' && application.status === 'under_review') {
            application.status = 'pending';
        } else if (decision === 'rejected') {
            application.status = 'rejected';
        }
        await application.save();
        return res.status(200).json({ success: true, message: 'Mentor decision recorded' });
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Failed to record mentor decision' });
    }
}

// New: schedule interview
export const scheduleInterview = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { date, mode, location } = req.body;
        const application = await Application.findById(applicationId);
        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
        application.interview = { date, mode, location, createdBy: req.id };
        application.status = 'interview_scheduled';
        await application.save();
        return res.status(200).json({ success: true, message: 'Interview scheduled' });
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Failed to schedule interview' });
    }
}

// New: supervisor feedback
export const submitFeedback = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { rating, comments } = req.body;
        const application = await Application.findById(applicationId);
        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
        application.supervisorFeedback = {
            supervisor: req.id,
            rating,
            comments,
            submittedAt: new Date()
        };
        await application.save();
        return res.status(200).json({ success: true, message: 'Feedback submitted' });
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Failed to submit feedback' });
    }
}

// New: issue certificate
export const issueCertificate = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { url } = req.body;
        const application = await Application.findById(applicationId);
        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
        application.certificate = { url, issuedAt: new Date(), issuer: req.id };
        application.status = 'completed';
        await application.save();
        return res.status(200).json({ success: true, message: 'Certificate issued' });
    } catch (e) {
        return res.status(500).json({ success: false, message: 'Failed to issue certificate' });
    }
}