import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import TestInstance from "../models/TestInstance.js";
import Vehicle from "../models/Vehicle.js";

export const isCompleted = asyncHandler(async (req, res) => {
  const { regNo } = req.body;

  const vehicle = await Vehicle.findOne({ regnNo: regNo });
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  const testInstance = await TestInstance.findOne({ vehicle: vehicle._id }).populate([
    { path: "visualTest" },
    { path: "functionalTest" },
  ]);


   if(testInstance&&
    testInstance?.visualTest?.isCompleted===true&&testInstance.functionalTest?.isCompleted===true&&
        testInstance.status !== "COMPLETED"
   ){
    testInstance.status="COMPLETED";
    vehicle.status=="COMPLETED";
    await testInstance.save();
    await vehicle.save();
    return true;

   }
   return false;
});
