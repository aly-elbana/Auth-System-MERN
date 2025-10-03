import jwt from "jsonwebtoken";

// Middleware to verify JWT from cookies
export const verifyToken = (req, res, next) => {
    // Extract token from cookies
    const token = req.cookies?.token;

    // If token is missing, user is not authenticated
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized. Please login to continue.",
        });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store user ID in the request object for later use
        req.userId = decoded.userId;

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        console.error("❌ Token verification error:", error.message);

        // If token is invalid or expired
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please login again.",
        });
    }
};
