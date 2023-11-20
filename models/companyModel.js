const db = require('../databases/jobs_database');
const getCurrentDateAndTime = require('../getCurrentTime')

async function findCompanyById(id) {
    const [company] = await db.execute(`SELECT * FROM company WHERE company_id = ? LIMIT 1`, [id]); 
    return company[0];
}

async function createCompany(company) {
    const {
        company_id, company_name, company_description, 
        company_email, company_website, company_phone, 
        company_logo
    } = company;
    const currentTime = await getCurrentDateAndTime();
    const [result] = await db.execute(
        `INSERT INTO company (company_id, company_name, company_description, company_email, 
          company_website, company_phone, company_logo, date_created) 
         VALUES (?, ?, ?, ?, IF(? = '', DEFAULT(company_website), ?), ?, IF(? = '', DEFAULT(company_logo), ?), ?)`,
        [
          company_id,
          company_name,
          company_description,
          company_email,
          company_website, // Use the empty string
          company_website, // Provide again for the default check
          company_phone,
          company_logo, // Use the empty string
          company_logo, // Provide again for the default check
          currentTime,
        ]
      );
      
    if (result.affectedRows === 1) {
        return company;
    } else {
        throw new Error('Company creation failed.');
    }
}

async function updateCompany(updatedCompanyData) {
    const {
        company_id, company_name, company_description, 
        company_email, company_website, company_phone, 
        company_logo
    } = updatedCompanyData;
    const currentTime = await getCurrentDateAndTime();
    const [result] = await db.execute(
        `UPDATE company 
        SET company_name = ?, company_description = ?, company_email = ?, 
            company.company_website = ?, company_phone = ?, company_logo = ?, 
            date_updated = ?  WHERE company_id = ?`,
        [company_name, company_description, company_email, company_website, 
            company_phone, company_logo,currentTime, company_id]
    );
    return result.affectedRows;  
}

module.exports = {
    findCompanyById,
    createCompany,
    updateCompany,
};
