import express from "express";
import {
  getAllCenters,
  createCenter,
  getCenterByCode,
  suspendAts,
  unBlockATS,
} from "../controllers/atsCenterController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("SUPER_ADMIN"), getAllCenters);
router.post("/", protect, authorize("SUPER_ADMIN"), createCenter);
router.get("/allatsIds",protect,authorize("SUPER_ADMIN","OFFICER"),getAllCenters)
router.post("/unblockAts",protect,authorize("SUPER_ADMIN"),unBlockATS)
router.get(
  "/code/:code",
  protect,
  authorize("ATS_ADMIN", "SUPER_ADMIN"),
  getCenterByCode
);

//superAdminRoutes

router.post("/suspendAts",protect,authorize("SUPER_ADMIN"),suspendAts);
export default router;
