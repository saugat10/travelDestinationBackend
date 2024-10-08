import express from "express";
import dotenv from "dotenv";
import { Country } from "../../model.js"; 

dotenv.config();
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const countries = await Country.find();
        res.status(200).json(countries);
    } catch (error) {
        console.error('Error retrieving countries:', error);
        res.status(500).json({ message: 'Server error while fetching countries' });
    }
});

export default router;