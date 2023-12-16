const db = require("../databases/jobs_database");
const getCurrentDateAndTime = require("../getCurrentTime");

async function findJobById(id) {
  const [job] = await db.execute(
    `
                SELECT jobs.job_id, jobs.job_title, jobs.job_description, jobs.remote_work, jobs.job_type,
                    jobs.job_salary, jobs.job_location, jobs.job_status, 
                    jobs.closing_date, jobs.date_created, jobs.date_updated, jobs.job_ref,
                    JSON_OBJECT(
                        'company_id', company.company_id, 
                        'company_name', company.company_name,
                        'company_description', company.company_description,
                        'company_logo', company.company_logo
                    ) AS company, 
                        JSON_OBJECT(
                            'category_id', job_category.category_id, 
                            'category_name', job_category.category_name
                        
                    ) AS category
                FROM jobs
                    INNER JOIN company ON jobs.company_id = company.company_id 
                    INNER JOIN job_category ON jobs.job_category  = job_category.category_id
                WHERE jobs.job_id = ? 
                LIMIT 1`,
    [id]
  );
  return structuredJob(job[0]);
}

async function findJobByCompany(companyId) {
  const [jobs] = await db.execute(
    `SELECT jobs.job_id, jobs.job_title, jobs.job_description, jobs.remote_work, jobs.job_type,
                        jobs.job_salary, jobs.job_location, jobs.job_status, 
                        jobs.closing_date, jobs.date_created, jobs.date_updated, jobs.job_ref,
                        JSON_OBJECT(
                            'company_id', company.company_id, 
                            'company_name', company.company_name,
                            'company_description', company.company_description,
                            'company_logo', company.company_logo
                        ) AS company, 
                            JSON_OBJECT(
                                'category_id', job_category.category_id, 
                                'category_name', job_category.category_name
                            
                        ) AS category
                    FROM jobs
                        INNER JOIN company ON jobs.company_id = company.company_id 
                        INNER JOIN job_category ON jobs.job_category  = job_category.category_id
                    WHERE jobs.company_id = ? 
                    LIMIT 10`,
    [companyId]
  );
  return structuredJob(jobs[0]);
}

// url ?action=(home|jobs|search|company|category|location)+&page=1&limit=10
async function getJobs(action = "", q = "", page = 1) {
  let limit = 5;
  if (!/(home|jobs|company|category|location)/.test(action)) action = "";
  if (action === "home") limit = 6;
  // console.log("action " + action);
  // console.log("query " + q);
  // console.log("limit  " + limit);
  if (q !== "") {
    q = ` AND (jobs.job_title LIKE '%${q}%' 
                OR jobs.job_description LIKE '%${q}%' 
                OR jobs.job_ref LIKE '%${q}%' 
                OR company.company_name LIKE '%${q}%'
                OR company.company_description LIKE '%${q}%'
                OR job_category.category_name LIKE '%${q}%'
                OR jobs.job_description LIKE '%${q}%')`;
  }

  if (action === "home") action = ``;
  else if (action === "jobs") action = ``;
  else if (action === "company") action = ``;
  else if (action === "category") action = ``;
  else if (action === "location") action = ``;

  let sql = ` SELECT jobs.job_id, jobs.job_title, jobs.job_description, jobs.remote_work, jobs.job_type,
    jobs.job_salary, jobs.job_location, jobs.job_status, 
    jobs.closing_date, jobs.date_created, jobs.date_updated, jobs.job_ref,
    JSON_OBJECT(
        'company_id', company.company_id, 
        'company_name', company.company_name,
        'company_description', company.company_description,
        'company_logo', company.company_logo
    ) AS company, 
        JSON_OBJECT(
            'category_id', job_category.category_id, 
            'category_name', job_category.category_name
        
    ) AS category
    FROM jobs
        INNER JOIN company ON jobs.company_id = company.company_id
        INNER JOIN job_category ON jobs.job_category  = job_category.category_id
    WHERE jobs.job_status = 1 ${q} ${action}
    ORDER BY jobs.date_created DESC
    LIMIT ${limit} 
    OFFSET ${page * limit - limit}`;
  const [jobs] = await db.execute(sql);
  if (jobs.length > 0) {
    const structuredJobs = await Promise.all(
      jobs.map((job) => structuredJob(job, limit))
    );
    return structuredJobs;
  } else {
    return [];
  }
}

