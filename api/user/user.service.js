const pool=require('../../config/database');
module.exports={
    create:(data,callback)=>{
        pool.query(
            `INSERT INTO USER(name,contact,email,password,img_path)
            VALUES(?,?,?,?,?)
            `,
            [
                data.data_body.username,
                data.data_body.contact,
                data.data_body.email,
                data.data_body.password,
                data.data_body.img_path
            ],
            (error,results)=>{
                if(error)
                {
                   return callback(error)
                }
                return callback(null,results)
            }
        )
    },
    getUserByUserEmail:(data,callback)=>{
        console.log("emailssssss",data)
        // var query="select * from user where email = '"+data+"'";
        // console.log(query)
        pool.query("select * from user where email=?",[data],(error,results)=>{
            if(error)
            {
               return callback(error)
            }
            return callback(null,results[0])
        })
        },
        registerEmergency:(data,callback)=>{
            pool.query("select * from emergency_details where user_id=?",[data.ID],(error,results)=>{
                if(error)
                {
                    return callback(error)
                }
                else{
                    if(results.length>0)
                    {
                        console.log("check length",results.length)
                        return callback(null,results[0])
                    }
                    else{
                        pool.query(`INSERT INTO emergency_details(user_id,blood_group,insurance_number,contact_name,contact_number)
                        VALUES(?,?,?,?,?)
                        `,[data.ID,data.body.blood_group,data.body.insurance_number,data.body.contact_name,data.body.contact_number],(err,response)=>{
                            if(err)
                            {
                                return callback(err)
                            }
                            else{
                                return callback(null,response[0])
                            }
                        }
                        )}


                }
            })
        },
        UpdateRegisterEmergency:(data,callback)=>{
            pool.query("update emergency_details set blood_group=?,insurance_number=?,contact_name=?,contact_number=? where user_id=?",[data.body.blood_group,data.body.insurance_number,data.body.contact_name,data.body.contact_number,'1'],(err,results)=>{
                if(err)
                {
                    return callback(err)
                }
                else{
                    return callback(null,results[0])
                }                                
            })
        },
        getUserDetailsByImage:(data,callback)=>{
        pool.query(`select * from user where img_path=?`,[data],(err,result)=>{
            if(err)
            {
                return callback(err)
            }
            else{
                console.log("rs",result)
                return callback(null,result[0])                
            }
        })    
        },
        getRegisterMedicalRecord:(data,callback)=>{
            console.log("data",data)
            pool.query(`select * from medical_details where user_id='?'`,[data.userID],(error,results)=>{
                if(error)
                {
                    return callback(error)
                }
                else{
                    console.log("results",results)
                 if(results.length>0)
                 {

                    return callback(null,results[0])

                 }
                 else{
                     console.log("data",data.body.hlocation)
              pool.query(`INSERT INTO medical_details(hospital_location,user_id,contact_name,primary_contact,secondary_contact,remarks) VALUES(?,?,?,?,?,?)`,[data.body.hlocation,data.userID,data.body.contact_name,data.body.primary_contact,data.body.secondary_contact,data.body.remarks],(err,response)=>{
                    if(err)
                    {
                        console.log(err)
                        return callback(err)
                    }
                    else{
                        console.log(response)
                        return callback(null,response[0])
                    }
})

                 }
                }
            })
        },
        getUpdateMedicalRecord:(data,callback)=>{
            console.log(data)
            
        }
};