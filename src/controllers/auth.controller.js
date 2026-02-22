const userModel=require('../models/user.model')




function userRegisterController(req,res) {
    const {name,email,password}=req.body
    console.log('register route is here ')
}


module.exports={
    userRegisterController,
}