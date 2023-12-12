const jwt=require('jsonwebtoken');
const userModel=require('../models/userModel');

const requireSignin=async(req,res,next)=>{
    try {
        const decode=jwt.verify(req.headers.authorization,process.env.JWT_SECRET_KEY);
        req.user=decode;
        next();
    } catch (error) {
        console.log(error)
        
    }
}

// checking Admin
const isAdmin= async(req,res,next)=>{
    try {
          const user=await userModel.findById(req.user._id);
          if(user.role !== 1){
            return res.status(401).send({
                success:false,
                message:"unauthorized Access"
            })
          }else{
            next();
          }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            error,
            message: "Error in admin middelware",
          });
    }
}


module.exports={
    requireSignin,
    isAdmin
}