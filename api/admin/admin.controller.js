const {
  getAdminByAdminEmail,
  getNotificationFirst,
  updateUserData,
  changePasswordRequest,
  getAlluser,
  getuserById,
} = require("./admin.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  adminLogin: (req, res) => {
    console.log("Request Recieved");
    const body = req.body;
    console.log(req.body);
    getAdminByAdminEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log(results);
      if (!results) {
        return res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }
      const result = bcrypt.compareSync(body.password, results.password);
      if (result) {
        console.log("resp2222222222222", results);
        results.password = undefined;
        const token = jwt.sign(
          {
            result: results,
            username: results.username,
          },
          process.env.SECRET,
          {
            expiresIn: "1d",
          }
        );
        return res.json({
          success: 1,
          message: "login Successfully",
          token: token,
        });
      } else {
        return res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }
    });
  },
  changePassword: (req, res) => {
    var body = req.body;
    const salt = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(body.password, salt);
    var headers = req.headers;
    var token = headers.authorization.split("Bearer");
    const decoded = jwt.verify(token[1].trim(), "qwerty123");
    var existingAdmin = decoded.result.id;
    var admin_data = {
      adminID: existingAdmin,
      password: body.password,
    };
    changePasswordRequest(admin_data, (err, results) => {
      if (err) {
        return res.json({
          success: 0,
          message: "Something Went Wrong",
        });
      } else {
        return res.json({
          success: 1,
          message: "Password Changed Successfully",
        });
      }
    });
  },
  selectUser: (req, res) => {
    console.log("hiiii");
    getAlluser((err, results) => {
      if (err) {
        return res.json({
          success: 0,
          message: "Something Went Wrong",
        });
      } else {
        console.log("res", results);
        return res.json({
          success: 1,
          data: results,
        });
      }
    });
  },
  getUser: (req, res) => {
    console.log(req.body);
    console.log(req.params.id);
    userId = req.params.id;
    getuserById(userId, (err, results) => {
      if (err) {
        return res.json({
          success: 0,
          message: "Something Went Wrong",
        });
      } else {
        console.log("res", results);
        return res.json({
          success: 1,
          data: results,
        });
      }
    });
  },
  UpdateUser: (req, res) => {
    console.log("body", req.body);
    console.log(req.params.id);
    const req_body = {
      userId: req.params.id,
      body: req.body,
    };
    updateUserData(req_body, (err, result) => {
      if (err) {
        return res.json({
          success: 0,
          message: "Something Went Wrong",
        });
      } else {
        return res.json({
          success: 1,
          message: "Data Updated Successfully",
        });
      }
    });
  },
  getNotification: (req, res) => {
    console.log("request Recieved");
    getNotificationFirst((err, result) => {
      if (err) {
        return res.json({
          success: 0,
          message: "Something Went Wrong",
        });
      } else {
        console.log(result);
        return res.json({
          success: 1,
          message: "Notification get Successfully",
          data: result,
        });
      }
    });
  },
};
