const bcrypt = require("bcrypt");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//signup route handler
exports.signup = async (req, res) => {
    try{
        //get data
        const {name, email, password, role} = req.body;
        //check if user aleready exist
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({message: "User already exist",
                success:false,
            });
        }

        //secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err){
            return res.status(500).json({message: "Something went wrong",
                success:false,
                });
        }
        //create entry for user
        const user = await User.create({
            name,email,password:hashedPassword,role
        })
        res.status(201).json({message: "User created successfully",
            success:true,
        })

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message: "Something went wrong",
        })
    }
}

//login
exports.login = async (req, res) => {
    try{
        //get data
        const {email, password} = req.body;
        //validation onemail and password
        if(!email || !password){
            return res.status(400).json({message: "Please provide email and password",
                success:false,
                });
        }
        //check registered user
        const user = await User.findOne({email});
        //if no registered user
        if(!user){
            return res.status(400).json({message: "User not registered",
                success:false,
            });
        }
        const payload = {
            email:user.email,
            id:user._id,
            role:user.role,
        }
        //verify password and genrate a jwt token
        if(await bcrypt.compare(password,user.password)){
            let token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1d"});
            user.token=token
            user.password=undefined;
            const options = {
                expires: new Date(Date.now() + 1000 * 60 * 60 *
                24 * 7),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200)
            .json({
                success:true,
                token,
                user,
                message:"User Logged in successfully",
            });
        }
        else{
            return res.status(400).json({message: "Invalid credentials",
                success:false,
            });
        }
    }
    catch(error){
        consol.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }
}