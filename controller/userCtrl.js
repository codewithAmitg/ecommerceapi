const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongodbId = require("../utils/validateMongodbid");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require('jsonwebtoken');

// Create a User
const createUser = asyncHandler(async (req, res) =>{
    const email = req.body.email;
    const findUser =await User.findOne({email: email});
    if(!findUser){
        //create a new User
        const newUser = await User.create(req.body);
        res.json(newUser);
    }else{
        throw new Error('User Already Exists');
    }
});

// Login a user
const loginUserCtrl = asyncHandler(async(req,res) => {
    const { email, password } = req.body;
    // console.log(email, password);
    //check if user exists or not
    const findUser = await User.findOne({email});
    if(findUser && (await findUser.isPasswordMatched(password))){
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken: refreshToken,
            },
            {
                new:true
            }
        );
        res.cookie("refreshToken",refreshToken,{
           httpOnly:true,
           maxAge: 72 * 60 * 60 * 1000, 
        });
        res.json({
            id:findUser?._id,
            firstname:findUser?.lastname,
            lastname: findUser?.lastname,
            email:findUser?.email,
            mobile:findUser?.mobile,
            token:generateToken(findUser?._id),
        });
    }else{
        throw new Error("invalid Credentials")
    }
});
//handle refresh token

const handleRefreshToken = asyncHandler(async(req,res)  =>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if(!user) throw new Error("No Refresh token present in db or not matched !");
    jwt.verify(refreshToken,process.env.JWT_SECRET, (err, decoded) => {
        if(err || user.id !== decoded.id){
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });
});

//logout functionality

const logout = asyncHandler(async(req, res) => {

    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if(!user){
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); //forbidden
    } 
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204); //forbidden
});
// Upate a user

const updateaUser =asyncHandler(async(req,res) =>{
    const { _id } = req.user;
    try{
        const updateaUser = await User.findByIdAndUpdate(
            _id, {
            firstname:req?.body?.firstname,
            lastname:req?.body?.lastname,
            email:req?.body?.email,
            mobile:req?.body?.mobile,
            },
            {
                new:true,
            }
        );
        res.json(updateaUser);
    }catch(error){
        throw new  Error(error);
    }
});

//Get all users

const getallUser = asyncHandler(async(req,res) =>{
    try{
        const getUsers =await User.find();
        res.json(getUsers);
    }catch(error){
        throw new Error(error);
    }
});

// Get a single user

const getUser = asyncHandler(async(req,res) =>{
    const { id } =req.params;
    validateMongodbId(id);
    try{
        const getUser = await User.findById(id);
        res.json({
            getUser,
        });
    }catch(error){
        throw new Error(error);
    }
});

// Delete a single user

const deleteaUser = asyncHandler(async(req,res) =>{
    const { id } =req.params;
    validateMongodbId(id);

    try{
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser,
        });
    }catch(error){
        throw new Error(error);
    }
});

const blockUser = asyncHandler(async(req,res) =>{
    const { id } = req.params;
    validateMongodbId(id);
    try{
        const block = await User.findByIdAndUpdate(
           id,
           {
            isBlocked:true,
           },
           {
            new:true,
           } 
        );
        res.json({
            message:"User Blocked",
        });

    }catch(error){
        throw new Error(error);
    }
});
const unblockUser = asyncHandler(async(req,res) =>{
    const { id } = req.params;
    validateMongodbId(id);
    try{
        const unblock = await User.findByIdAndUpdate(
           id,
           {
            isBlocked:false,
           },
           {
            new:true,
           } 
        );
        res.json({
            message:"User UnBlocked",
        });
    }catch(error){
        throw new Error(error);
    }
});

module.exports = { 
    createUser, 
    loginUserCtrl, 
    getallUser,
    getUser,
    deleteaUser,
    updateaUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
 };