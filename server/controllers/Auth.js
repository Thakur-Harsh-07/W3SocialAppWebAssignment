const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//signup handler

exports.signup = async (req,res) => {
    try{
        // get data
        const{name, email, password} = req.body;
        // check if user already exist
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User Already Exist",
            });
        }
        // secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10);
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:"Error in hashing Password",
            });
        }

        // create entry for user
        const user = await User.create({
            name, email, password:hashedPassword,
        })
        return res.status(200).json({
            success:true,
            message:"User created successfully"
        });

    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered, please try again later"
        });
    }
    
}

// login
exports.login = async (req,res) => {
    try{
        // data fetch
        const{email, password} = req.body;
        // validation
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details"
            });
        }
        let user = await User.findOne({email});
        // if not registered
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is Not registered"
            });
        }
        const paylaod ={
            email:user.email,
            id:user._id,

        };
        // verify password and generate a JWT token
        if(await bcrypt.compare(password,user.password)){
            //password match
            let token = jwt.sign(paylaod,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expiresIn:new Date(Date.now()+ 3*24*60*60*1000),
                httpOnly:true,

            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"User logedin successfully"

            });
        }
        else{
            // password not matched
            return res.status(403).json({
                success:false,
                message:"Password incorrect"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login failure",
        })
    }
    
}