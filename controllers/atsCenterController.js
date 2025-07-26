
import asyncHandler from 'express-async-handler';
import ATSCenter from '../models/ATSCenter.js';
// @desc    Create a new ATS Center
// @route   POST /api/centers
// @access  Private (SUPER_ADMIN only)
export const createCenter = asyncHandler(async (req, res) => {
  const { name, code, latitude, longitude } = req.body;

  const exists = await ATSCenter.findOne({ code });
  if (exists) {
    res.status(400);
    throw new Error('Center with this code already exists');
  }

  const center = await ATSCenter.create({
    name,
    code,
    latitude,
    longitude
  });

  res.status(201).json(center);
});

// @desc    Get all ATS Centers
// @route   GET /api/centers
// @access  Private (SUPER_ADMIN only)
export const getAllCenters = asyncHandler(async (req, res) => {
  const centers = await ATSCenter.find({});
  res.json(centers);
});

// @desc    Get ATS Center by Code
// @route   GET /api/centers/code/:code
// @access  Private (ATS_ADMIN, SUPER_ADMIN)
export const getCenterByCode = asyncHandler(async (req, res) => {
  const center = await ATSCenter.findOne({ code: req.params.code });

  if (!center) {
    res.status(404);
    throw new Error('ATS Center not found');
  }

  res.json(center);
});
