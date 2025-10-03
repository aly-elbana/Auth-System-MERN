// Import the User model from the database schema
import { User } from "../models/user.model.js";

// Import bcrypt for securely hashing passwords
import bcrypt from "bcrypt";

// Utility functions to generate verification tokens and JWT cookies
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

// Email handlers for different user actions
import {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendPasswordResetSuccessEmail
} from "../mailtrap/emails.js";

// Import crypto for generating secure random tokens
import crypto from "crypto";

// ====================================================================================
// 🔁 Automatically delete unverified users after token expires
// ====================================================================================
setInterval(async () => {
    try {
        const now = Date.now();

        // Find all users whose verification token has expired AND are not verified
        const expiredUsers = await User.find({
            isVerified: false,
            verificationTokenExpiresAt: { $lt: now }
        });

        if (expiredUsers.length > 0) {
            // Delete them from the database
            await User.deleteMany({
                isVerified: false,
                verificationTokenExpiresAt: { $lt: now }
            });

            console.log(`🗑️ Deleted ${expiredUsers.length} expired unverified account(s).`);
        }
    } catch (error) {
        console.error("❌ Error deleting expired unverified users:", error.message);
    }
}, 60 * 60 * 1000); // Runs every 1 hour

// ====================================================================================
// 🚨 DEVELOPMENT ONLY: Get all users (Do not expose in production)
// ====================================================================================
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            count: users.length,
            users,
        });
    } catch (error) {
        console.error("❌ Error fetching users:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching users",
        });
    }
};

// ====================================================================================
// 📝 User Signup Controller
// ====================================================================================
// Controller function to handle user signup logic
export const signup = async (req, res) => {
    // Extract the necessary fields from the request body
    const { email, password, name } = req.body;

    console.log("👉 Signup request received:", { email, name });

    try {
        // ✅ Step 1: Validate input – Ensure all required fields are present
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "All fields are required (email, password, name).",
            });
        }

        // ✅ Step 2: Validate password length (for basic security)
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long.",
            });
        }

        // ✅ Step 3: Check if a user with the same email already exists
        // This avoids duplicate accounts and enforces uniqueness
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "A user with this email already exists.",
            });
        }

        // ✅ Step 4: Hash the user's password securely before saving
        // bcrypt hashes the password with 12 salt rounds to prevent reverse engineering
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log("🔐 Password hashed");

        // ✅ Step 5: Generate a unique verification token for email verification
        // This will be sent via email and has a 24-hour expiry time
        const verificationToken = generateVerificationToken(); // e.g., a UUID or random string
        const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours in ms
        console.log("🔑 Verification token generated");

        // ✅ Step 6: Create and save the new user in the database
        // We're saving the hashed password and verification token
        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt,
        });
        console.log("✅ User created:", user._id);

        // ✅ Step 7: Generate a JWT and set it as an HTTP-only cookie
        // This helps the frontend know the user is authenticated
        generateTokenAndSetCookie(res, user._id);
        console.log("🍪 JWT cookie set");

        // ✅ Step 8: Send a verification email with the token to the user's inbox
        await sendVerificationEmail(user.email, verificationToken);
        console.log("📧 Verification email sent");

        // ✅ Step 9: Respond to the client with success (excluding password)
        // The frontend will use this to redirect the user to the verification page
        return res.status(201).json({
            success: true,
            message:
                "User created successfully. Please check your email to verify your account.",
            user: {
                ...user._doc,
                password: undefined, // Never send back the password (even hashed)
            },
        });
    } catch (error) {
        // ❌ Step 10: Catch and handle unexpected errors
        console.error("❌ Signup error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error during signup: " + error.message,
        });
    }
};

// ====================================================================================
// 🔐 User Login Controller
// ====================================================================================
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required (email and password).",
            });
        }

        // 2. Look for user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // 3. Ensure email is verified before login
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in.",
            });
        }

        // 4. Compare provided password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // 5. Set JWT token in cookie
        generateTokenAndSetCookie(res, user._id);
        console.log("🔓 User logged in");

        // 6. Update last login timestamp
        user.lastLogin = Date.now();
        await user.save();

        // 7. Return successful login response
        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.error("❌ Login error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error during login.",
        });
    }
};

// ====================================================================================
// 🚪 User Logout Controller
// ====================================================================================
export const logout = async (req, res) => {
    try {
        // Clear the authentication cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("❌ Logout error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error during logout.",
        });
    }
};

// ====================================================================================
// ✅ Email Verification Controller
// ====================================================================================
export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        // 1. Look for user with matching token that hasn't expired
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code.",
            });
        }

        // 2. Mark user as verified and clear verification fields
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        console.log("✅ User verified:", user._id);

        // 3. Send welcome email after verification
        await sendWelcomeEmail(user.email, user.name);
        console.log("📧 Welcome email sent");

        // 4. Automatically log in the user after verification
        generateTokenAndSetCookie(res, user._id);

        return res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error("❌ Email verification error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error during email verification.",
        });
    }
};

// ====================================================================================
// 🔁 Forgot Password Controller
// ====================================================================================
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // 1. Check if user exists with provided email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No User Found With This Email",
            });
        }

        // 2. Generate reset token and set expiry time (1 hour)
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour from now

        // 3. Save token and expiry on the user record
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();
        console.log(resetToken)
        // 4. Send password reset email with token link
        await sendPasswordResetEmail(
            user.email,
            `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        );

        return res.status(200).json({
            success: true,
            message: "Reset password email sent successfully.",
        });
    } catch (error) {
        console.error("❌ Forgot password error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error during forgot password.",
        });
    }
};

// ====================================================================================
// 🔁 Reset Password Controller
// ====================================================================================
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({
            success: false,
            message: "Password is required",
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long",
        });
    }

    try {
        // 1. Find user with matching reset token and check if it's not expired
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token.",
            });
        }

        // 2. Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 3. Update the user's password and clear reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        // 4. Send confirmation email
        await sendPasswordResetSuccessEmail(user.email);
        console.log("📧 Password reset email sent");

        return res.status(200).json({
            success: true,
            message: "Password reset successfully.",
        });

    } catch (error) {
        console.error("❌ Reset password error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error during password reset.",
        });
    }
};

// ====================================================================================
// 🔁 Check Auth Controller
// ====================================================================================
export const checkAuth = async (req, res) => {
    try {
        // Find the user by ID attached from the token (set in verifyToken middleware)
        const user = await User.findById(req.userId);

        // If user not found, consider it unauthorized
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please login to continue.",
            });
        }

        // Send back user data excluding the password
        res.status(200).json({
            success: true,
            message: "User is authenticated",
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        console.error("❌ Check auth error:", error.message);

        // Internal server error
        res.status(500).json({
            success: false,
            message: "Server error during check auth.",
        });
    }
};
