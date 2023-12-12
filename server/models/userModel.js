const mongoose=require('mongoose');

// create Users Schema
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        default:0
    }

},{timestamps:true});

// config model
const userModel=mongoose.model('users',userSchema);
module.exports=userModel;
console.log('User Model is Ready');