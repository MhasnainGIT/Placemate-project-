import mongoose from "mongoose";

// Schema for company contact persons
const contactPersonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    designation: { type: String },
    isPrimary: { type: Boolean, default: false }
});

// Schema for company social media links
const socialMediaSchema = new mongoose.Schema({
    linkedin: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    instagram: { type: String }
});

const companySchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        unique: true,
        maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    displayName: {
        type: String,
        trim: true,
        maxlength: [100, 'Display name cannot exceed 100 characters']
    },
    registrationNumber: {
        type: String,
        trim: true,
        unique: true,
        sparse: true
    },
    description: {
        type: String,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    industry: {
        type: String,
        required: [true, 'Industry is required']
    },
    companySize: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001+'],
        required: true
    },
    yearFounded: {
        type: Number,
        min: [1800, 'Year founded seems incorrect'],
        max: [new Date().getFullYear(), 'Year cannot be in the future']
    },
    
    // Contact Information
    website: {
        type: String,
        match: [/^https?:\/\/\S+$/, 'Please enter a valid website URL']
    },
    email: {
        type: String,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
        lowercase: true
    },
    phone: {
        type: String,
        match: [/^[0-9\-+()\s]+$/, 'Please enter a valid phone number']
    },
    contactPersons: [contactPersonSchema],
    
    // Location
    headquarters: {
        address: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        postalCode: { type: String }
    },
    locations: [{
        type: { type: String, enum: ['office', 'development_center', 'manufacturing', 'other'], default: 'office' },
        address: String,
        city: String,
        state: String,
        country: String,
        isPrimary: Boolean
    }],
    
    // Media
    logo: {
        url: String,
        originalName: String,
        uploadedAt: { type: Date, default: Date.now }
    },
    coverImage: {
        url: String,
        originalName: String
    },
    gallery: [{
        url: String,
        caption: String,
        uploadedAt: { type: Date, default: Date.now }
    }],
    
    // Social Media
    socialMedia: socialMediaSchema,
    
    // Company Details
    type: {
        type: String,
        enum: ['public', 'private', 'non_profit', 'government', 'startup', 'education', 'other'],
        default: 'private'
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    technologies: [{
        type: String,
        trim: true
    }],
    
    // Verification & Status
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationStatus: {
        type: String,
        enum: ['unverified', 'pending', 'verified', 'rejected'],
        default: 'unverified'
    },
    verificationNotes: {
        type: String,
        maxlength: [1000, 'Verification notes cannot exceed 1000 characters']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    
    // Relationships
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    recruiters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    
    // Metrics
    totalOpportunities: {
        type: Number,
        default: 0
    },
    totalHires: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
companySchema.index({ name: 'text', description: 'text', 'headquarters.city': 1, industry: 1 });
companySchema.index({ isVerified: 1, isActive: 1 });

// Virtual for company's display name (falls back to name if not set)
companySchema.virtual('displayNameFormatted').get(function() {
    return this.displayName || this.name;
});

// Pre-save hook to ensure at least one primary contact person
companySchema.pre('save', function(next) {
    if (this.contactPersons && this.contactPersons.length > 0) {
        const hasPrimary = this.contactPersons.some(person => person.isPrimary);
        if (!hasPrimary) {
            this.contactPersons[0].isPrimary = true;
        }
    }
    next();
});

export const Company = mongoose.model('Company', companySchema);