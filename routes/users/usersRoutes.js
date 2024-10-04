import express from "express";
import { ObjectId } from "mongodb";
import { User } from "../../model.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Read a user by id
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findOne({ _id: new ObjectId(req.params.id) });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({message: `Correctly retrieved user ${user.username}`});
    } catch (error) {
        console.error(`Error fetching user: ${error.message}`);
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
});

// TODO:
// - logout endpoint
// - middleware for authentication and authorisation when trying to access private area.

// Login 
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate the email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: `User with email ${email} not found, please try again` });
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Save user info in the session
        req.session.userId = user._id;
        req.session.username = user.username;

        // Respond with token and user data
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error(`Error during login: ${error.message}`);
        res.status(500).json({ message: "Server error" });
    }
});

// Create a new user
router.post("/", async (req, res) => {
    try {
        const { username, firstname, lastname, email, password } = req.body;
        const createDate = new Date();

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            username,
            email,
            firstname,
            lastname,
            password: hashedPassword,
            createDate,
        };

        await User.create(user);
        res.status(201).json(user);
    } catch (error) {
        console.error(`Error creating user: ${error.message}`);
        res.status(500).json({ message: "Server error" });
    }
});

// Update a user by id
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;

        const result = await User.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error(`Error updating user: ${error.message}`);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete a user by id
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await User.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(`Error deleting user: ${error.message}`);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
