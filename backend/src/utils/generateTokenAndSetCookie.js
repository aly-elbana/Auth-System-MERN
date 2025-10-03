import jwt from "jsonwebtoken";

// Generate and set JWT token as cookie
export const generateTokenAndSetCookie = (res, userId) => {
    // 1. Generate JWT token containing user ID as payload
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d", // Token expires in 7 days
        }
    );

    // 2. Set the token as a secure HTTP-only cookie
    res.cookie("token", token, {
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        secure: process.env.NODE_ENV === "production", // Ensures cookies are sent only over HTTPS in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration: 7 days
        sameSite: "strict", // Prevents CSRF by restricting cross-site cookie sending
    });

    return token;
};
