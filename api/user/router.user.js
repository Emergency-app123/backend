const {createUser,login,getMedicalRecord,UpdateMedicalRecord,registerEmergencyDetails,updateRegisterEmergencyDetails,getFace} = require("./user.controller")
const router =require("express").Router();
const {checkToken}=require("../../auth/token_validaiton")
const aws = require("aws-sdk");
var multer = require("multer");
var multerS3 = require("multer-s3");

const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_BUCKET_REGION,
  });
  
  var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: "facialrekognition123",
      acl: "public-read",
      key: function (req, file, cb) {
        cb(null, path.basename(file.originalname));
      },
    }),
  });

router.post("/",upload.array("photo"),createUser)
router.post("/login",login)
router.post("/emergency-details",checkToken,registerEmergencyDetails)
router.put("/update_health_details",checkToken,updateRegisterEmergencyDetails)
router.post("/detect-face",checkToken,getFace)
router.post('/medicalRecord',checkToken,getMedicalRecord)
router.post('/Update-medical-records',UpdateMedicalRecord)
module.exports=router;