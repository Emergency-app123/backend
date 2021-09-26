const pool = require("../../config/database");

module.exports = {
  create: (data, callback) => {
    pool.query(
      `INSERT INTO USER(name,contact,email,password,img_id)
            VALUES(?,?,?,?,?)
            `,
      [
        data.data_body.username,
        data.data_body.contact,
        data.data_body.email,
        data.data_body.password,
        data.FaceId,
      ],
      (error, results) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  getUserByUserEmail: (data, callback) => {
    console.log("emailssssss", data);
    // var query="select * from user where email = '"+data+"'";
    // console.log(query)
    pool.query("select * from user where email=?", [data], (error, results) => {
      if (error) {
        return callback(error);
      } else {
        console.log("results", results);
        return callback(null, results[0]);
      }
    });
  },
  registerEmergency: (data, callback) => {
    console.log("getting Data", data);
    pool.query(
      "select * from emergency_details where user_id=?",
      [data.ID],
      (error, results) => {
        if (error) {
          return callback(error);
        } else {
          console.log("results", results);
          if (results.length > 0) {
            console.log("check length", results.length);
            return callback(null, results[0]);
          } else {
            pool.query(
              `INSERT INTO emergency_details(user_id,blood_group,insurance_number,contact_name,contact_number)
                        VALUES(?,?,?,?,?)
                        `,
              [
                data.ID,
                data.body.blood_group,
                data.body.insurance_number,
                data.body.contact_name,
                data.body.contact_number,
              ],
              (err, response) => {
                if (err) {
                  return callback(err);
                } else {
                  return callback(null, response[0]);
                }
              }
            );
          }
        }
      }
    );
  },
  UpdateRegisterEmergency: (data, callback) => {
    console.log(data);
    pool.query(
      "update emergency_details set blood_group=?,insurance_number=?,contact_name=?,contact_number=? where user_id=?",
      [
        data.body.blood_group,
        data.body.insurance_number,
        data.body.name,
        data.body.contact,
        data.ID,
      ],
      (err, results) => {
        if (err) {
          console.log(err);
          return callback(err);
        } else {
          console.log(results);
          return callback(null, results[0]);
        }
      }
    );
  },
  getUserDetailsByImage: (data, callback) => {
    pool.query(`select * from user where img_path=?`, [data], (err, result) => {
      if (err) {
        return callback(err);
      } else {
        console.log("rs", result);
        return callback(null, result[0]);
      }
    });
  },
  getRegisterMedicalRecord: (data, callback) => {
    console.log("data", data);
    pool.query(
      `select * from medical_details where user_id='?'`,
      [data.userID],
      (error, results) => {
        if (error) {
          return callback(error);
        } else {
          console.log("results", results);
          if (results.length > 0) {
            return callback(null, results[0]);
          } else {
            console.log("data", data.body.hlocation);
            pool.query(
              `INSERT INTO medical_details(hospital_location,user_id,contact_name,primary_contact,secondary_contact,remarks) VALUES(?,?,?,?,?,?)`,
              [
                data.body.hlocation,
                data.userID,
                data.body.contact_name,
                data.body.primary_contact,
                data.body.secondary_contact,
                "Good",
              ],
              (err, response) => {
                if (err) {
                  console.log(err);
                  return callback(err);
                } else {
                  console.log(response);
                  return callback(null, response[0]);
                }
              }
            );
          }
        }
      }
    );
  },
  getUpdateMedicalRecord: (data, callback) => {
    console.log(data);
    pool.query(
      `update medical_details set hospital_location=?,contact_name=?,primary_contact=?,secondary_contact=?,remarks=?`,
      [
        data.body.hospital_location,
        data.body.contact_name,
        data.body.primary_contact,
        data.body.secondary_contact,
        data.body.remarks,
      ],
      (error, results) => {
        if (error) {
          console.log("error", error);
        } else {
          console.log("results", results);
        }
      }
    );
  },
  changePasswordRequest: (data, callback) => {
    console.log(data);
    pool.query(
      `update user set password=? where id=?`,
      [data.password, data.userID],
      (err, results) => {
        if (err) {
          return callback(error);
        } else {
          return callback(null, results[0]);
        }
      }
    );
  },
  checkImageId: (data, callback) => {
    pool.query(`select * from user where img_id=?`, [data], (err, result) => {
      if (err) {
        return callback(error);
      } else {
        return callback(null, result[0]);
      }
    });
  },
  saveLocation: (data, callback) => {},
  saveNotifyToken: (data, callback) => {
    pool.query(
      "select * from notifications where user_id=?",
      [data.userId],
      (err, response) => {
        if (err) {
          return callback(err);
        } else {
          if (response.length > 0) {
            return callback(null, response);
          } else {
            pool.query(
              "Insert into notifications(user_id,notification) values(?,?)",
              [data.userId, data.notifyToken],
              (err, response) => {
                if (err) {
                  return callback(err);
                } else {
                  return callback(null, response);
                }
              }
            );
          }
        }
      }
    );
  },
  sendSaveNotify: (data, callback) => {
    console.log("id", data.userId);

    pool.query(
      `
      SELECT *,medical_details.user_id as UserMainId from user INNER JOIN medical_details ON medical_details.primary_contact=user.contact OR medical_details.secondary_contact=user.contact INNER JOIN notifications ON notifications.user_id=user.id where user.id=? AND (Select id from user where report_incident=1 AND medical_details.user_id=user.id)`,
      [data.userId],
      (err, result) => {
        if (err) {
          return callback(err);
        } else {
          if (result.length > 0) {
            pool.query(
              `select * from user where id=?`,
              [result[0].UserMainId !== undefined ? result[0].UserMainId : ""],
              (bug, return_response) => {
                if (bug) {
                  return callback(err);
                } else {
                  var dt = {
                    key1: result[0],
                    key2: return_response[0],
                  };
                  return callback(null, dt);
                }
              }
            );
          }
        }
      }
    );
  },
  updateIncidentStatus: (data, callback) => {
    console.log("data", data);
    pool.query(
      `UPDATE user SET report_incident=? WHERE id=?`,
      [1, data.userId],
      (err, response) => {
        if (err) {
          return callback(err);
        } else {
          console.log("response", response);
          return callback(null, response);
        }
      }
    );
  },
  changeName: (data, callback) => {
    pool.query(
      `Update user set name=? where id =?`,
      [data.name, data.userId],
      (err, response) => {
        if (err) {
          return callback(err);
        } else {
          console.log("response", response);
          return callback(null, response);
        }
      }
    );
  },
  changeContact: (data, callback) => {
    pool.query(
      `Update user set contact=? where id =?`,
      [data.name, data.userId],
      (err, response) => {
        if (err) {
          return callback(err);
        } else {
          console.log("response", response);
          return callback(null, response);
        }
      }
    );
  },
};
