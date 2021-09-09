const {
  create,
  getUserByUserEmail,
  getRegisterMedicalRecord,
  UpdateRegisterEmergency,
  getUserDetailsByImage,
  registerEmergency,
  getUpdateMedicalRecord,
  changePasswordRequest,
} = require("./user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: "AKIA4FRBGE4MOFZHCSGD",
  secretAccessKey: "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",
  region: "ap-south-1",
});

module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    const salt = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(body.password, salt);
    var new_body = {
      file: req.files[0].originalname,
      data_body: body,
    };
    create(new_body, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      } else {
        return res.status(200).json({
          success: 1,
          data: result,
        });
      }
    });
  },
  login: (req, res) => {
    console.log("hiiii");
    const body = req.body;
    console.log(req.body);
    getUserByUserEmail(body.email, (err, results) => {
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
  registerEmergencyDetails: (req, res) => {
    var body = req.headers;
    var token = body.authorization.split("Bearer");
    const decoded = jwt.verify(token[1].trim(), "qwerty123");
    var existingUser = decoded.result.id;
    if (existingUser !== "") {
      var new_user = {
        ID: existingUser,
        body: req.body,
      };
      registerEmergency(new_user, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        } else {
          return res.status(200).json({
            success: 1,
            data: result,
          });
        }
      });
    } else {
      return res.status(404).json({
        success: 0,
        message: "Token expired please Login again",
      });
    }
  },
  updateRegisterEmergencyDetails: (req, res) => {
    var body = req.headers;
    var token = body.authorization.split("Bearer");
    const decoded = jwt.verify(token[1].trim(), "qwerty123");
    var existingUser = decoded.result.id;
    if (existingUser !== "") {
      var new_user = {
        ID: existingUser,
        body: req.body,
      };
      UpdateRegisterEmergency(new_user, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        } else {
          return res.status(200).json({
            success: 1,
            data: result,
          });
        }
      });
    } else {
      return res.status(404).json({
        success: 0,
        message: "Token expired please Login again",
      });
    }
  },
  createMedicalDetails: (req, res) => {
    var body = req.headers;
    var token = body.authorization.split("Bearer");
    const decoded = jwt.verify(token[1].trim(), "qwerty123");
    var existingUser = decoded.result.id;
    if (existingUser !== "") {
      var new_user = {
        ID: existingUser,
        body: req.body,
      };
      UpdateRegisterEmergency(new_user, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        } else {
          return res.status(200).json({
            success: 1,
            data: result,
          });
        }
      });
    } else {
      return res.status(404).json({
        success: 0,
        message: "Token expired please Login again",
      });
    }
  },
  getFace: (req, res) => {
    var params = {
      Image: {
        S3Object: {
          Bucket: "facialrekognition123",
          Name: "5659C906-04B2-4B2C-8459-0FD432009047.jpg",
        },
      },
      Attributes: ["ALL"],
    };

    var Rekognition = new AWS.Rekognition({ apiVersion: "2016-06-27" });

    Rekognition.detectFaces(params, (err, data) => {
      if (err) {
        console.log("error", err);
      } else {
        var img = "5659C906-04B2-4B2C-8459-0FD432009047.jpg";
        console.log(JSON.stringify(data, null, "\t"));
        if (data !== "") {
          getUserDetailsByImage(img, (err, response) => {
            if (err) {
              return res.status(404).json({
                success: 0,
                message: "Something Went Wrong!",
              });
            } else {
              var data_response = {
                user_age: data.FaceDetails[0].AgeRange,
                Gender: data.FaceDetails[0].Gender,
                user_data: response,
              };
              return res.status(200).json({
                success: 1,
                data: data_response,
              });
            }
          });
        } else {
          return res.status(404).json({
            success: 0,
            message: "User is not found in database",
          });
        }
      }
    });
  },
  getMedicalRecord: (req, res) => {
    var user_body = req.body;
    var body = req.headers;
    var token = body.authorization.split("Bearer");
    const decoded = jwt.verify(token[1].trim(), "qwerty123");
    var existingUser = decoded.result.id;
    var user_data = {
      userID: existingUser,
      body: user_body,
    };
    getRegisterMedicalRecord(user_data, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      } else {
        return res.status(200).json({
          success: 1,
          data: results,
        });
      }
    });
  },
  UpdateMedicalRecord: (req, res) => {
    var headers = req.headers;
    var token = headers.authorization.split("Bearer");
    const decoded = jwt.verify(token[1].trim(), "qwerty123");
    var existingUser = decoded.result.id;
    var new_user = {
      data: existingUser,
      body: req.body,
    };
    if (existingUser) {
      getUpdateMedicalRecord(new_user, (err, results) => {
        if (err) {
          console.log(err);
        } else {
          console.log(results);
        }
      });
    } else {
      return res.status(404).json({
        success: 0,
        message: "Token expired, Please login again",
      });
    }
  },
  changePassword: (req, res) => {
    var body = req.body;
    const salt = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(body.password, salt);
    var headers = req.headers;
    var token = headers.authorization.split("Bearer");
    const decoded = jwt.verify(token[1].trim(), "qwerty123");
    var existingUser = decoded.result.id;
    var user_data = {
      userID: existingUser,
      password: body.password,
    };
    changePasswordRequest(user_data, (err, results) => {
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
