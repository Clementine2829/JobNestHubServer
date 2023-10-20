const db = require('../databases/jobs_database');
const getCurrentDateAndTime = require('../getCurrentTime')

async function findJobById(id) {
    const [job] = await db.execute(`SELECT * FROM jobs WHERE job_id = ? LIMIT 1`, [id]); 
    return job[0];
}

async function getJobs() {
    const [job] = await db.execute(`SELECT * FROM jobs`); 
    return job;
}


async function createJob(job) {
    const {
        job_id,
        company_id,
        job_title, 
        remote_work, 
        job_type, 
        work_type, 
        job_salary, 
        job_category, 
        job_location, 
        job_status,
        closing_date
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
    
    console.log(job)
    
    job_ref = await generateRandomCapsAndNumbers(10)
    console.log(job_ref)
    const currentTime = await getCurrentDateAndTime();
    
    const [result] = await db.execute(
        `INSERT INTO jobs (job_id, company_id, job_title, remote_work, job_type, 
            job_salary, job_category, job_location, 
            closing_date, job_ref, date_created) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          job_id,
          company_id, 
          job_title, 
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
        throw new Error('job creation failed.');
    }
}
async function generateRandomCapsAndNumbers(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
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
    createJob,
    updateJob,
};
