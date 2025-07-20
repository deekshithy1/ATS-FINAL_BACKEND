import express from "express";
import {
  startTestInstance,
  // submitTestResult,
  getTestStatusByBookingId,
  getTestInstancesByCenter,
  markTestAsComplete,
  getPendingVisualTests,
  submitVisualTest,
  getPendingFunctionalTestsByRule,
  submitFunctionalTest,
} from "../controllers/testController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/start", protect, authorize("TECHNICIAN"), startTestInstance);
// router.post("/submit", protect, authorize("TECHNICIAN"), submitTestResult);
router.get("/:bookingId/status", protect, getTestStatusByBookingId);
router.post("/completed", protect, authorize("TECHNICIAN"), markTestAsComplete);
router.get("/visual/pending", protect, authorize("TECHNICIAN", "ATS_ADMIN"), getPendingVisualTests);
router.post("/visual/submit", protect, authorize("TECHNICIAN", "ATS_ADMIN"), submitVisualTest);
router.get("/functional/pending/:rule", protect, authorize("TECHNICIAN", "ATS_ADMIN"), getPendingFunctionalTestsByRule);
router.post("/functional/submit", protect, authorize("TECHNICIAN", "ATS_ADMIN"), submitFunctionalTest);
router.get("/center/all", protect, getTestInstancesByCenter);

export default router;
