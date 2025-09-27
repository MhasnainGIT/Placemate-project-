import mongoose from "mongoose";
import dotenv from "dotenv";
import { Job } from "./models/job.model.js";
import { Company } from "./models/company.model.js";
import { User } from "./models/user.model.js";

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Clear existing data
        await Job.deleteMany({});
        await Company.deleteMany({});
        
        // Create a dummy user for company ownership
        let dummyUser = await User.findOne({ email: "admin@jobportal.com" });
        if (!dummyUser) {
            dummyUser = await User.create({
                fullname: "Admin User",
                email: "admin@jobportal.com",
                phoneNumber: "1234567890",
                password: "password123",
                role: "recruiter"
            });
        }

        // Create companies
        const companies = await Company.insertMany([
            {
                name: "Google",
                description: "A multinational technology company that specializes in Internet-related services and products, including online advertising technologies, search engine, cloud computing, software, and hardware.",
                website: "https://google.com",
                location: "Mountain View, CA",
                logo: "https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png",
                userId: dummyUser._id
            },
            {
                name: "Microsoft",
                description: "A multinational technology corporation that produces computer software, consumer electronics, personal computers, and related services.",
                website: "https://microsoft.com",
                location: "Redmond, WA",
                logo: "https://logos-world.net/wp-content/uploads/2020/06/Microsoft-Logo.png",
                userId: dummyUser._id
            },
            {
                name: "Amazon",
                description: "A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
                website: "https://amazon.com",
                location: "Seattle, WA",
                logo: "https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png",
                userId: dummyUser._id
            },
            {
                name: "Meta",
                description: "A technology company that focuses on building products that advance Facebook's mission of bringing the world closer together.",
                website: "https://meta.com",
                location: "Menlo Park, CA",
                logo: "https://logos-world.net/wp-content/uploads/2021/10/Meta-Logo.png",
                userId: dummyUser._id
            },
            {
                name: "Netflix",
                description: "A streaming entertainment service with over 200 million paid memberships in over 190 countries enjoying TV series, documentaries and feature films.",
                website: "https://netflix.com",
                location: "Los Gatos, CA",
                logo: "https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png",
                userId: dummyUser._id
            },
            {
                name: "Apple",
                description: "A multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services.",
                website: "https://apple.com",
                location: "Cupertino, CA",
                logo: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png",
                userId: dummyUser._id
            }
        ]);

        // Create jobs
        const jobs = [
            {
                title: "Senior Software Engineer",
                description: "Join Google's Search team to build and maintain systems that serve billions of users worldwide. Work on cutting-edge technologies and solve complex problems at scale.",
                requirements: ["Java", "Python", "Distributed Systems", "Algorithm Design", "5+ years experience"],
                salary: 180000,
                experienceLevel: "Senior Level",
                location: "Mountain View, CA",
                jobType: "Full Time",
                position: 2,
                company: companies[0]._id,
                created_by: dummyUser._id
            },
            {
                title: "Cloud Solutions Architect",
                description: "Design and implement cloud solutions for enterprise customers using Microsoft Azure. Lead technical discussions and drive cloud adoption strategies.",
                requirements: ["Azure", "Cloud Architecture", "DevOps", "Enterprise Solutions", "Leadership"],
                salary: 165000,
                experienceLevel: "Senior Level",
                location: "Redmond, WA",
                jobType: "Full Time",
                position: 1,
                company: companies[1]._id,
                created_by: dummyUser._id
            },
            {
                title: "Machine Learning Engineer",
                description: "Build and deploy ML models for Amazon's recommendation systems. Work with petabyte-scale data to improve customer experience across all Amazon services.",
                requirements: ["Python", "TensorFlow", "AWS", "Machine Learning", "Big Data"],
                salary: 175000,
                experienceLevel: "Senior Level",
                location: "Seattle, WA",
                jobType: "Full Time",
                position: 1,
                company: companies[2]._id,
                created_by: dummyUser._id
            },
            {
                title: "Frontend Engineer - React",
                description: "Build the next generation of Facebook's user interfaces. Work on products used by billions of people worldwide using React and modern web technologies.",
                requirements: ["React", "JavaScript", "TypeScript", "GraphQL", "Web Performance"],
                salary: 170000,
                experienceLevel: "Mid Level",
                location: "Menlo Park, CA",
                jobType: "Full Time",
                position: 3,
                company: companies[3]._id,
                created_by: dummyUser._id
            },
            {
                title: "Backend Engineer - Streaming",
                description: "Develop and maintain Netflix's streaming infrastructure. Build systems that deliver content to 200+ million subscribers globally with 99.99% uptime.",
                requirements: ["Java", "Microservices", "Distributed Systems", "AWS", "Performance Optimization"],
                salary: 160000,
                experienceLevel: "Mid Level",
                location: "Los Gatos, CA",
                jobType: "Full Time",
                position: 2,
                company: companies[4]._id,
                created_by: dummyUser._id
            },
            {
                title: "iOS Developer",
                description: "Join Apple's iOS team to build features for the next version of iOS. Work on apps and frameworks used by millions of iPhone and iPad users worldwide.",
                requirements: ["Swift", "iOS SDK", "Objective-C", "UIKit", "Core Data"],
                salary: 155000,
                experienceLevel: "Mid Level",
                location: "Cupertino, CA",
                jobType: "Full Time",
                position: 2,
                company: companies[5]._id,
                created_by: dummyUser._id
            },
            {
                title: "Product Manager - Search",
                description: "Lead product strategy for Google Search features. Define roadmaps, work with engineering teams, and drive product decisions that impact billions of users.",
                requirements: ["Product Strategy", "Data Analysis", "User Research", "Technical Background", "Leadership"],
                salary: 190000,
                experienceLevel: "Senior Level",
                location: "Mountain View, CA",
                jobType: "Full Time",
                position: 1,
                company: companies[0]._id,
                created_by: dummyUser._id
            },
            {
                title: "Data Scientist - AI Research",
                description: "Conduct cutting-edge AI research at Meta. Work on computer vision, NLP, and recommendation systems that power Facebook, Instagram, and WhatsApp.",
                requirements: ["Python", "PyTorch", "Machine Learning", "Statistics", "Research Experience"],
                salary: 185000,
                experienceLevel: "Senior Level",
                location: "Menlo Park, CA",
                jobType: "Full Time",
                position: 1,
                company: companies[3]._id,
                created_by: dummyUser._id
            },
            {
                title: "Software Engineer - New Grad",
                description: "Join Microsoft as a new graduate software engineer. Work on Azure, Office 365, or Windows products while receiving mentorship and career development.",
                requirements: ["Computer Science Degree", "Programming Skills", "Problem Solving", "Teamwork"],
                salary: 130000,
                experienceLevel: "Entry Level",
                location: "Redmond, WA",
                jobType: "Full Time",
                position: 5,
                company: companies[1]._id,
                created_by: dummyUser._id
            },
            {
                title: "DevOps Engineer - AWS",
                description: "Build and maintain Amazon's internal infrastructure. Work with containerization, orchestration, and automation tools to support thousands of services.",
                requirements: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
                salary: 150000,
                experienceLevel: "Mid Level",
                location: "Seattle, WA",
                jobType: "Full Time",
                position: 2,
                company: companies[2]._id,
                created_by: dummyUser._id
            }
        ];

        await Job.insertMany(jobs);

        console.log("✅ Database seeded successfully!");
        console.log(`Created ${companies.length} companies and ${jobs.length} jobs`);
        console.log("Companies: Google, Microsoft, Amazon, Meta, Netflix, Apple");
        
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        mongoose.connection.close();
    }
};

seedData();