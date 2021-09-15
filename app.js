require("dotenv").config();
const express = require("express");
const app = express();
const userRouter = require("./api/user/router.user");
var bodyParser = require("body-parser");

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use("/api/user", userRouter);

app.get("/", function (req, res) {
  res.cookie("cart", "test", { maxAge: 900000, httpOnly: true });
  res.send("Check your cookies. One should be in there now");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running ");
});
