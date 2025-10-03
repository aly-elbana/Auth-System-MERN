import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDb } from "./src/utils/connectDb.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 1502;

// Connect to database, then start server
await connectDb();

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
