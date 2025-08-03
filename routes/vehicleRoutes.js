
import express from "express";
import {
  addVehicle,
  getVehiclesByCenterToday,
  getVehicleByBookingId,
  getVehicleByRegnNo,

  getAllVehiclesCOmplete,
  getALLVehiclesAts,
  getVehiclesAtAllATS,
  getVehiclesByATS
} from "../controllers/vehicleController.js";

import { protect, authorize, checkAtsStatus } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("ATS_ADMIN"), addVehicle);
router.get("/today", protect, authorize("ATS_ADMIN"), getVehiclesByCenterToday);
router.get('/regn/:regnNo', protect, getVehicleByRegnNo);
router.get("/allvehicles",getAllVehiclesCOmplete);
router.get("/getVehicles",protect,authorize("SUPER_ADMIN","OFFICER"),getVehiclesAtAllATS);
router.get("/getVehicles/:id",protect,authorize("SUPER_ADMIN","OFFICER"),getVehiclesByATS);
router.get("/all", protect,checkAtsStatus, authorize("ATS_ADMIN","TECHNICIAN","ATS_OWNER","MVI"), getALLVehiclesAts);
router.get("/:bookingId", protect, getVehicleByBookingId);

export default router;