const asyncHandler = require("express-async-handler"); 
const Company = require("../models/companyModel");
const { json } = require("express");
const crypto = require('crypto');


//@desc Create a new company
//@route POST api/companies/create
//@access private 
const createCompany = asyncHandler(async (req, res) => {
    const { name, description, email, website, phone, logo } = req.body;
    if(!name || !description || !email || !website || !phone || !logo){
        res.status(400);
        throw new Error("All fields are required");
    }

      const companyAvailable = await Company.findCompanyByNameOrContactDetails({name, email, phone});
      if(companyAvailable){
          res.status(400);
          throw new Error("Company already registered");
      }

    // Generate a random 45-character hexadecimal ID
    const companyId = crypto.randomBytes(22).toString('hex');
    const company = await Company.createCompany({
        company_id:companyId, 
        company_name:name, 
        company_description:description, 
        company_email:email, 
        company_website:(website ? website : ""), 
        company_phone:phone, 
        company_logo:(logo ? logo : "")
    });

    if(company){
        res.status(200).json(company);
    }else{
        res.status(400);
        throw new Error("Compay data is not valid");
    }
})


//@desc Get company profile
//@route GET api/companies/:id
//@access private 
const getCompany = asyncHandler(async (req, res) => {
const companyId = req.params.id;
const company = await Company.findCompanyById(companyId);

if (company) {
    res.status(200).json(company);
}else{
    res.status(404);
    throw new Error("Company not found")
}
})

//@desc Update company
//@route PUT api/companies/:id
//@access private  
const updateCompany = asyncHandler(async (req, res) => {
    const companyId = req.params.id;
    const { name, description, email, website, phone, logo } = req.body;

    if(!name || !description || !email || !phone){
        res.status(400);
        throw new Error("All fields are required");
    }

    const existingCompany = await Company.findCompanyById(companyId);
    if (!existingCompany) {
        res.status(404);
        throw new Error("Company not found")
    }

    const updatedCompany = await Company.updateCompany({
        company_id:companyId, 
        company_name:name, 
        company_description:description, 
        company_email:email, 
        company_website:(website ? website : ""), 
        company_phone:phone, 
        company_logo:(logo ? logo : "")
    });

    if (updatedCompany === 1) {
        res.status(200).json({
            company_id:companyId, 
            company_name:name, 
            company_description:description, 
            company_email:email, 
            company_website:website, 
            company_phone:phone, 
            company_logo:logo
        });
    } else {
        res.status(401);
        throw new Error('Company update failed.');
    }
});

module.exports = {
    createCompany,
    getCompany,
    updateCompany
};
