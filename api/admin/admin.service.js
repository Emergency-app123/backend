const pool = require("../../config/database");
module.exports = {
  getAdminByAdminEmail: (data, callback) => {
    console.log("emailssssss", data);
    // var query="select * from user where email = '"+data+"'";
    // console.log(query)
    pool.query(
      "select * from admin where username=?",
      [data],
      (error, results) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
  changePasswordRequest: (data, callback) => {
    console.log(data);
    pool.query(
      `update admin set password=? where id=?`,
      [data.password, data.adminID],
      (err, results) => {
        if (err) {
          return callback(error);
        } else {
          return callback(null, results[0]);
        }
      }
    );
  },
  getAlluser: (callback) => {
    pool.query("select * from user", (err, data) => {
      if (err) {
        return callback(err);
      } else {
        console.log(data);
        return callback(null, data);
      }
    });
  },
  getuserById: (data, callback) => {
    pool.query(`select * from user where id =?`, [data], (err, response) => {
      if (err) {
        return callback(err);
      } else {
        console.log("response", response);
        return callback(null, response);
      }
    });
  },
  updateUserData: (data, callback) => {
    console.log(data);
    pool.query(
      `update user set name=?,contact=?,email=? where id=?`,
      [data.body.name, data.body.contact, data.body.email, data.userId],
      (err, result) => {
        if (err) {
          return callback(err);
        } else {
          return callback(null, result);
        }
      }
    );
  },
  getNotificationFirst: (callback) => {
    pool.query(`select * from user where report_incident=1`, (err, result) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null, result);
      }
    });
  },
};
