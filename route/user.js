const express =require("express");
const router = express.Router();

const {login, signup}=require("../controllers/Auth");
const {auth, isStudent, isAdmin} = require("../middleware/auth");
router.post("/login", login);
router.post("/signup", signup);
//test

router.get("/test", auth, (req,res)=>{
    res.json({
        success:true,
        message:"test",
        })
})

//protected Route
router.get("/student", auth, isStudent, (req, res) => {
    res.json({
        success:true,
        message:"You are a student",
    })
})

router.get("/admin", auth, isAdmin, (req,res)=>{
    res.json({
        success:true,
        message:"You are an admin",
        })
})

module.exports=router;