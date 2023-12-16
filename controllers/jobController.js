const asyncHandler = require("express-async-handler");
const Job = require("../models/jobModel");
const { json } = require("express");
const crypto = require("crypto");

//@desc Create a new job
//@route POST api/jobs
//@access private
const createJob = asyncHandler(async (req, res) => {
  const {
    jobTitle,
    companyId,
    jobDescription,
    remoteWork,
    jobType,
    jobSalary,
    jobCategory,
    jobLocation,
    closingDate,
  } = req.body;
  if (
    !jobTitle ||
    !companyId ||
    !jobDescription ||
    !remoteWork ||
    !jobType ||
    !jobSalary
  ) {
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
  const jobId = crypto.randomBytes(22).toString("hex");
  const job = await Job.createJob({
    job_id: jobId,
    company_id: companyId,
    job_title: jobTitle,
    job_description: jobDescription,
    remote_work: remoteWork,
    job_type: jobType,
    // work_type:workType,
    job_salary: jobSalary,
    job_category: jobCategory,
    job_location: jobLocation,
    // job_status:jobStatus,
    closing_date: closingDate,
  });

  if (job) {
    res.status(200).json(job);
  } else {
    res.status(400);
    throw new Error("Job data is not valid");
  }
});

//@desc Get jobs, if action is included and q is empty, get all jobs,
//  else if action is jobs, get all jobs, else if action is company,
//  get all jobs by company, else if action is category, get all jobs
//  by category, else if action is location, get all jobs by location
//@route GET api/jobs/?action=(home|jobs|company|category|location)/q=(search|company|category|location)+&page=1&limit=10
//@access public
const getJobs = asyncHandler(async (req, res) => {
  const action = req.query.action;
  const page = req.query.page;
  const q = req.query.q;
  const jobs = await Job.getJobs(action, q, page);
  if (jobs) {
    res.status(200).json(jobs);
  } else {
    res.status(404);
    throw new Error("Job not found");
  }
});

//@desc Get related jobs
//@route GET api/jobs/related/:category
//@access public
const getRelatedJobs = asyncHandler(async (req, res) => {
  const category = req.params.category;
  const jobs = await Job.getRelatedJobs(category);
  if (jobs) {
    res.status(200).json(jobs);
  } else {
    res.status(404);
    throw new Error("Jobs not found");
  }
});

//@desc Get jobs from "this" company
//@route GET api/jobs/company/:id
//@access public
const getJobsByCompany = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const jobs = await Job.getJobsByCompany(id);
  if (jobs) {
    res.status(200).json(jobs);
  } else {
    res.status(404);
    throw new Error("Jobs not found");
  }
});

//@desc Get job profile
//@route GET api/jobs/:id
//@access public
const getJobById = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const job = await Job.findJobById(jobId);

  if (job) {
    res.status(200).json(job);
  } else {
    res.status(404);
    throw new Error("Job not found");
  }
});

//@desc Get job profile
//@route GET api/jobs/:id
//@access public
const getJobByIdAdmin = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const job = await Job.findJobById(jobId);
  if (job) {
    res.status(200).json(job);
  } else {
    res.status(404);
    throw new Error("Job not found");
  }
});

//@desc Get job applications by user,
// if action is jobs, get all jobs' applications by all users
// else if action is admin, get all job applications by all users
//@route GET api/jobs/applications/:id?action=(jobs|admin)
//@access private
const getJobApplications = asyncHandler(async (req, res) => {
  console.log(req);
  const id = req.params.id;
  //   const action = req.query.action.match("/(jobs|admin)/")[0];
  const action = req.query.action;
  const jobApplications = await Job.getJobApplications(id, action);
  if (jobApplications.length) {
    res.status(200).json(jobApplications);
  } else {
    res.status(404);
    throw new Error("Not found");
  }
});

//@desc Apply for a job
//@route POST api/jobs/applications/:jobId?action=apply
//@access private
const applyForJob = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId;
  const userId = req.user.id;
  if (Job.getJobApplication(userId, jobId)) {
    res.status(400);
    throw new Error("You have already applied for this job");
  }
  const jobApplication = await Job.applyForJob({
    user_id: userId,
    job_id: jobId,
  });

  if (jobApplication) {
    res.status(200).json(jobApplication);
  } else {
    res.status(401);
    throw new Error("Job application failed.");
  }
});

//@desc Get job application
//@route GET api/jobs/applications/:userId/:jobId
//@access private
const getJobApplication = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const jobId = req.params.jobId;
  const jobApplications = await Job.getJobApplication(userId, jobId);
  if (jobApplications) {
    res.status(200).json(jobApplications);
  } else {
    res.status(404);
    throw new Error("Job not found");
  }
});

//@desc Update job
//@route PUT api/jobs/:id
//@access private
const updateJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const { name, description, email, website, phone, logo } = req.body;

  if (!name || !description || !email || !phone) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const existingJob = await Job.getJobById(jobId);
  if (!existingJob) {
    res.status(404);
    throw new Error("Job not found");
  }

  const updatedJob = await Job.updateJob({});

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
    throw new Error("Job update failed.");
  }
});

module.exports = {
  createJob,
  getJobByIdAdmin,
  getRelatedJobs,
  getJobsByCompany,
  getJobById,
  getJobApplications,
  getJobApplication,
  applyForJob,
  getJobs,
  updateJob,
};
