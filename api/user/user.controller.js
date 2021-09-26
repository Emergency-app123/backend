const {
  create,
  changeContact,
  getUserByUserEmail,
  getRegisterMedicalRecord,
  UpdateRegisterEmergency,
  sendSaveNotify,
  saveNotifyToken,
  getUserDetailsByImage,
  registerEmergency,
  getUpdateMedicalRecord,
  changePasswordRequest,
  checkImageId,
  updateIncidentStatus,
  changeName,
} = require("./user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const { Rekognition } = require("aws-sdk");
const fs = require("fs");
var multiparty = require("multiparty");
var Buffer = require("buffer/").Buffer;
const { Readable } = require("stream");
var base64 = require("base-64");
const path = require("path");
const { Expo } = require("expo-server-sdk");

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY,
  region: "ap-south-1",
});
const s3 = new AWS.S3();

module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    const salt = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(body.password, salt);

    var Rekognition = new AWS.Rekognition({ apiVersion: "2016-06-27" });
    var params_new = {
      CollectionId: "face",
      Image: {
        S3Object: {
          Bucket: "facialrekognition123",
          Name: req.files[0].originalname,
        },
      },
    };
    Rekognition.indexFaces(params_new, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Something Went Wrong",
        });
      } else {
        var new_body = {
          FaceId: data.FaceRecords[0].Face.FaceId,
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
            console.log("Indexed", JSON.stringify(data));
            return res.status(200).json({
              success: 1,
              data: result,
            });
          }
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
      console.log("resultsss", results);
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
        let savedPushTokens = req.body.expoPushToken.data;
        var new_data = {
          userId: results.id,
          notifyToken: savedPushTokens,
        };
        saveNotifyToken(new_data, (err, result) => {
          if (err) {
            return res.status(500).json({
              success: 0,
              data: "Something Went Wrong",
            });
          } else {
            return res.status(200).json({
              success: 1,
              message: "login Successfully",
              token: token,
              UserId: results.id,
            });
          }
        });
      } else {
        return res.status(500).json({
          success: 0,
          data: "Invalid email or password",
        });
      }
    });
  },
  registerEmergencyDetails: (req, res) => {
    var body = req.headers;
    console.log("hello", req.body);
    var token = body.authorization.split("Bearer");
    const decoded = jwt.verify(token[1].trim(), "qwerty123");
    var existingUser = decoded.result.id;
    console.log("body", req.body.length);
    console.log("ID", existingUser);
    console.log(Object.keys(req.body).length);
    var new_user;

    if (Object.keys(req.body).length > 0) {
      console.log("has Some Data");
      new_user = {
        ID: existingUser,
        body: req.body,
      };
    } else {
      new_user = {
        ID: existingUser,
      };
    }
    console.log("new_user", new_user);

    registerEmergency(new_user, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      } else {
        console.log("ffffffresult", result);
        if (result == undefined) {
          return res.status(200).json({
            success: 0,
            message: "Send Some data",
          });
        } else {
          return res.status(200).json({
            success: 1,
            data: result,
          });
        }
      }
    });
  },
  updateRegisterEmergencyDetails: (req, res) => {
    console.log("Hello Data", req.body);
    var body = req.headers;
    var token = body.authorization.split("Bearer");
    const decoded = jwt.verify(token[1].trim(), "qwerty123");
    var existingUser = decoded.result.id;
    if (existingUser !== "") {
      var new_user = {
        ID: existingUser,
        body: req.body,
      };
      console.log(new_user);
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
    try {
      console.log("hiii");
      console.log("body", req.body);
      console.log("file", req.file);
      console.log("files", req.files);
      // var img = Buffer.from(path.basename(req.body.uri)).toString("base64");
      var base64Data = req.body.file.replace(/^data:image\/png;base64,/, "");
      // let objJsonStr = JSON.stringify(base64Data);
      // console.log(objJsonStr);

      // let objJsonB64 = Buffer.from(objJsonStr).toString("base64");

      const imageBuffer = Buffer.from(decodeURIComponent(base64Data), "base64");
      console.log("imageBuffer", imageBuffer);

      var params = {
        CollectionId: "face",
        FaceMatchThreshold: 90,
        Image: {
          Bytes: imageBuffer,
        },
        MaxFaces: 1,
      };
      var Rekognition = new AWS.Rekognition({ apiVersion: "2016-06-27" });
      Rekognition.searchFacesByImage(params, (err, data) => {
        if (err) {
          console.log("err", err);
          if (err.statusCode == 400) {
            return res.status(400).json({
              success: 0,
              message: "There are no faces in the image. Should be at least 1",
            });
          }
        } else {
          var new_params = {
            Attributes: ["ALL"],
            Image: {
              Bytes: imageBuffer,
            },
          };

          if (data.FaceMatches[0] !== undefined && data.FaceMatches[0] !== "") {
            Rekognition.detectFaces(new_params, (err, raw_data) => {
              if (err) {
                console.log("err", err);
                if (err.statusCode == 400) {
                  return res.status(400).json({
                    success: 0,
                    message:
                      "There are no faces in the image. Should be at least 1",
                  });
                }
              } else {
                checkImageId(data.FaceMatches[0].Face.FaceId, (err, result) => {
                  if (err) {
                    console.log("user is unable to found in database", err);
                  } else {
                    console.log("result", result);
                    const raw = {
                      Age: raw_data.FaceDetails[0].AgeRange.Low,
                      Gender: raw_data.FaceDetails[0].Gender.Value,
                      Name: result.name,
                      Contact: result.contact,
                      Email: result.email,
                    };
                    return res.status(200).json({
                      success: 1,
                      message: raw,
                    });
                  }
                });

                console.log(JSON.stringify(data, null, "\t"));
                console.log(JSON.stringify(raw_data, null, "\t"));
              }
            });
          } else {
            console.log("Face does not match in the database");
          }
        }
      });
    } catch (e) {
      console.log("e", e);
    }
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
    console.log(body);
    const salt = bcrypt.genSaltSync(10);
    body.NewPassword = bcrypt.hashSync(body.NewPassword, salt);
    var headers = req.headers;
    var token = headers.authorization.split("Bearer");
    const decoded = jwt.verify(token[1].trim(), "qwerty123");
    var existingUser = decoded.result.id;
    var user_data = {
      userID: existingUser,
      password: body.NewPassword,
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

  getNotify: (req, res) => {
    console.log(req.body);
    var headers = req.headers;
    var token = headers.authorization.split("Bearer");
    const decoded = jwt.verify(token[1].trim(), "qwerty123");
    var existingUser = decoded.result.id;
    let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
    var data = {
      userId: existingUser,
    };
    sendSaveNotify(data, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);

        if (result.key1 !== undefined) {
          if (!Expo.isExpoPushToken(result.notification)) {
            console.error(
              `Push token ${result.notification} is not a valid Expo push token`
            );
          }
          console.log("result", result);
          let messages = [];

          messages.push({
            to: result.key1.notification,
            sound: "default",
            body: `Hey Your friend ${result.key2.name} is in dangered his phone number ${result.key2.contact} please call him quickly`,
            data: { withSome: "data" },
          });
          let chunks = expo.chunkPushNotifications(messages);
          let tickets = [];
          (async () => {
            for (let chunk of chunks) {
              try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log("receipts", receipts);
                res.send({
                  success: 1,
                  data: receipts,
                });
                tickets.push(...receipts);
              } catch (error) {
                console.error(error);
              }
            }
          })();
          let receiptIds = [];
          for (let ticket of tickets) {
            if (ticket.id) {
              receiptIds.push(ticket.id);
            }
          }
          let receiptIdChunks =
            expo.chunkPushNotificationReceiptIds(receiptIds);
          (async () => {
            // Like sending notifications, there are different strategies you could use
            // to retrieve batches of receipts from the Expo service.
            for (let chunk of receiptIdChunks) {
              try {
                let receipts = await expo.getPushNotificationReceiptsAsync(
                  chunk
                );
                res.send({
                  success: 1,
                  data: receipts,
                });
                // The receipts specify whether Apple or Google successfully received the
                // notification and information about an error, if one occurred.
                for (let receiptId in receipts) {
                  let { status, message, details } = receipts[receiptId];
                  if (status === "ok") {
                    continue;
                  } else if (status === "error") {
                    console.error(
                      `There was an error sending a notification: ${message}`
                    );
                    if (details && details.error) {
                      // The error codes are listed in the Expo documentation:
                      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
                      // You must handle the errors appropriately.
                      console.error(`The error code is ${details.error}`);
                    }
                  }
                }
              } catch (error) {
                console.error(error);
              }
            }
          })();
        } else {
          console.log("Try again ");
        }
      }
    });
  },
  //Code to delete object from s3 Bucket
  deleteObject: (req, res) => {
    console.log("hi");
    var params = {
      Bucket: "facialrekognition123",
      Key: "7417457b-60db-405f-89ad-c036c10ca8c4.jpg",
    };
    s3.deleteObject(params, function (err, data) {
      if (err) console.log(err, err.stack);
      // error
      else console.log(data); // deleted
    });
  },
  saveUserlocation: (req, res) => {},
  setStatusReports: (req, res) => {
    console.log("hiii", req.body);
    var headers = req.headers;
    var token = headers.authorization.split("Bearer");
    const decoded = jwt.verify(token[1].trim(), "qwerty123");
    var existingUser = decoded.result.id;
    var data = {
      userId: existingUser,
    };
    updateIncidentStatus(data, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Something went wrong",
        });
      } else {
        console.log("Final result", result);
        return res.status(200).json({
          success: 1,
          message: "Data updated successfully",
        });
      }
    });
  },
  ChangeNameOfUser: (req, res) => {
    const body = req.body;
    console.log("check Body", body);
    var headers = req.headers;
    var token = headers.authorization.split("Bearer");
    const decoded = jwt.verify(token[1].trim(), "qwerty123");
    var existingUser = decoded.result.id;
    const new_body = {
      name: body.username,
      userId: existingUser,
    };
    changeName(new_body, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Something went wrong",
        });
      } else {
        return res.status(200).json({
          success: 1,
          message: "UserName change successfully",
        });
      }
    });
  },
  ChangeContactOfUser: (req, res) => {
    const body = req.body;
    console.log("check Body", body);
    var headers = req.headers;
    var token = headers.authorization.split("Bearer");
    const decoded = jwt.verify(token[1].trim(), "qwerty123");
    var existingUser = decoded.result.id;
    const new_body = {
      name: body.contact,
      userId: existingUser,
    };
    changeContact(new_body, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Something went wrong",
        });
      } else {
        return res.status(200).json({
          success: 1,
          message: "UserName change successfully",
        });
      }
    });
  },
};
