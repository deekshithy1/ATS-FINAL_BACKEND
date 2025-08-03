// import jwt from "jsonwebtoken";
// import asyncHandler from "express-async-handler";
// import User from "../models/User.js";

// export const protect = asyncHandler(async (req, res, next) => {
//   let token;
//   console.log("Protect middleware called");

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select("-password");
     
//       if (!req.user) {
//         res.status(401);
//         throw new Error("User not found");
//       }
    

//       next();
//     } catch (error) {
//       res.status(401);
//       throw new Error("Not authorized, token failed");
//     }
//   }

//   if (!token) {
//     res.status(401);
//     throw new Error("Not authorized, no token");
//   }
// });

// // Role-based authorization
// export const authorize = (...roles) => {
//   return (req, res, next) => {
//     if(user?.atsCenter?.isSuspended===true){
//       res.status(404);
//       throw new Error("ACCESS DENIED");
//     }
//     if (!roles.includes(req.user.role)) {
//       res.status(403);
//       throw new Error(`Role ${req.user.role} is not authorized to access this resource`);
//     }
//     next();
//   };
// };

import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// Middleware: Protect routes (JWT verification + user load + ATS suspension check)
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Populate atsCenter to access suspension status
      req.user = await User.findById(decoded.id)
        .select("-password")
        .populate("atsCenter");

      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      // ATS center suspension check
      if (
        req.user.atsCenter &&
        req.user.atsCenter.isSuspended === true
      ) {
        res.status(403);
        throw new Error("Access denied: ATS Center is suspended");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Middleware: Role-based authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Role ${req.user.role} is not authorized to access this resource`
      );
    }
    next();
  };
};

// Optional: Separate ATS check middleware (if needed)
export const checkAtsStatus = (req, res, next) => {
  if (
    req.user.atsCenter &&
    req.user.atsCenter.isSuspended === true
  ) {
    res.status(403);
    throw new Error("Access denied: ATS Center is suspended");
  }
  next();
};
