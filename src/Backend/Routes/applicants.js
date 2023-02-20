const express = require("express");

const router = express.Router();
const Applicant = require("../models/applicant");
const { verifyToken, generateToken } = require("../util");
const bcrypt = require("bcrypt");
const { FaPage4 } = require("react-icons/fa");
router.get("/", verifyToken, async (req, res) => {
  let applicants = await Applicant.find();
  return res.status(200).json({ applicants });
});

router.get("/:id", verifyToken, async (req, res) => {
  let id = req.params.id;
  let applicant = await Applicant.findById(id);
  return res.status(200).json({ applicant });
});
// This can be used as SignUp
router.post("/", async (req, res) => {
  let fields = req.body.applicant;

  // Hashed Password here
  fields.password = await bcrypt.hash(fields.password, 10);

  let applicant;

  try {
    applicant = new Applicant(fields);
    await applicant.save();
  } catch (error) {
    return res.status(400).json({ status: "error", error: "duplicate email" });
  }

  return res.status(200).json(applicant);
});

router.post("/login", async (req, res) => {
  const applicant = await Applicant.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (applicant) {
    generateToken();
    return res.json({ status: "ok", applicant: true });
  } else {
    res.json({ status: "error", applicant: false });
  }
});

router.patch("/", verifyToken, async (req, res) => {
  let fields = req.body.applicant;
  let applicant = await Applicant.findById(fields.id);

  let fieldKeys = Object.keys(fields);

  for (let key in fieldKeys) {
    if (key != "id") continue;
    applicant[key] = fields[key];
  }

  await applicant.save();
  return res.status(200).json(applicant);
});

router.delete("/:id", verifyToken, async (req, res) => {
  let id = req.params.id;
  await Applicant.findByIdAndDelete(id);

  return res.status(200).json({ id });
});

module.exports = router;
