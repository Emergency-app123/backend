require("dotenv").config();
const express=require("express");
const app=express();
const userRouter=require("./api/user/router.user");
var bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/api/user",userRouter)
app.use(express.json());

app.get('/', function(req, res) {
    res.cookie('cart', 'test', {maxAge: 900000, httpOnly: true});
    res.send('Check your cookies. One should be in there now');
});


app.listen(process.env.PORT,()=>{
    console.log("Server is running ")
})