import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import travelDestinationRoutes from "./routes/travel_destinations/travelDestinationRoutes.js";
import userRoutes from "./routes/users/usersRoutes.js";
import session from 'express-session';
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET, // Set a secret key for encrypting the session data
  resave: false, // Don't save session if nothing has changed
  saveUninitialized: false, // Don't create session until something is stored
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour (adjust as needed)
    httpOnly: true, // Mitigates some XSS attacks
  }
}));


connectDB();

// Use the travel destinations router
app.use("/api/traveldestinations", travelDestinationRoutes);

// Use the user router
app.use("/api/users", userRoutes);

// Define the port and start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
