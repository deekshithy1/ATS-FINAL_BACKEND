import asyncHandler from "express-async-handler";
import Vehicle from "../models/Vehicle.js";
import TestInstance from "../models/TestInstance.js";
import NICLog from "../models/NICLog.js";

// @desc    Get vehicles ready for approval (by regnNo instead of bookingId)
// @route   GET /api/nic/ready
export const getVehiclesReadyForApproval = asyncHandler(async (req, res) => {
  // Step 1: Get completed vehicles for this ATS center
  const vehicles = await Vehicle.find({
    atsCenter: req.user.atsCenter,
    status: "COMPLETED",
  });

  // Step 2: Get already SENT logs
  const approvedLogs = await NICLog.find({ status: "SENT" }).select("vehicle");
  const sentVehicleIds = approvedLogs.map((log) => log.vehicle.toString());

  // Step 3: Filter out already sent vehicles
  const unsentVehicles = vehicles.filter(
    (v) => !sentVehicleIds.includes(v._id.toString())
  );

  const vehicleIds = unsentVehicles.map((v) => v._id);

  // Step 4: Get test instances for these vehicles
  const testInstances = await TestInstance.find({
    vehicle: { $in: vehicleIds },
  }).populate("submittedBy", "name email").populate("visualTest").populate("functionalTest");;

  // Step 5: Map test instances by vehicle ID
  const testMap = {};
  testInstances.forEach((test) => {
    const key = test.vehicle.toString();
    if (!testMap[key]) testMap[key] = [];
    testMap[key].push(test);
  });

  // Step 6: Attach testInstances to vehicles
  const response = unsentVehicles.map((vehicle) => {
    const vObj = vehicle.toObject();
    vObj.testInstances = testMap[vehicle._id.toString()] || [];
    return vObj;
  });

  res.json(response);
});

// @desc    Send approved vehicle data to NIC
// @route   POST /api/nic/send
// @access  ATS_ADMIN
export const sendToNIC = asyncHandler(async (req, res) => {
  const { regnNo} = req.body;

  const vehicle = await Vehicle.findOne({ regnNo }).populate("atsCenter");
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  const test = await TestInstance.findOne({ vehicle: vehicle._id });
  if (!test) {
    res.status(404);
    throw new Error("Test instance not found for this vehicle");
  }

  const payload = {
    bookingId: vehicle.bookingId, // still used for NIC payload
    registrationNumber: vehicle.regnNo,
    engineNumber: vehicle.engineNo,
    chassisNumber: vehicle.chassisNo,
    centerCode: vehicle.atsCenter.code,
    timestamp: new Date().toISOString(),
  };

  // TODO: Replace with real NIC API call
  const fakeNICResponse = {
    status: "SENT",
    message: "Data received by NIC",
  };

  await NICLog.create({
    bookingId: vehicle.bookingId,
    vehicle: vehicle._id,
    status: fakeNICResponse.status,
    response: fakeNICResponse,
  
  });

  vehicle.status = "SENT_TO_NIC";
  await vehicle.save();

  res.json({
    message: "Data sent to NIC successfully",
    response: fakeNICResponse,
  });
});

// @desc    Get NIC log for a vehicle using regnNo
// @route   GET /api/nic/log/:regnNo
// @access  ATS_ADMIN
export const getNICLogStatus = asyncHandler(async (req, res) => {
  const { regnNo } = req.params;

  const vehicle = await Vehicle.findOne({ regnNo });
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  const log = await NICLog.findOne({ vehicle: vehicle._id });

  if (!log) {
    res.status(404);
    throw new Error("No NIC log found for this vehicle");
  }

  res.json(log);
});

// @desc    Get all NIC logs (with vehicle info)
// @route   GET /api/nic/logs
// @access  ATS_ADMIN
export const getAllVehicles = asyncHandler(async (req, res) => {
  const logs = await NICLog.find().populate("vehicle");

  if (!logs || logs.length === 0) {
    res.status(404);
    throw new Error("No NIC logs found");
  }

  res.json(logs);
});
