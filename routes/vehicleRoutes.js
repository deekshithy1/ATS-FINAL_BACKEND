
import express from "express";
import {
  addVehicle,
  getVehiclesByCenterToday,
  getVehicleByBookingId,
  getVehicleByRegnNo,

  getAllVehiclesCOmplete,
  getALLVehiclesAts
} from "../controllers/vehicleController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("ATS_ADMIN"), addVehicle);
router.get("/today", protect, authorize("ATS_ADMIN"), getVehiclesByCenterToday);
router.get('/regn/:regnNo', protect, getVehicleByRegnNo);
router.get("/allvehicles",getAllVehiclesCOmplete);
router.get("/all", protect, authorize("ATS_ADMIN","TECHNICIAN"), getALLVehiclesAts);
router.get("/:bookingId", protect, getVehicleByBookingId);

export default router;