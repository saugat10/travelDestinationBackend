// 'use strict' enforces stricter parsing and error handling, helping.
"use strict";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb"; // Import MongoClient, ServerApiVersion, and ObjectId

import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js"; // Import the db connection
import { User, TravelDestination, Location, Country } from "./model.js"; // Import your models

// Import the express module to create a web server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load environment variables from a .env file into process.env
dotenv.config();

// Connect to MongoDB
connectDB();

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Read all travel destinations
app.get("/api/traveldestinations", async (req, res) => {
  try {
    const traveldestinations = await TravelDestination.find();
    res.status(200).json(traveldestinations);
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
});
// Read a travel destination by id

app.get("/api/traveldestinations/:id", async (req, res) => {
  try {
    const travelDestination = await TravelDestination.findOne({ destinationId: req.params.id });
    res.status(200).json(travelDestination);
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
  }
});

// create a travel destination
app.post("/api/traveldestinations", async (req, res) => {
    try {
      const { title, description, locationId, picture, userId } = req.body; // Destructure the request body
      const dateFrom = new Date(2024, 0, 1);
      const dateTo = new Date(2024, 11, 31);
      const createDate = new Date();
  
      // Ensure locationId and userId are cast to ObjectId
      const travelDestination = {
        destinationId : new ObjectId(),
        title: title,
        description: description,
        locationId: new ObjectId(locationId), // Cast to ObjectId
        picture: picture,
        dateFrom: dateFrom,
        dateTo: dateTo,
        userId: new ObjectId(userId), 
        createDate: createDate,
      };
  
      await client.connect(); 
      const myDB = client.db("nosql_project"); 
      const myColl = myDB.collection("traveldestinations"); 
      await myColl.insertOne(travelDestination);
  
      res.status(201).json(travelDestination);
    } catch (error) {
      console.error(`Error inserting data: ${error.message}`);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/traveldestinations/:id", async (req, res) => {
    try {
      const id = req.params.id;
  
      // Validate ID (simple check)
      if (!id) {
        return res.status(400).json({ message: "Travel destination ID is required" });
      }
  
      // Update the travel destination with provided fields
      const updateData = req.body;
  
      await client.connect();
      const myDB = client.db("nosql_project");
      const myColl = myDB.collection("traveldestinations");
  
      const result = await myColl.updateOne(
        { destinationId: new ObjectId(id) },
        // The $set operator allows you to update specific fields in a document
        { $set: updateData }
      );
  
      // Check if the document was found and updated
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Travel destination not found" });
      }
  
      res.status(200).json({ message: "Travel destination updated successfully" });
    } catch (error) {
      console.error(`Error updating data: ${error.message}`);
      res.status(500).json({ message: "Server error" });
    }
  });  

  app.delete("/api/traveldestinations/:id", async (req, res) => {
    try {
      const id = req.params.id;
  
      // Check if the provided id is a valid ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid travel destination ID" });
      }
  
      await client.connect();
      const myDB = client.db("nosql_project");
      const myColl = myDB.collection("traveldestinations");
  
      // Delete the travel destination with the given ObjectId
      const result = await myColl.deleteOne({ destinationId: new ObjectId(id) });
  
      // Check if any document was deleted
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Travel destination not found" });
      }
  
      res.status(200).json({ message: "Travel destination deleted successfully" });
    } catch (error) {
      console.error(`Error deleting data: ${error.message}`);
      res.status(500).json({ message: "Server error" });
    }
  });

// Define the port on which the server will listen, using an environment variable
const PORT = process.env.PORT;
// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});