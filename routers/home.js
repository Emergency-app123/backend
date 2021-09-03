const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Hello World");
});
router.get("/login", (req, res, next) => {
  res.send("Login Successfully");
});

module.exports = router;
