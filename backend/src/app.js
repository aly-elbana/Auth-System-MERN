// -------------------- Import Section --------------------

// Import the Express framework to create the backend server
import express from "express";

// Import authentication-related routes (login, signup, etc.)
import authRoutes from "./routes/auth.route.js";

// Import Morgan: a logging middleware to show request info in console
import morgan from "morgan";

// Import Cookie Parser to parse cookies from HTTP requests (used for sessions/auth)
import cookieParser from "cookie-parser";

// Import CORS middleware to allow cross-origin requests (from frontend to backend)
import cors from "cors";

// -------------------- Initialize Express App --------------------

const app = express(); // Create an Express app instance

// -------------------- Middleware Configuration --------------------

// Parse incoming JSON requests (req.body will be populated with JSON content)
app.use(express.json());

// Use Morgan to log HTTP requests in the "dev" format (method, URL, status, response time)
app.use(morgan("dev"));

// Parse cookies attached to the request (makes req.cookies available)
app.use(cookieParser());

// Enable CORS (Cross-Origin Resource Sharing) so frontend on port 5173 can call the backend
app.use(cors({
    origin: "http://localhost:5173",  // Frontend URL (e.g., Vite dev server)
    credentials: true,               // Allow sending credentials (cookies, headers, etc.)
}));

// -------------------- Route Registration --------------------

// Prefix all routes in authRoutes with "/api/v1/auth"
// Example: POST /api/v1/auth/signup or /login
app.use("/api/v1/auth", authRoutes);

// -------------------- Export the App --------------------

// Export the Express app to be used in the main server entry point (like index.js or server.js)
export default app;
