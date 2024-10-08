import express from "express";
import { ObjectId } from "mongodb";
import { TravelDestination, User } from "../../model.js"; // Import your model

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

router.get("/byUserEmail/:email", async (req, res) => {
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
      return res.status(404).json({ message: "No travel destinations found for this user" });
    }

    // Format the response with the required fields
    const formattedDestinations = travelDestinations.map(dest => ({
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
router.post("/", async (req, res) => {
  try {
    const { title, description, locationId, picture, userId } = req.body;

    // TODO: Accept date input from the user
    const dateFrom = new Date(2024, 0, 1);
    const dateTo = new Date(2024, 11, 31);
    const createDate = new Date();

    const travelDestination = {
      destinationId: new ObjectId(),
      title,
      description,
      locationId: new ObjectId(locationId),
      picture,
      dateFrom,
      dateTo,
      userId: new ObjectId(userId),
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
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    const result = await TravelDestination.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Travel destination not found" });
    }

    res.status(200).json({ message: "Travel destination updated successfully" });
  } catch (error) {
    console.error(`Error updating data: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a travel destination by id
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await TravelDestination.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Travel destination not found" });
    }

    res.status(200).json({ message: "Travel destination deleted successfully" });
  } catch (error) {
    console.error(`Error deleting data: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
