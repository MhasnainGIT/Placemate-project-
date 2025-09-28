import mongoose from "mongoose";

const eligibilitySchema = new mongoose.Schema({
    isEligible: { type: Boolean, default: false },
    reasons: [{ type: String }],
    checkedAt: { type: Date },
});

const mentorApprovalSchema = new mongoose.Schema({
    status: { type: String, enum: ['auto_approved', 'pending_review', 'approved', 'rejected'], default: 'pending_review' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    notes: { type: String }
});

const interviewSchema = new mongoose.Schema({
    date: { type: Date },
    mode: { type: String, enum: ['in_person', 'online', 'phone'], default: 'online' },
    location: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    remindersSent: { type: Number, default: 0 }
});

const supervisorFeedbackSchema = new mongoose.Schema({
    supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comments: { type: String },
    submittedAt: { type: Date }
});

const certificateSchema = new mongoose.Schema({
    url: { type: String },
    issuedAt: { type: Date },
    issuer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'under_review', 'accepted', 'rejected', 'interview_scheduled', 'selected', 'onboarded', 'completed'],
        default: 'pending'
    },
    eligibility: { type: eligibilitySchema, default: {} },
    mentorApproval: { type: mentorApprovalSchema, default: {} },
    interview: { type: interviewSchema, default: {} },
    supervisorFeedback: { type: supervisorFeedbackSchema, default: {} },
    certificate: { type: certificateSchema, default: {} }
}, { timestamps: true });

export const Application = mongoose.model("Application", applicationSchema);