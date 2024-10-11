const express = require("express");
const { createDoctor } = require("../controllers/doctor");
const router = express.Router();

router.route("/create").post(createDoctor);

module.exports = router;
