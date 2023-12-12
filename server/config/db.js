const express=require('express');
const mongoose=require('mongoose');

const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Mongodb connected to server`)
     } catch (error) {
        console.log(`database error in ${error}`)
    }
}

module.exports=connectDB;