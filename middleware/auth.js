const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res,next)=>{
    try{
        //extract jwt token
        //pending : other ways to fetch token
        const token = req.body.token;
        if(!token){
            return res.status(401).json({message:"No token provided",
                success:false,

            });
        }
        //verify the token
        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decoded);
            req.user = decoded;
        }catch(error){
            return res.status(401).json({message:"Invalid token",
                success:false,
                });
        }
        next();
    } catch(error){
        return res.status(401).json({
            message:"Invalid token",
            success:false,
        })
    }
}

exports.isStudent = (req,res,next) =>{
    try{
        if(req.user.role!== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a Procected Route for Student",
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"User role not matching",
        }
    )
    }
}

exports.isAdmin = (req,res,next) =>{
    try{
        if(req.user.role!== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a Procected Route for Admin",
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"User role not matching",
        }
    )
    }
}
