import asyncHandler from "express-async-handler";
import TestInstance from "../models/TestInstance.js";
import Vehicle from "../models/Vehicle.js";
import VisualTest from "../models/VisualTest.js";


// @desc Start test instance
// @route POST /api/test/start
// @access Technician
export const startTestInstance = asyncHandler(async (req, res) => {
  const { regnNo } = req.body;

  const vehicle = await Vehicle.findOne({ regnNo });
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  const existing = await TestInstance.findOne({ vehicle: vehicle._id });
  if (existing) {
    res.status(400);
    throw new Error("Test instance already exists");
  }

  const testInstance = await TestInstance.create({
    bookingId: vehicle.bookingId,
    vehicle: vehicle._id,
    status: "IN_PROGRESS",
    submittedBy: req.user._id,
  });

  vehicle.status = "IN_PROGRESS";
  await vehicle.save();

  res.status(201).json(testInstance);
});



// @route   GET /api/test/visual/pending
// @access  Private (Technician / Admin)
export const getPendingVisualTests = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({ atsCenter: req.user.atsCenter });

  const pendingVisuals = [];

  for (const vehicle of vehicles) {
    const visualTest = await VisualTest.findOne({ vehicle: vehicle._id });
    if (!visualTest || visualTest.isCompleted === false) {
      pendingVisuals.push(vehicle.regnNo);
    }
  }

  res.json({ pending: pendingVisuals });
});



// @route   POST /api/test/visual/submit
// @access  Private (Technician)
export const submitVisualTest = asyncHandler(async (req, res) => {
  const { regnNo, rules } = req.body;
  console.log("Submitting visual test for:", regnNo, "with rules:", rules);
  if (!regnNo || !rules || typeof rules !== "object") {
    res.status(400);
    throw new Error("regnNo and visual rules are required");
  }

  const vehicle = await Vehicle.findOne({ regnNo });
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  let visualTest = await VisualTest.findOne({ vehicle: vehicle._id });

  if (!visualTest) {
    visualTest = new VisualTest({
      vehicle: vehicle._id,
      bookingId: vehicle.bookingId,
    });
  }

  // Assign all rule values
  for (const key in rules) {
    if (visualTest.schema.path(key)) {
      visualTest[key] = rules[key];
    }
  }

  visualTest.isCompleted = true;
  await visualTest.save();

  res.status(200).json({ message: "Visual test submitted successfully" });
});


// @desc Submit test result (visual or functional)
// @route POST /api/test/submit
// @access Technician

// for now we will not implement this function

// export const submitTestResult = asyncHandler(async (req, res) => {
//   const { regnNo, visualTests, functionalTests } = req.body;

//   const vehicle = await Vehicle.findOne({ regnNo });
//   if (!vehicle) {
//     res.status(404);
//     throw new Error("Vehicle not found");
//   }

//   const testInstance = await TestInstance.findOne({ vehicle: vehicle._id });
//   if (!testInstance) {
//     res.status(404);
//     throw new Error("Test instance not found");
//   }

//   if (visualTests) {
//     testInstance.visualTests = {
//       ...testInstance.visualTests,
//       ...visualTests,
//     };
//   }

//   if (functionalTests) {
//     testInstance.functionalTests = {
//       ...testInstance.functionalTests,
//       ...functionalTests,
//     };
//   }

//   await testInstance.save();

//   res.status(200).json({
//     message: "Test result updated",
//     status: testInstance.status,
//   });
// });

// @desc Get test status by regnNo
// @route GET /api/test/:regnNo/status
// @access Private
export const getTestStatusByBookingId = asyncHandler(async (req, res) => {
  const { regnNo } = req.params;

  const vehicle = await Vehicle.findOne({ regnNo });
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  const testInstance = await TestInstance.findOne({ vehicle: vehicle._id }).populate(
    "submittedBy",
    "name role"
  );

  if (!testInstance) {
    res.status(404);
    throw new Error("Test instance not found");
  }

  res.json({
    bookingId: testInstance.bookingId,
    status: testInstance.status,
    visualTests: testInstance.visualTests || {},
    functionalTests: testInstance.functionalTests || {},
    submittedBy: testInstance.submittedBy || null,
  });
});

// @desc Get all test instances by technician's center
// @route GET /api/test/center/all
// @access ATS_ADMIN
export const getTestInstancesByCenter = asyncHandler(async (req, res) => {
  const atsCenterId = req.user.atsCenter;

  const vehicles = await Vehicle.find({ atsCenter: atsCenterId }).select("_id");

  const testInstances = await TestInstance.find({
    vehicle: { $in: vehicles.map((v) => v._id) },
  })
    .populate("vehicle", "regnNo bookingId status")
    .populate("submittedBy", "name role");

  res.json(testInstances);
});

// @desc Mark test as complete (manual trigger)
// @route POST /api/test/complete
// @access Technician
export const markTestAsComplete = asyncHandler(async (req, res) => {
  const { regnNo } = req.body;

  const vehicle = await Vehicle.findOne({ regnNo });
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  const testInstance = await TestInstance.findOne({ vehicle: vehicle._id });
  if (!testInstance) {
    res.status(404);
    throw new Error("Test instance not found");
  }

  const isVisualDone =
    testInstance.visualTests &&
    Object.keys(testInstance.visualTests).length > 0;
  const isFunctionalDone =
    testInstance.functionalTests &&
    Object.keys(testInstance.functionalTests).length > 0;

  if (!isVisualDone || !isFunctionalDone) {
    res.status(400);
    throw new Error("Both visual and functional tests must be submitted before completion.");
  }

  testInstance.status = "COMPLETED";
  await testInstance.save();

  vehicle.status = "COMPLETED";
  vehicle.laneExitTime = new Date();
  await vehicle.save();

  res.json({ message: "Test marked as completed successfully." });
});
