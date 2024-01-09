const asyncHandler = require("express-async-handler");
const Job = require("../models/jobModel");
const { json } = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

//@desc Create a new job
//@route POST api/jobs
//@access private
const updateJob = asyncHandler(async (req, res) => {
  const job_id = req.params.id;

  // if (job_id) {
  //   // find job by id
  //   const _job = await Job.findJobById(job_id);
  //   if (_job) {
  //     // update job
  //     const job = await Job.updateJob(job_id, req.body);
  //     if (job) {
  //       res.status(200).json(job);
  //     } else {
  //       res.status(400);
  //       throw new Error("Job data is not valid");
  //     }
  //   } else {
  //     res.status(404);
  //     throw new Error("Job not found");
  //   }
  // } else {
  //   res.status(400);
  //   throw new Error("Job id is required");
  // }

  const job = req.body;
  console.log("job", job);
  // const {
  //   job_id,
  //   jobTitle,
  //   companyId,
  //   jobDescription,
  //   remoteWork,
  //   jobType,
  //   jobSalary,
  //   jobCategory,
  //   jobLocation,
  //   closingDate,
  // } = req.body;

  // if(job_id){
  //   const _job = await Job.updateJob({
  //     job_id,
  //     jobTitle,
  //     companyId,
  //     jobDescription,
  //     remoteWork,
  //     jobType,
  //     jobSalary,
  //     jobCategory,
  //     jobLocation,
  //     closingDate,
  //   });

  // if (
  //   !jobTitle ||
  //   !companyId ||
  //   !jobDescription ||
  //   !remoteWork ||
  //   !jobType ||
  //   !jobSalary
  // ) {
  //   // console.log(req.body);
  //   res.status(400);
  //   throw new Error("All fields with * are required");
  // }
  // // const jobExist = await Job.findJobById(id);
  // // if(jobAvailable){
  // //     res.status(400);
  // //     throw new Error("Job already registered");
  // // }

  // // Generate a random 45-character hexadecimal ID
  // const jobId = crypto.randomBytes(22).toString("hex");
  // const job = await Job.createJob({
  //   job_id: jobId,
  //   company_id: companyId,
  //   job_title: jobTitle,
  //   job_description: jobDescription,
  //   remote_work: remoteWork,
  //   job_type: jobType,
  //   // work_type:workType,
  //   job_salary: jobSalary,
  //   job_category: jobCategory,
  //   job_location: jobLocation,
  //   // job_status:jobStatus,
  //   closing_date: closingDate,
  // });

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
  const includeRelatedJobs = req.query.related;
  const includeCompanyJobs = req.query.comapny;
  const job = await Job.findJobById(
    jobId,
    includeRelatedJobs,
    includeCompanyJobs
  );
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
  const userRole = req.user.userType === "Manager";
  // console.log(req.user);
  const job = await Job.findJobById(jobId, !userRole, !userRole);
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
  const id = req.user.id;
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
//@route POST api/jobs/applications/:jobId/apply
//@access private
const applyForJob = asyncHandler(async (req, res) => {
  // Access form values, skills, and CV file
  const { formValues, toEmail, body, fileName } = req.body;
  const cvFile = req.file;

  // Send email using nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your-email@gmail.com", // replace with your email
      pass: "your-email-password", // replace with your email password or use an app password
    },
  });

  const mailOptions = {
    from: formValues.fromEmail, // replace with your email
    to: toEmail, // replace with the recipient's email
    subject: formValues.subject,
    text: body,
    attachments: [
      {
        filename: fileName, // replace with the desired filename
        content: cvFile.buffer, // file content
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    } else {
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "Email sent successfully" });
    }
  });

  // const jobId = req.params.jobId;
  // const userId = req.user.id;
  // const _jobApplication = await Job.getJobApplication(userId, jobId);
  // if (_jobApplication.length > 0) {
  //   res.status(400);
  //   throw new Error("You have already applied for this job");
  // }
  // const jobApplication = await Job.applyForJob({
  //   user_id: userId,
  //   job_id: jobId,
  // });
  // if (jobApplication) {
  //   res.status(200).json(jobApplication);
  // } else {
  //   res.status(401);
  //   throw new Error("Job application failed.");
  // }
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

// //@desc Update job
// //@route PUT api/jobs/:id
// //@access private
// const updateJob = asyncHandler(async (req, res) => {
//   const jobId = req.params.id;
//   const { name, description, email, website, phone, logo } = req.body;

//   if (!name || !description || !email || !phone) {
//     res.status(400);
//     throw new Error("All fields are required");
//   }

//   const existingJob = await Job.getJobById(jobId);
//   if (!existingJob) {
//     res.status(404);
//     throw new Error("Job not found");
//   }

//   const updatedJob = await Job.updateJob({});

//   if (updateJob === 1) {
//     res.status(200).json({
//       // company_id:companyId,
//       // company_name:name,
//       // company_description:description,
//       // company_email:email,
//       // company_website:website,
//       // company_phone:phone,
//       // company_logo:logo
//     });
//   } else {
//     res.status(401);
//     throw new Error("Job update failed.");
//   }
// });

module.exports = {
  updateJob,
  getJobByIdAdmin,
  getRelatedJobs,
  getJobsByCompany,
  getJobById,
  getJobApplications,
  getJobApplication,
  applyForJob,
  getJobs,
};
