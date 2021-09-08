const {createPool}=require("mysql");
require("dotenv").config();
const pool =createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"emergency",
    connectionLimit:10
})

module.exports=pool;
