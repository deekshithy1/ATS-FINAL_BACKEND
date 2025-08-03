import express from "express";
import {
  BlockUser,
  createATSAdmin,

  createTechnician,
  getAllTechnicians,
  getAllUserAtCenter,
  getTechniciansByATS,
  unBlockUser,
} from "../controllers/userController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/ats-admin', protect, authorize('SUPER_ADMIN'), createATSAdmin);
router.post('/technician', protect, authorize('ATS_ADMIN',"SUPER_ADMIN"), createTechnician);
// router.get('/technicians', protect, authorize('ATS_ADMIN'), getAllTechnicians);
router.get('/technicians', protect, authorize('ATS_ADMIN'), getAllUserAtCenter);
router.get("/techniciansByAts/:id",protect,authorize("SUPER_ADMIN","OFFICER"),getTechniciansByATS)
router.post("/blockUser",protect,authorize("SUPER_ADMIN"),BlockUser);
router.post("/unblockUser",protect,authorize("SUPER_ADMIN"),unBlockUser);
export default router;