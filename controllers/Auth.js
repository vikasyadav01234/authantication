const bcrypt = require("bcrypt");
const User = require("../model/User");

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