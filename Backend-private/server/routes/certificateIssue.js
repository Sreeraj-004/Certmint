const express = require("express");
const mongoose = require("mongoose");
const Certificate = require("../config/models/Certificate");
const Institution = require("../config/models/Institution");
const Student = require("../config/models/Student");
const User = require("../config/models/User"); // <- needed to find user by email
const authMiddleware = require("../middleware/auth"); // JWT parser

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { subject, studentName, studentEmail } = req.body;
    const userId = req.user.userId; // institution's userId

    // find institution
    const institution = await Institution.findOne({ userId });
    if (!institution) {
      return res.status(400).json({ message: "Institution profile not found" });
    }

    // create the certificate directly (no student lookup)
    const cert = await Certificate.create({
      institution: institution._id,
      subject,
      studentNameSnapshot: studentName,
      studentEmailSnapshot: studentEmail,
      institutionNameSnapshot: institution.name,
    });

    return res.status(201).json({
      message: "Certificate created successfully",
      certificate: cert,
    });

  } catch (err) {
    console.error("Create cert error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
