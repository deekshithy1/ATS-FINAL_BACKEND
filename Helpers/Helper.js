import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import TestInstance from "../models/TestInstance.js";
import Vehicle from "../models/Vehicle.js";
// isCompleted.js (or inside same file if you prefer)

export const checkAndMarkCompleted = async (regnNo) => {
    const vehicle = await Vehicle.findOne({ regnNo });
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }
  
    const testInstance = await TestInstance.findOne({ vehicle: vehicle._id }).populate([
      { path: "visualTest" },
      { path: "functionalTest" },
    ]);
  
    if (
      testInstance &&
      testInstance?.visualTest?.isCompleted === true &&
      testInstance?.functionalTest?.isCompleted === true &&
      testInstance.status !== "COMPLETED"
    ) {
      testInstance.status = "COMPLETED";
      vehicle.status = "COMPLETED";
      await testInstance.save();
      await vehicle.save();
      return true;
    }
  
    return false;
  };
  