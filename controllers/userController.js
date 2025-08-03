import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import ATSCenter from '../models/ATSCenter.js';

// @desc    Create ATS Admin (only by Super Admin)
// @route   POST /api/users/ats-admin
// @access  Private (SUPER_ADMIN only)
// controllers/userController.js
export const createATSAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, atsCenterCode } = req.body;

  if (!atsCenterCode) {
    res.status(400);
    throw new Error('Center code is required');
  }

  const center = await ATSCenter.findOne({ code: atsCenterCode });

  if (!center) {
    res.status(404);
    throw new Error('ATS Center not found');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const newUser = await User.create({
    name,
    email,
    password,
    role: 'ATS_ADMIN',
    atsCenter: center._id,
  });

  res.status(201).json({
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    atsCenter: center.code,
  });
});


// @desc    Create Technician (only by ATS Admin)
// @route   POST /api/users/technician
// @access  Private (ATS_ADMIN only)
export const createTechnician = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const newUser = await User.create({
    name,
    email,
    password,
    role: 'TECHNICIAN',
    atsCenter: req.user.atsCenter, // From logged-in ATS Admin
  });

  res.status(201).json({
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    atsCenter: newUser.atsCenter,
  });
});

// @desc    Get all Technicians under the same center (ATS Admin)
// @route   GET /api/users/technicians
// @access  Private (ATS_ADMIN only)
export const getAllTechnicians = asyncHandler(async (req, res) => {
  console.log('Fetching technicians for center:', req.user.atsCenter);
  const technicians = await User.find({
    role: 'TECHNICIAN',
    atsCenter: req.user.atsCenter
  }).select('-password');

  res.json(technicians);
});

export const getAllUserAtCenter = asyncHandler(async (req, res) => {
  console.log('Fetching technicians for center:', req.user.atsCenter);
  const technicians = await User.find({
    atsCenter: req.user.atsCenter
  }).select('-password');

  res.json(technicians);
});


export const getTechniciansByATS=asyncHandler(async(req,res)=>{
  const {id}=req.params;
  try{
    const response=await User.find({
      atsCenter:id
    });
    if(response.length===0){
      res.status(404).json("Users not found");
    }
    res.status(200).json(response);

  }
  catch(err){
    res.status(500).json({"message":"error"})
  }
})
export const BlockUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
 console.log(email)
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.isBlocked = true; // or any flag to represent blocked user
    await user.save();

    res.status(200).json({ message: "User has been blocked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error blocking user" });
  }
});
export const unBlockUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.isBlocked = false; // or any flag to represent blocked user
    await user.save();

    res.status(200).json({ message: "User has been blocked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error blocking user" });
  }
});