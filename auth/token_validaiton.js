const {verify} =require("jsonwebtoken");
module.exports={
    checkToken:(req,res,next)=>{
        var token=req.get("Authorization")
        if(token){
            console.log("cookies",req.cookies)
          token=token.slice(7);
          verify(token,process.env.SECRET,(error,decoded)=>{
              if(error){
                  res.json({
                      success:0,
                      message:"Invalid Token"
                  })
              }
              else{
                  next()
              }
          })
        }
        else{
            res.json({
                success:0,
                message:"Access is denied! unauthorized user"
            })
        }
    }
}