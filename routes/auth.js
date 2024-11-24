const express = require("express");
const router = express.Router();
const User=require("../models/User");
const {body, validationResult}=require("express-validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const env=require('dotenv').config();
const jwtSecret=process.env.JWT_SECRET;
//Route 1 - Create a User :POST "/api/auth/createuser" no login required
router.post("/createuser",[
    body("name","username should be atleast 3 characters").isLength({min:3}),
    body("email","Enter a valid email").isEmail(),
    body("password","Password should be atleast 5 characters").isLength({min:5}),
] ,async (req, res)   => {
    let success=false;
    //if there are errors, return bad request and the errors
    const error=validationResult(req);
    if(!error.isEmpty()){ 
        return res.status(400).json({success,error: error.array()});
    }

   

    try{
    //check whether user with same email exists
   let user = await User.findOne({email: req.body.email});
   if(user){

       return res.status(400).json({success,error: "Sorry a user with this email already exists"})
   }
   //hash password
   const salt=await bcrypt.genSalt(10);
   secPass=await bcrypt.hash(req.body.password,salt);

   user=await User.create({
        name:req.body.name,
        password:secPass,
        email:req.body.email,
    })
   const data={
    user:{id:user.id}
   }

    const authToken=jwt.sign(data,jwtSecret);
    

    // res.json({message: "User created successfully"}); 
    success=true;
    res.json({success,authToken});    
}
catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
    // .then(user=>res.json(user))
    // .catch(err=>{console.log(err) 
    //     res.json({error: "Please enter a unique email"})});
   
});

//Route 2 - Authenticate a User :POST "/api/auth/login" no login required
router.post("/login",[
    body("email","Enter a valid email").isEmail(),
    body("password","Password cannot be blank").exists(),
],async (req, res)   => {
    let success=false;
    //if there are errors, return bad request and the errors
    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()});
    }
    try{
         const user=await User.findOne({email: req.body.email});
         if(!user){

             return res.status(400).json({success,error: "Invalid credentials! please try to login with correct credentials"});
        }
            const passwordFromDatabase=user.password; 
            const passwordFromUser=req.body.password;
         const password=await bcrypt.compare(passwordFromUser,passwordFromDatabase);
         if(!password){
            
            return res.status(400).json({success,error: "Invalid credentials! please try to login with correct credentials"});
         }
         const data={
            user:{id:user.id}
         }
         const authToken=jwt.sign(data,jwtSecret);
         success=true;
        res.json({success,authToken});
    }
    catch(error){
        console.error(error.message);  
        res.status(500).send("Internal Server Error");
    }
})
//Route 3 - Get logged in user details :POST "/api/auth/getuser" login required
router.post("/getuser", fetchuser ,async (req,res)=>{
    try{
        const userId=req.user.id;
        const user=await User.findById(userId).select("-password");
        res.json(user);
    }
    catch(error){
        console.error(error.message);  
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;