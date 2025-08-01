import express from "express";
import {
  createATSAdmin,

  createTechnician,
  getAllTechnicians,
  getAllUserAtCenter,
  getTechniciansByATS,
} from "../controllers/userController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/ats-admin', protect, authorize('SUPER_ADMIN'), createATSAdmin);
router.post('/technician', protect, authorize('ATS_ADMIN'), createTechnician);
// router.get('/technicians', protect, authorize('ATS_ADMIN'), getAllTechnicians);
router.get('/technicians', protect, authorize('ATS_ADMIN'), getAllUserAtCenter);
router.get("/techniciansByAts/:id",protect,authorize("SUPER_ADMIN","OFFICER"),getTechniciansByATS)
export default router;