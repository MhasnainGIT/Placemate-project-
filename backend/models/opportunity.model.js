import mongoose from "mongoose";

// Schema for salary range
const salaryRangeSchema = new mongoose.Schema({
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    isDisclosed: { type: Boolean, default: false },
    period: { type: String, enum: ['monthly', 'yearly', 'fixed'], default: 'yearly' }
});

// Schema for application process steps
const applicationStepSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    type: { 
        type: String, 
        enum: ['test', 'interview', 'assignment', 'document_verification', 'other'],
        required: true 
    },
    deadline: { type: Date },
    duration: { type: Number }, // in minutes
    weightage: { type: Number, min: 0, max: 100 },
    isMandatory: { type: Boolean, default: true },
    status: { 
        type: String, 
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
        default: 'pending' 
    },
    metadata: { type: mongoose.Schema.Types.Mixed }
});

// Schema for eligibility criteria
const eligibilityCriteriaSchema = new mongoose.Schema({
    minCGPA: { type: Number, min: 0, max: 10 },
    maxBacklogs: { type: Number, min: 0 },
    education: [{
        degree: { type: String, required: true },
        discipline: { type: String, required: true },
        minPercentage: { type: Number, min: 0, max: 100 }
    }],
    skills: [{
        name: { type: String, required: true },
        level: { type: Number, min: 1, max: 5 },
        isRequired: { type: Boolean, default: false }
    }],
    customCriteria: { type: String }
});

const opportunitySchema = new mongoose.Schema({
    // Basic Information
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    type: {
        type: String,
        required: [true, 'Opportunity type is required'],
        enum: ['full_time', 'part_time', 'internship', 'contract', 'freelance']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [10000, 'Description cannot exceed 10000 characters']
    },
    shortDescription: {
        type: String,
        maxlength: [500, 'Short description cannot exceed 500 characters']
    },
    
    // Company Information
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Job Details
    responsibilities: [{
        type: String,
        required: [true, 'At least one responsibility is required']
    }],
    requirements: [{
        type: String,
        required: [true, 'At least one requirement is required']
    }],
    skills: [{
        name: { type: String, required: true },
        level: { type: Number, min: 1, max: 5 },
        isRequired: { type: Boolean, default: false }
    }],
    benefits: [{
        type: String
    }],
    
    // Location Information
    locationType: {
        type: String,
        enum: ['on_site', 'remote', 'hybrid'],
        required: true
    },
    locations: [{
        type: String,
        required: function() {
            return this.locationType !== 'remote';
        }
    }],
    
    // Compensation
    salary: {
        type: salaryRangeSchema,
        required: function() {
            return this.compensationType === 'paid';
        }
    },
    compensationType: {
        type: String,
        enum: ['paid', 'unpaid', 'stipend', 'equity', 'performance_based'],
        default: 'paid'
    },
    otherBenefits: {
        type: String
    },
    
    // Eligibility and Application
    eligibility: {
        type: eligibilityCriteriaSchema,
        required: true
    },
    applicationProcess: [applicationStepSchema],
    applicationDeadline: {
        type: Date,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    duration: {
        value: { type: Number },
        unit: { type: String, enum: ['days', 'weeks', 'months', 'years'] }
    },
    positionsAvailable: {
        type: Number,
        min: 1,
        required: true
    },
    
    // Status and Visibility
    status: {
        type: String,
        enum: ['draft', 'pending_approval', 'approved', 'rejected', 'closed', 'completed'],
        default: 'draft'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    
    // Metrics
    views: {
        type: Number,
        default: 0
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    }],
    applicationCount: {
        type: Number,
        default: 0
    },
    
    // Metadata
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    attachments: [{
        name: String,
        url: String,
        type: String
    }],
    
    // Audit Fields
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvalDate: {
        type: Date
    },
    rejectionReason: {
        type: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
opportunitySchema.index({ title: 'text', description: 'text', 'skills.name': 'text' });
opportunitySchema.index({ company: 1, status: 1 });
opportunitySchema.index({ applicationDeadline: 1 });
opportunitySchema.index({ 'eligibility.minCGPA': 1 });
opportunitySchema.index({ type: 1, locationType: 1, isActive: 1 });

// Virtual for checking if application is open
opportunitySchema.virtual('isApplicationOpen').get(function() {
    const now = new Date();
    return this.status === 'approved' && 
           this.isActive && 
           (!this.applicationDeadline || this.applicationDeadline > now);
});

// Virtual for days remaining to apply
opportunitySchema.virtual('daysRemaining').get(function() {
    if (!this.applicationDeadline) return null;
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const today = new Date();
    const diffDays = Math.ceil((this.applicationDeadline - today) / oneDay);
    return diffDays > 0 ? diffDays : 0;
});

// Pre-save hook to update application count
opportunitySchema.pre('save', function(next) {
    if (this.isModified('applications')) {
        this.applicationCount = this.applications.length;
    }
    next();
});

// Pre-save hook to handle status changes
opportunitySchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'approved' && !this.approvalDate) {
        this.approvalDate = new Date();
    }
    next();
});

export const Opportunity = mongoose.model('Opportunity', opportunitySchema);
