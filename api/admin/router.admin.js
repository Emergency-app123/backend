const { adminLogin, changePassword } = require("./admin.controller");
const { checkToken } = require("../../auth/token_validaiton");
const router = require("express").Router();

router.post("/", checkToken, adminLogin);
router.post("/change-password", checkToken, changePassword);
module.exports = router;
