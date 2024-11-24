const env=require('dotenv').config();
const jwt=require("jsonwebtoken");
const jwtSecret=process.env.JWT_SECRET;
const fetchuser = (req,res,next)=>{
  //Get user from jwt token and add id to req object
  const token=req.header('auth-token');
  if(!token){
    res.status(401).send({error:"Please authenticate using a valid token"});
  }
  try{
    const data=jwt.verify(token,jwtSecret);
    // console.log(data);
    req.user=data.user;
  }
  catch(error){
    console.error(error.message);
    res.status(401).send({error:"Please authenticate using a valid token"});
  }
  next();
}
module.exports=fetchuser;