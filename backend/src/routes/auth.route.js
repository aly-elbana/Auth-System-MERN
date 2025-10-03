import express from "express";

// Controllers – handle business logic for each route
import {
  signup,
  login,
  logout,
  getAllUsers,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/auth.controller.js";

// Middlewares – for security and request limiting
import {
  loginLimiter,
  signupLimiter,
  forgotPasswordLimiter,
} from "../middlewares/rateLimit.js";
import { verifyToken } from "../middlewares/verifyToken.js";

// Create a new router instance
const router = express.Router();

/* 
  🔐 Check Auth Status
  Protected route – verifies JWT token and returns user info
*/
router.get("/check-auth", verifyToken, checkAuth);


/* 
  🚨 Get All Users
  TEMPORARY: Only for testing. Remove this in production!
*/
if (process.env.NODE_ENV !== "production") {
  router.get("/", getAllUsers);
}


/* 
  📝 User Registration
  Rate limited to prevent abuse
*/
router.post("/signup", signupLimiter, signup);


/* 
  🔑 User Login
  Rate limited to protect against brute-force attacks
*/
router.post("/login", loginLimiter, login);


/* 
  🚪 Logout
  Clears the token (cookie/session)
*/
router.post("/logout", logout);


/* 
  ✅ Email Verification
  Verifies user's email address via token
*/
router.post("/verify-email", verifyEmail);


/* 
  🔁 Forgot Password
  Sends a password reset link (rate limited)
*/
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);


/* 
  🔒 Reset Password
  Updates password based on token from email
*/
router.post("/reset-password/:token", resetPassword);


// Export the router to be used in main app
export default router;
