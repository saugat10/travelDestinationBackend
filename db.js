import mongoose from 'mongoose';
import { User, TravelDestination, Location, Country } from './model.js';

// Connect to the database
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);

        const collections = await conn.connection.db.listCollections().toArray();
        const collectionNames = collections.map(collection => collection.name);
        console.log('Existing collections:', collectionNames);

        let countryId;
        if (!collectionNames.includes('countries') || (await Country.countDocuments()) === 0) {
            await Country.init();
            console.log('Created Countries collection');
            await Country.createIndexes({ countryId: 1 });
            
            // Generate ObjectId for countryId
            countryId = new mongoose.Types.ObjectId();
            await Country.create({
                countryId: countryId, // Use generated ObjectId
                country: "U.S.A."
            });
            console.log('Added default country to Countries collection');
        }

        let locationId;
        if (!collectionNames.includes('locations') || (await Location.countDocuments()) === 0) {
            await Location.init();
            console.log('Created Locations collection');
            await Location.createIndexes({ locationId: 1 });
            
            // Generate ObjectId for locationId
            locationId = new mongoose.Types.ObjectId();
            await Location.create({
                locationId: locationId, // Use generated ObjectId
                location: "New York",
                countryId: countryId // Reference the created countryId (ObjectId)
            });
            console.log('Added default location to Locations collection');
        }

        let userId;
        if (!collectionNames.includes('users') || (await User.countDocuments()) === 0) {
            await User.init();
            console.log('Created Users collection');
            await User.createIndexes({ userId: 1, email: 1 });

            // Generate ObjectId for userId
            userId = new mongoose.Types.ObjectId();
            await User.create({
                userId: userId, // Use generated ObjectId
                userName: "John Doe",
                email: "john@example.com",
                password: "password123",
                createDate: new Date()
            });
            console.log('Added default user to Users collection');
        }

        if (!collectionNames.includes('traveldestinations') || (await TravelDestination.countDocuments()) === 0) {
            await TravelDestination.init();
            console.log('Created Travel Destinations collection');
            await TravelDestination.createIndexes({ destinationId: 1 });

            // Generate ObjectId for destinationId
            let destinationId = new mongoose.Types.ObjectId();
            await TravelDestination.create({
                destinationId: destinationId, // Use generated ObjectId
                title: "New York 2022",
                description: "A beautiful trip.",
                locationId: locationId, // Reference the created locationId (ObjectId)
                picture: "http://example.com/image.jpg",
                dateFrom: new Date(),
                dateTo: new Date(new Date().setDate(new Date().getDate() + 7)),
                userId: userId, // Reference the created userId (ObjectId)
                createDate: new Date()
            });
            console.log('Added default travel destination to Travel Destinations collection');
        }

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;