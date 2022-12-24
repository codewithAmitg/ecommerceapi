const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");

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

const loginUserCtrl = asyncHandler(async(req,res) => {
    const { email, password } = req.body;
    // console.log(email, password);
    //check if user exists or not
    const findUser = await User.findOne({email});
    if(findUser && (await findUser.isPasswordMatched(password))){
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
 };