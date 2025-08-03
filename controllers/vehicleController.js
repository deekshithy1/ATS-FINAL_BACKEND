import asyncHandler from "express-async-handler";
import Vehicle from "../models/Vehicle.js";
import mongoose from "mongoose";
import ATSCenter from "../models/ATSCenter.js";
// @desc    Add a new vehicle entry
// @route   POST /api/vehicles
// @access  Private (ATS_ADMIN)
export const addVehicle = asyncHandler(async (req, res) => {
  const { regnNo, engineNo, chassisNo, laneEntryTime } = req.body;

  const atsCenterId = req.user.atsCenter;

  // Fetch ATS Center to get its code
  const atsCenter = await ATSCenter.findById(atsCenterId);
  if (!atsCenter) {
    res.status(400);
    throw new Error("Invalid ATS Center");
  }

  // Format current date as DDMMYYYY
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB").split("/").join(""); // DDMMYYYY

  // Count today's vehicles for this center
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));
  const vehicleCount = await Vehicle.countDocuments({
    atsCenter: atsCenterId,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  // Generate serial number and bookingId
  const serialNumber = String(vehicleCount + 1).padStart(4, "0"); // 0001, 0002...
  const bookingId = `${atsCenter.code}-${dateStr}-${serialNumber}`;

  // Check if regnNo already exists for today
  const duplicate = await Vehicle.findOne({ regnNo });
  if (duplicate) {
    res.status(400);
    throw new Error("Vehicle with this registration number already exists");
  }

  const vehicle = await Vehicle.create({
    bookingId,
    regnNo,
    engineNo,
    chassisNo,
    atsCenter: atsCenterId,
    laneEntryTime: laneEntryTime ? new Date(laneEntryTime) : new Date(),
  });

  res.status(201).json(vehicle);
});




// @desc    Get all vehicles entered today for ATS Center
// @route   GET /api/vehicles/today
// @access  Private (ATS_ADMIN)
export const getVehiclesByCenterToday = asyncHandler(async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const vehicles = await Vehicle.find({
    atsCenter: req.user.atsCenter,
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });
 

  res.json(vehicles);
});


// @desc    Get a single vehicle by booking ID
// @route   GET /api/vehicles/:bookingId
// @access  Private (Admin or Technician)
export const getVehicleByBookingId = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const vehicle = await Vehicle.findOne({ bookingId }).populate("atsCenter");
    
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  res.json(vehicle);
});


export const getVehicleByRegnNo = asyncHandler(async (req, res) => {
  const { regnNo } = req.params;

  const vehicle = await Vehicle.findOne({ regnNo }).populate("atsCenter");

  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  res.json(vehicle);
});
export const getAllVehiclesCOmplete = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find(); // optionally add filter here

  if (vehicles.length === 0) {
    return res.status(404).json({ message: "No vehicles found" });
  }

  res.status(200).json(vehicles);
});


export const getALLVehiclesAts=asyncHandler(async(req, res) => {
   const ats=req.user.atsCenter;
   

  try{
    const vehicle=await Vehicle.find({atsCenter:ats});
    if(vehicle.length===0){
      return res.status(404).json({message:"No vehicles found"});
    }
    vehicle.sort((a, b) => new Date(b.laneEntryTime) - new Date(a.laneEntryTime));

    res.status(200).json(vehicle);
  }
  catch(err){
    res.status(500).json({ message: "Server error", error: err.message });
  }
  })

  export const getVehiclesAtAllATS=asyncHandler(async(req,res)=>{
    try{
      const vehicles=await Vehicle.find({});
      if(vehicles.length===0){
        return res.status(404).json({message:"No vehicles found"});
      }
      res.status(200).json(vehicles);
    }
    catch(err){
      res.status(500).json({ message: "Server error", error: err.message });
    }
  })
  export const getVehiclesByATS=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try{
      const response=await Vehicle.find({atsCenter:id});
      if(response.length===0){
        return res.status(404).json({message:"No vehicles found"});
      }
      res.status(200).json(response);
    }
    catch(err){
      res.status(500).json({ message: "Server error", error: err.message})
    }
  })