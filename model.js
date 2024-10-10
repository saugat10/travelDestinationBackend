import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: "User must be filled" },
  firstname: { type: String, required: "First name must be filled" },
  lastname: { type: String, required: "Last name must be filled" },
  email: {
    type: String,
    unique: true,
    match: /.+@.+\..+/,
    required: "Email must be valid and filled",
  },
  password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters long"],
    required: "Password must be filled",
  },
  createDate: { type: Date, default: Date.now },
});

// Travel Destination Schema
const travelDestinationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "Location" }, //  reference to Location
  picture: { type: String }, // Assuming the picture is a URL
  dateFrom: { type: Date },
  dateTo: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //  userId reference to User
  createDate: { type: Date, default: Date.now },
});

// Location Schema
const locationSchema = new mongoose.Schema({
  location: { type: String, required: true },
  countryId: { type: mongoose.Schema.Types.ObjectId, ref: "Country" }, // reference to Country
});

// Country Schema
const countrySchema = new mongoose.Schema({
  country: { type: String, required: true },
});

// Create Models
const User = mongoose.model("User", userSchema);
const TravelDestination = mongoose.model("TravelDestination", travelDestinationSchema);
const Location = mongoose.model("Location", locationSchema);
const Country = mongoose.model("Country", countrySchema);

// Export Models
export { User, TravelDestination, Location, Country };
