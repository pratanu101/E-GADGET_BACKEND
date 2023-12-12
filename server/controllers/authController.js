
const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel=require('../models/userModel');
const orderModel=require('../models/orderModel');
const jwt=require('jsonwebtoken');

// for testing
const test=(req,res)=>{
    res.send('test server ready');
}
// Register User API
const registerController=async(req,res)=>{
    try {
        const {name,email,password,phone,address}=req.body;
        if(!name){
            return res.send({message:'name is required'});
        }
        if(!email){
            return res.send({message:'email is required'});
        }
        if(!password){
            return res.send({message:'password is required'});
        }
        if(!phone){
            return res.send({message:'phone is required'});
        }
        if(!address){
            return res.send({message:'address is required'});
        }

        // checking existing user by email
        const existingUser=await userModel.findOne({email});
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:'Email Already Register'
            })
        }
        // secure the password using hashing
        const hpass=await hashPassword(password);

        // Save User Information
        const user=await new userModel({
            name,
            email,
            password:hpass,
            phone,
            address
        }).save();

        res.status(201).send({
            success:true,
            message:"User Register Successfully",
            user
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Register',
            error
        })
    }
}

// Login API 
const loginController=async (req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(404).send({
                success:false,
                error:'Invalid Email or Password'
            });
        }
        // user Checking by Email
        const user= await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                error:'Email is not Register'
            })
        }
        const match=await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({
                success:false,
                error:'Invalid Password'
            })
        }
        // jwt token
        const token= await jwt.sign({_id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"2d"});
        res.status(200).send({
            success:true,
            message:'Login Successfull',
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role
            },
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error:'Login Error',
            error
        })
    }
}

// get order
const getOrderController=async(req,res)=>{
    try {
        const order=await orderModel.find({buyer:req.user._id})
        .populate("products","-photo")
        .populate("buyer","name")
        res.json(order);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in fetch order",
            error
        });
    }
}


module.exports={
    test,
    registerController,
    loginController,
    getOrderController
}