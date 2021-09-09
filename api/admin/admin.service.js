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
};
