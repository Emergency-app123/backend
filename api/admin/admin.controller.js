const {
  getAdminByAdminEmail,
  changePasswordRequest,
} = require("./admin.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  adminLogin: (req, res) => {
    console.log("hiiii");
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
            username: results.email,
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
};