async function getRelatedJobs(jobCategoryId) {
  const sql = `SELECT job_id, job_title 
   FROM jobs 
   WHERE job_category = ? 
   LIMIT 5`;
  const [jobs] = await db.execute(sql, [jobCategoryId]);
  return jobs;
}
async function getJobsByCompany(companyId) {
  const sql = `SELECT job_id, job_title 
   FROM jobs 
   WHERE company_id = ? 
   LIMIT 5`;
  const [jobs] = await db.execute(sql, [companyId]);
  return jobs;
}

const jobsPropsLimit = 5;
async function getJobRequirements(job) {
  const sql = `SELECT requirement FROM job_requirements WHERE job_id = ? LIMIT ${jobsPropsLimit}`;
  const [requirements] = await db.execute(sql, [job]);
  return requirements.length != 0 ? requirements : [{ requirement: "" }];
}
async function getJobQualifications(job) {
  const sql = `SELECT qualification FROM job_qualifications WHERE job_id = ? LIMIT ${jobsPropsLimit}`;
  const [qualifications] = await db.execute(sql, [job]);
  return qualifications != 0 ? qualifications : [{ qualification: "" }];
}
async function getJobDuties(job) {
  const sql = `SELECT duty FROM job_duties WHERE job_id = ? LIMIT ${jobsPropsLimit}`;
  const [duties] = await db.execute(sql, [job]);
  return duties != 0 ? duties : [{ duty: "" }];
}

async function structuredJob(job, limit = 5) {
  if (job) {
    const remoteWorkMap = {
      0: false,
      1: true,
    };

    const jobTypeMap = {
      0: "Full time",
      1: "Part time",
      2: "Contract",
    };

    const jobRequrements =
      limit === 6 ? {} : await getJobRequirements(job.job_id);
    const jobQualifications =
      limit === 6 ? {} : await getJobQualifications(job.job_id);
    const jobDuties = limit === 6 ? {} : await getJobDuties(job.job_id);

    const transformedJob = {
      ...job,
      remote_work: remoteWorkMap[job.remote_work],
      job_type: jobTypeMap[job.job_type],
      job_requirements: jobRequrements,
      job_qualifications: jobQualifications,
      job_duties: jobDuties,
      likes: 5,
    };
    delete transformedJob.job_status;
    delete transformedJob.date_created;
    return transformedJob;
  } else {
    return {};
  }
}

