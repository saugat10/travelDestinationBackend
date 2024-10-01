import mongoose from 'mongoose';
import { User, TravelDestination, Location, Country } from './model.js';

const dbName = "travel_destination";

// Connect to the database
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}${dbName}`);
        console.log(`MongoDB connected: ${conn.connection.host}\n`);

        // Retrieves collections and converts them to array
        const collections = await conn.connection.db.listCollections().toArray();
        const collectionNames = collections.map(collection => collection.name);
        console.log('Existing collections:', collectionNames);

        //if array length is 0, creates the collections
        let country;
        if (!collectionNames.includes('countries') || (await Country.countDocuments()) === 0) {
            await Country.init();
            console.log('Created Countries collection');
            
            country = await Country.create({
                country: "U.S.A."
            });
            console.log('\nAdded default country to Countries collection\n');
        } else {
            country = await Country.findOne({ country: "U.S.A." });
        }

        let location;
        if (!collectionNames.includes('locations') || (await Location.countDocuments()) === 0) {
            await Location.init();
            console.log('Created Locations collection');
            
            location = await Location.create({
                location: "New York",
                countryId: country._id 
            });
            console.log('Added default location to Locations collection\n');
        } else {
            location = await Location.findOne({ location: "New York" });
        }

        let user;
        if (!collectionNames.includes('users') || (await User.countDocuments()) === 0) {
            await User.init();
            console.log('Created Users collection');
            
            user = await User.create({
                username: "John Doe",
                email: "john@example.com",
                password: "password123",
                createDate: new Date()
            });
            console.log('Added default user to Users collection\n');
        } else {
            user = await User.findOne({ email: "john@example.com" });
        }

        if (!collectionNames.includes('traveldestinations') || (await TravelDestination.countDocuments()) === 0) {
            await TravelDestination.init();
            console.log('Created Travel Destinations collection');
            
            await TravelDestination.create({
                title: "New York 2022",
                description: "A beautiful trip.",
                locationId: location._id,
                picture: "http://example.com/image.jpg",
                dateFrom: new Date(),
                dateTo: new Date(new Date().setDate(new Date().getDate() + 7)),
                userId: user._id, // Reference the default _id from the created user
                createDate: new Date()
            });
            console.log('Added default travel destination to Travel Destinations collection\n');
        }

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
