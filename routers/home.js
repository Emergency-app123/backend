const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Hello World");
});
router.get("/login", (req, res, next) => {
  res.send("Login Successfully");
});
router.get("/SignUp", (req, res, next) => {
  res.send("SignUp Successfully");
});

module.exports = router;
