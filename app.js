import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./configs/connectdb.js";
import errorHandler from "./errorhandlers/errorHandler.js";
import routelist from "./routes/routelist.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Default to 3000 if PORT is not set
const DATABASE_URL = process.env.DATABASE_URL;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB(DATABASE_URL);

routelist.forEach(({ path, route }) => app.use(path, route));

// Error handler (should be the last middleware)
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
