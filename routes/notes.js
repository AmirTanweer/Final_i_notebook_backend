const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Note=require("../models/Notes");
const {body, validationResult}=require("express-validator");

//Route 1 - Get all notes GET "/api/notes/fetchallnotes" login required
router.get("/fetchallnotes",fetchuser,async(req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){ 
        return res.status(400).json({error: error.array()});
    }
    try{
            const notes=await Note.find({userId:req.user.id}).sort({date:-1}).select("-userId")
         res.json(notes);
    }
    catch (error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).send("Internal Server Error");
      }
      
})

// Route 2 - Create a new note POST "/api/notes/createnote" login required
router.post("/createnote",fetchuser,[
    
    body("title","Enter a valid title").isLength({min:3}),
    body("description","Description should be atleast 5 characters").isLength({min:5}),
],async(req,res)=>{

    const error=validationResult(req);
    if(!error.isEmpty()){ 
        return res.status(400).json({error: error.array()});
    }

    try{
        const UserId=req.user.id;
        const note=await Note.create({
            userId:UserId,
            title:req.body.title,
            description:req.body.description,
            tag:req.body.tag,
         
        })
        res.json(note);
    }
    catch (error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).send("Internal Server Error");
      }
      
    
})  

//Route 3 - Update an existing note PUT "/api/notes/updatenote/:id" login required
router.put("/updatenote/:id",fetchuser,[
    
    body("title","Enter a valid title").isLength({min:3}),
    body("description","Description should be atleast 5 characters").isLength({min:5}),
],async(req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){ 
        return res.status(400).json({error: error.array()});
    }
    const {title,description,tag}=req.body;
    try{
              const newNote={};
              if(title){newNote.title=title};
              if(description){newNote.description=description};
              if(tag){newNote.tag=tag};

              let note=await Note.findById(req.params.id);
              if(!note){
                res.status(404).send("Not Found");
              }
              if(note.userId.toString()!==req.user.id){
                res.status(401).send("Not Allowed");
              }
              note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
              res.json(note);
             
    }
    catch (error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).send("Internal Server Error");
      }
      
})

//Route 4 - Delete an existing note DELETE "/api/notes/deletenote/:id" login required
router.delete("/deletenote/:id",fetchuser,async(req,res)=>{
    try{
          let note=await Note.findById(req.params.id);
          if(!note){
            res.status(404).send("Not Found");
          }
          if(note.userId.toString()!==req.user.id){
            res.status(401).send("Not Allowed");
          }
          note=await Note.findByIdAndDelete(req.params.id);
          res.json({"Success":"Note has been deleted"});
    }
    catch (error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).send("Internal Server Error");
      }  
      
})   

module.exports=router;