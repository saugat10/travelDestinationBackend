import express from "express";
import { ObjectId } from "mongodb";
import { User } from "../../model.js"; // Import your User model

const router = express.Router();

//TODO
// - implement crud

// New user
router.post("/", async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;
    const createDate = new Date();

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      const errors = {};

      // Check if the existing user matches by username or email
      if (existingUser.username === username) {
        errors.username = { message: "A user with this user name already exists" };
      }
      if (existingUser.email === email) {
        errors.email = { message: "A user with this email already exists" };
      }

      return res.status(400).json({ error: errors });
    }

    const user = {
      userId: new ObjectId(),
      firstname,
      lastname,
      username,
      email,
      password,
      createDate,
    };

    await User.create(user);
    res.status(201).json(user);
    console.log(user);
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.errors) {
      return res.status(400).json({ error: error.errors });
    }

    console.error(`Error creating data: ${error}`);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
