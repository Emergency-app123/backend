const express = require("express");
const app = express();
const bodyParser = require("body-parser");
database = require("./conections");
// const morgan = require('morgan');
const mongoose = require("mongoose");
app.use(bodyParser.json());
const homeRoutes = require("./routers/home");
app.use(function (err, req, res, next) {
  console.log("This is the invalid field ->", err.field);
  next(err);
});
app.use(`/`, homeRoutes);
app.listen(4500, () => {
  console.log("server is running http://localhost:4500");
});
