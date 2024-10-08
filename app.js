import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import travelDestinationRoutes from "./routes/travel_destinations/travelDestinationRoutes.js";
import locationRoutes from "./routes/location/locationRoutes.js";
import countryRoutes from "./routes/country/countryRoutes.js";
import userRoutes from "./routes/users/usersRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

connectDB();

// Use the travel destinations router
app.use("/api/traveldestinations", travelDestinationRoutes);

// Use the user router
app.use("/api/users", userRoutes);

// Use the location router
app.use("/api/locations", locationRoutes);

// Use the country router
app.use("/api/countries", countryRoutes);

// Define the port and start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
