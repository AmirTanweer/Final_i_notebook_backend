const mongoose = require("mongoose");
// const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
 
const uri=process.env.MONGODB_URI;
const connectDB=async()=>{
    
    try{
        await mongoose.connect(uri);
        console.log("database connected");
    }
    catch(error){
        console.log(error);
    }
}
module.exports=connectDB

