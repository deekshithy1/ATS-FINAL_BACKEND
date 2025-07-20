import express from "express";
import {
  addVehicle,
  getVehiclesByCenterToday,
  getVehicleByBookingId,
  getVehicleByRegnNo
} from "../controllers/vehicleController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("ATS_ADMIN"), addVehicle);
router.get("/today", protect, authorize("ATS_ADMIN"), getVehiclesByCenterToday);
router.get("/:bookingId", protect, getVehicleByBookingId);
router.get('/regn/:regnNo', protect, getVehicleByRegnNo);

export default router;