async function createJob(job) {
  const {
    job_id,
    company_id,
    job_title,
    job_description,
    remote_work,
    job_type,
    work_type,
    job_salary,
    job_category,
    job_location,
    job_status,
    closing_date,
  } = job;

  // let job_ref = ""
  // do {
  //     job_ref = await generateRandomCapsAndNumbers(10)
  //     const [jobRef] = await db.execute(`SELECT * FROM jobs WHERE job_ref = ? LIMIT 1`, [job_ref])
  //     if (!jobRef[0]) {
  //         break
  //     }
  // } while(true)

  // check if the job exist for this company

  console.log(job);

  job_ref = await generateRandomCapsAndNumbers(10);
  console.log(job_ref);
  const currentTime = await getCurrentDateAndTime();

  const [result] = await db.execute(
    `INSERT INTO jobs (job_id, company_id, job_title, job_description, remote_work, job_type, 
            job_salary, job_category, job_location, 
            closing_date, job_ref, date_created) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      job_id,
      company_id,
      job_title,
      job_description,
      remote_work,
      job_type,
      job_salary,
      job_category,
      job_location,
      closing_date,
      job_ref,
      currentTime,
    ]
  );

  if (result.affectedRows === 1) {
    return findJobById(job_id);
  } else {
    throw new Error("job creation failed.");
  }
}
async function generateRandomCapsAndNumbers(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

async function getJobApplications(id, action) {
  if (action === "jobs") {
    console.log("jobs");
    const [applications] = await db.execute(
      `SELECT * FROM job_applications WHERE job_id = ? LIMIT 10`,
      [id]
    );
    return structuredJobApplications(applications);
  } else if (action === "admin") {
    console.log("admin");
    const [applications] = await db.execute(
      `SELECT * FROM job_applications Limit 10`
    );
    return structuredJobApplications(applications);
  } else {
    // else get job applications for a user
    const [applications] = await db.execute(
      `SELECT * FROM job_applications WHERE user_id = ? LIMIT 10`,
      [id]
    );
    console.log("user");
    return structuredJobApplications(applications);
  }
}

function structuredJobApplications(jobs) {
  if (jobs && Array.isArray(jobs)) {
    const jobStatus = {
      0: "Pending",
      1: "Approved",
      2: "Rejected",
    };

    const transformedJobs = jobs.map((job) => ({
      ...job,
      application_status: jobStatus[job.application_status],
    }));

    return transformedJobs;
  } else {
    return [];
  }
}

async function getJobApplication(userId, jobId) {
  const [applications] = await db.execute(
    `SELECT * FROM job_applications WHERE user_id = ? AND job_id = ? LIMIT 1`,
    [userId, jobId]
  );
  return applications;
}

async function applyForJob({ user_id, job_id }) {
  const currentTime = await getCurrentDateAndTime();
  const [result] = await db.execute(
    `INSERT INTO job_applications (user_id, job_id, date_created) VALUES (?, ?, ?)`,
    [user_id, job_id, currentTime]
  );
  if (result.affectedRows === 1) {
    return getJobApplication(user_id, job_id);
  } else {
    throw new Error("Job application failed.");
  }
}

async function updateJob(updatedJobData) {
  // const {
  //     job_id,
  // } = updatedJobData;
  // const currentTime = await getCurrentDateAndTime();
  // const [result] = await db.execute(
  //     `UPDATE jobs
  //     SET company_name = ?, company_description = ?, company_email = ?,
  //         company.company_website = ?, company_phone = ?, company_logo = ?,
  //         date_updated = ?  WHERE company_id = ?`,
  //     [company_name, company_description, company_email, company_website,
  //         company_phone, company_logo,currentTime, company_id]
  // );
  // return result.affectedRows;
}

// async function createCategoryGroups() {
//     const [result] = await db.execute(
//         `INSERT INTO job_category_groups (category_name, date_created)
//          VALUES (?, ?)`,
//         [
//             category_name,
//             groud_id,
//             date_created
//         ]
//     );

//     if (result.affectedRows === 0) {
//         throw new Error('job creation failed.');
//     }
// }
// async function createCategories() {
//     const categories = [
//         "Accounting",
//         "Administrative",
//         "Agriculture & Forestry",
//         "Architecture",
//         "Arts & Entertainment",
//         "Banking & Finance",
//         "Beauty",
//         "Chemical Engineering",
//         "Childcare",
//         "Civil Engineering",
//         "Cleaning & Sanitation",
//         "Community & Social Service",
//         "Construction",
//         "Customer Service",
//         "Driving",
//         "Education",
//         "Electrical Engineering",
//         "Helpdesk",
//         "Hospitality & Tourism",
//         "Human Resources",
//         "Industrial Engineering",
//         "IT & Telecommunications",
//         "Installation & Maintenance",
//         "Insurance",
//         "Legal",
//         "Mechanical Engineering",
//         "Media & Communications",
//         "Mining",
//         "Nursing",
//         "Personal Care & Home Health",
//         "Pharmacy",
//         "Physicians & Surgeons",
//         "Production & Manufacturing",
//         "Project Management",
//         "Real Estate",
//         "Retail",
//         "Sales",
//         "Security & Public Safety",
//         "Social Science",
//         "Software Development",
//         "Sports"
//     ];

//     const group_id = 1;
//     const date_created = await getCurrentDateAndTime();

//     const values = categories.map((category_name) => [category_name, group_id, date_created]);

//     const placeholders = values.map(() => "(?, ?, ?)").join(', ');

//     const query = `INSERT INTO job_category (category_name, group_id, date_created) VALUES ${placeholders}`;

//     console.log(query);

//     const flattenedValues = values.flat();

//     const [result] = await db.execute(query, flattenedValues);

//     if (result.affectedRows === categories.length) {
//         console.log("Categories inserted successfully.");
//     } else {
//         console.error("Not all categories were inserted successfully.");
//     }

//     return result.affectedRows;
// }
module.exports = {
  findJobById,
  getJobs,
  getRelatedJobs,
  getJobsByCompany,
  getJobApplications,
  getJobApplication,
  createJob,
  applyForJob,
  updateJob,
  findJobByCompany,
};
