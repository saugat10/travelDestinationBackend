import express from "express";
import { ObjectId } from "mongodb";
import { TravelDestination, User, Location, Country} from "../../model.js";
import authenticateJWT from "../middleware.js";

const router = express.Router();

// Read all travel destinations
router.get("/", async (req, res) => {
  try {
    const traveldestinations = await TravelDestination.find();
    res.status(200).json(traveldestinations);
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
});

// Read a travel destination by id
router.get("/:id", async (req, res) => {
  try {
    const travelDestination = await TravelDestination.findOne({ _id: req.params.id });
    res.status(200).json(travelDestination);
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
});

router.get("/byUserEmail/:email", authenticateJWT, async (req, res) => {
  try {
    const email = req.params.email;
    
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find travel destinations by userId and populate location and country data
    const travelDestinations = await TravelDestination
      .find({ userId: user._id })
      .populate({
        path: 'locationId',
        select: 'location countryId', // select location and countryId
        populate: { path: 'countryId', select: 'country' } // populate countryId
      })
      .select('title description dateFrom dateTo locationId'); // select only necessary fields

    if (!travelDestinations || travelDestinations.length === 0) {
      return res.status(200).json({ message: "No travel destinations found for this user" });
    }

    // Format the response with the required fields
    const formattedDestinations = travelDestinations.map(dest => ({
      _id:dest._id,
      title: dest.title,
      description: dest.description,
      location: dest.locationId.location,
      country: dest.locationId.countryId.country,
      dateFrom: dest.dateFrom,
      dateTo: dest.dateTo,
    }));

    res.status(200).json(formattedDestinations);
  } catch (error) {
    console.error(`Error fetching travel destinations by email: ${error.message}`);
    res.status(500).json({ message: "Error fetching travel destinations", error: error.message });
  }
});

// Create a travel destination
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const { title, description, dateFrom, dateTo, location, picture, user } = req.body;

    const createDate = new Date();

    const userFound = await User.findOne({ email: user.email });

    // Check if the user exists
    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }

    //TODO: double check that the locationId and userId really exists
    const travelDestination = {
      destinationId: new ObjectId(),
      title,
      description,
      locationId: new ObjectId(location),
      picture,
      dateFrom,
      dateTo,
      userId: new ObjectId(userFound._id),
      createDate,
    };

    await TravelDestination.create(travelDestination);
    res.status(201).json(travelDestination);

  } catch (error) {
    console.error(`Error creating data: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a travel destination by id
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;

    // Retrieving the existing travel destination
    const existingDestination = await TravelDestination.findById(id);
    
    // Check if the destination exists
    if (!existingDestination) {
      return res.status(404).json({ message: "Travel destination not found" });
    }

    // Retrieving user id from the existing destination
    const { userId: existingUserId } = existingDestination;

    // Fetch the related Location document
    const location = await Location.findById(req.body.locationId);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Create the updatedItem object and manually map attributes
    const updatedItem = {
      title: req.body.title,
      description: req.body.description ,
      locationId:  location._id, 
      countryId: location.countryId,
      dateFrom: req.body.dateFrom ,
      dateTo: req.body.dateTo,
      userId: existingUserId, // Keep the existing userId
      createDate: existingDestination.createDate 
    };

    // Update the travel destination
    const result = await TravelDestination.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedItem }
    );

    const country = await Country.findById(updatedItem.countryId);

    // Return the updated destination and its location
    res.status(200).json({ 
      message: "Travel destination updated successfully", 
      updatedDestination: updatedItem,
      location,
      country
    });
  } catch (error) {
    console.error(`Error updating data: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a travel destination by id
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const id = req.params.id;

    // Check if the travel destination exists
    const travelDestination = await TravelDestination.findById(id);
    if (!travelDestination) {
      return res.status(404).json({ message: "Travel destination not found" });
    }

    // Delete the travel destination
    await TravelDestination.deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ message: "Travel destination deleted successfully" });
  } catch (error) {
    console.error(`Error deleting travel destination: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
