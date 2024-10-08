import express from "express";
import dotenv from "dotenv";
import { Location } from "../../model.js"; 

dotenv.config();
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const locations = await Location.find().populate('countryId'); // Populating countryId with corresponding Country data
        res.status(200).json(locations);
    } catch (error) {
        console.error('Error retrieving locations:', error);
        res.status(500).json({ message: 'Server error while fetching locations' });
    }
});

export default router;