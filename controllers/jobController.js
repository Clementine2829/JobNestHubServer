const asyncHandler = require("express-async-handler"); 
const Job = require("../models/jobModel");
const { json } = require("express");
const crypto = require('crypto');


//@desc Create a new job
//@route POST api/jobs
//@access private 
const createJob = asyncHandler(async (req, res) => {
    const { jobTitle, companyId, jobDescription, remoteWork, jobType, jobSalary
        , jobCategory, jobLocation, closingDate } = req.body;
    if( !jobTitle || !companyId || !jobDescription || !remoteWork || !jobType || !jobSalary){
        console.log(req.body);
        res.status(400);
        throw new Error("All fields with * are required");
    }
    // const jobExist = await Job.findJobById(id);
    // if(jobAvailable){
    //     res.status(400);
    //     throw new Error("Job already registered");
    // }

    // Generate a random 45-character hexadecimal ID
    const jobId = crypto.randomBytes(22).toString('hex');
    const job = await Job.createJob({
        job_id:jobId,
        company_id:companyId, 
        job_title:jobTitle, 
        remote_work:remoteWork, 
        job_type:jobType, 
        // work_type:workType, 
        job_salary:jobSalary, 
        job_category:jobCategory, 
        job_location:jobLocation, 
        // job_status:jobStatus,
        closing_date:closingDate
    });

    if(job){
        res.status(200).json(job);
    }else{
        res.status(400);
        throw new Error("Job data is not valid");
    }
})


//@desc Get job
//@route GET api/jobs/
//@access public 
const getJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.getJobs();
    if (jobs) {
        res.status(200).json(jobs);
    }else{
        res.status(404);
        throw new Error("Job not found")
    }
})

//@desc Get job profile
//@route GET api/jobs/:id
//@access public 
const getJobById = asyncHandler(async (req, res) => {
    const jobId = req.params.id;
    const job = await Job.findJobById({jobId});

    if (job) {
        res.status(200).json(job);
    }else{
        res.status(404);
        throw new Error("Job not found")
    }
})

//@desc Update job
//@route PUT api/jobs/:id
//@access private  
const updateJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id;
    const { name, description, email, website, phone, logo } = req.body;

    if(!name || !description || !email || !phone){
        res.status(400);
        throw new Error("All fields are required");
    }

    const existingJob = await Job.getJobById(jobId);
    if (!existingJob) {
        res.status(404);
        throw new Error("Job not found")
    }

    const updatedJob = await Job.updateJob({

        
    });

    if (updateJob === 1) {
        res.status(200).json({
            // company_id:companyId, 
            // company_name:name, 
            // company_description:description, 
            // company_email:email, 
            // company_website:website, 
            // company_phone:phone, 
            // company_logo:logo
        });
    } else {
        res.status(401);
        throw new Error('Job update failed.');
    }
});

module.exports = {
    createJob,
    getJobById,
    getJobs,
    updateJob
};
