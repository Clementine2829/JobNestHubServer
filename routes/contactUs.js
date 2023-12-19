const express = require("express");
const { getContactUs } = require("../controllers/contactUsController");
const router = express.Router();

router.post("/contact-us", getContactUs);

module.exports = router;
