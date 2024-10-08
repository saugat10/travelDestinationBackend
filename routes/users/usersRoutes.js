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
    // log the error object and return what you need from it to the frontend
    console.error(error.errors);
    // Return Mongoose validation error to the frontend
    if (error.errors) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error(`Error creating data: ${error}`);
      res.status(500).json({ message: "Server error" });
    }
  }
});
export default router;
