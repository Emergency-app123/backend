const {
  getNotification,
  UpdateUser,
  getUser,
  adminLogin,
  changePassword,
  selectUser,
} = require("./admin.controller");
const { checkToken } = require("../../auth/token_validaiton");
const router = require("express").Router();

router.post("/admin-login", adminLogin);
router.post("/change-password", checkToken, changePassword);
router.post("/getUsers", checkToken, selectUser);
router.get("/getUser/:id", checkToken, getUser);
router.post("/updateUser/:id", checkToken, UpdateUser);
router.get("/show-notifications", checkToken, getNotification);

module.exports = router;
