import mongoose from 'mongoose';
import { User, TravelDestination, Location, Country } from './model.js';
import bcrypt from "bcrypt";

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

        // Create default countries if they don't exist
        let countries = [
            { country: "U.S.A." },
            { country: "Canada" },
            { country: "France" },
            { country: "Germany" },
            { country: "Italy" },
            { country: "Spain" },
            { country: "United Kingdom" },
            { country: "Australia" },
            { country: "Japan" },
            { country: "China" },
            { country: "Brazil" },
            { country: "India" },
            { country: "Mexico" },
            { country: "South Africa" },
            { country: "Russia" },
            { country: "Netherlands" },
            { country: "Sweden" },
            { country: "Norway" },
            { country: "Finland" },
            { country: "Denmark" }
        ];

        for (const countryData of countries) {
            let country = await Country.findOne({ country: countryData.country });
            if (!country) {
                country = await Country.create(countryData);
                console.log(`Added default country to Countries collection: ${countryData.country}\n`);
            }
        }

        // Create default locations if they don't exist
        let locations = [
            { location: "New York", countryId: await Country.findOne({ country: "U.S.A." }).then(c => c._id) },
            { location: "Toronto", countryId: await Country.findOne({ country: "Canada" }).then(c => c._id) },
            { location: "Paris", countryId: await Country.findOne({ country: "France" }).then(c => c._id) },
            { location: "Berlin", countryId: await Country.findOne({ country: "Germany" }).then(c => c._id) },
            { location: "Rome", countryId: await Country.findOne({ country: "Italy" }).then(c => c._id) },
            { location: "Madrid", countryId: await Country.findOne({ country: "Spain" }).then(c => c._id) },
            { location: "London", countryId: await Country.findOne({ country: "United Kingdom" }).then(c => c._id) },
            { location: "Sydney", countryId: await Country.findOne({ country: "Australia" }).then(c => c._id) },
            { location: "Tokyo", countryId: await Country.findOne({ country: "Japan" }).then(c => c._id) },
            { location: "Beijing", countryId: await Country.findOne({ country: "China" }).then(c => c._id) },
            { location: "Rio de Janeiro", countryId: await Country.findOne({ country: "Brazil" }).then(c => c._id) },
            { location: "Mumbai", countryId: await Country.findOne({ country: "India" }).then(c => c._id) },
            { location: "Cancun", countryId: await Country.findOne({ country: "Mexico" }).then(c => c._id) },
            { location: "Cape Town", countryId: await Country.findOne({ country: "South Africa" }).then(c => c._id) },
            { location: "Moscow", countryId: await Country.findOne({ country: "Russia" }).then(c => c._id) },
            { location: "Amsterdam", countryId: await Country.findOne({ country: "Netherlands" }).then(c => c._id) },
            { location: "Stockholm", countryId: await Country.findOne({ country: "Sweden" }).then(c => c._id) },
            { location: "Oslo", countryId: await Country.findOne({ country: "Norway" }).then(c => c._id) },
            { location: "Helsinki", countryId: await Country.findOne({ country: "Finland" }).then(c => c._id) },
            { location: "Copenhagen", countryId: await Country.findOne({ country: "Denmark" }).then(c => c._id) }
        ];

        for (const locationData of locations) {
            let location = await Location.findOne({ location: locationData.location });
            if (!location) {
                location = await Location.create(locationData);
                console.log(`Added default location to Locations collection: ${locationData.location}\n`);
            }
        }

        // Create default users if they don't exist
        let users = [
            {
                username: "Johnny1234",
                firstname: "John",
                lastname: "Does",
                email: "john@example.com",
                password: "password123"
            },
            {
                username: "JaneDoe5678",
                firstname: "Jane",
                lastname: "Doe",
                email: "jane@example.com",
                password: "password456"
            },
            {
                username: "MikeSmith91011",
                firstname: "Mike",
                lastname: "Smith",
                email: "mike@example.com",
                password: "password789"
            },
            {
                username: "AnnaTaylor1213",
                firstname: "Anna",
                lastname: "Taylor",
                email: "anna@example.com",
                password: "passwordabc"
            },
            {
                username: "ChrisEvans1415",
                firstname: "Chris",
                lastname: "Evans",
                email: "chris@example.com",
                password: "passworddef"
            },
            {
                username: "EmmaJohnson1617",
                firstname: "Emma",
                lastname: "Johnson",
                email: "emma@example.com",
                password: "passwordghi"
            },
            {
                username: "LucasBrown1819",
                firstname: "Lucas",
                lastname: "Brown",
                email: "lucas@example.com",
                password: "passwordjkl"
            },
            {
                username: "OliviaDavis2021",
                firstname: "Olivia",
                lastname: "Davis",
                email: "olivia@example.com",
                password: "passwordmno"
            }
        ];

        for (const userData of users) {
            let user = await User.findOne({ email: userData.email });
            if (!user) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                user = await User.create({
                    ...userData,
                    password: hashedPassword,
                    createDate: new Date()
                });
                console.log(`Added default user to Users collection: ${userData.firstname} ${userData.lastname}\n`);
            }
        }

        // Create default travel destinations if they don't exist
        if (!collectionNames.includes('traveldestinations') || (await TravelDestination.countDocuments()) === 0) {
            await TravelDestination.init();
            console.log('Created Travel Destinations collection');

            const users = await User.find(); // Retrieve all users

            // Predefined travel destination data
            const travelDestinations = [
                { title: "Trip to Paris", description: "A lovely visit to the city of lights." },
                { title: "Explore Tokyo", description: "An adventure in the bustling capital of Japan." },
                { title: "Beach Vacation in Cancun", description: "Relaxing by the beautiful beaches." },
                { title: "Cultural Tour in Rome", description: "Discover the history of ancient Rome." },
                { title: "Adventure in New York", description: "Experience the vibrant life of NYC." },
                { title: "Nature Retreat in Sydney", description: "Enjoy the beautiful landscapes of Australia." },
                { title: "Safari in South Africa", description: "A thrilling wildlife experience." },
                { title: "Skiing in the Swiss Alps", description: "Hit the slopes in stunning Switzerland." },
                { title: "Visit to the Grand Canyon", description: "Breathtaking views of this natural wonder." },
                { title: "Cruise in the Caribbean", description: "Sailing the beautiful blue waters." }
            ];

            // Loop through each user to create two unique travel destinations
            for (const user of users) {
                for (let i = 0; i < 2; i++) { // Create two destinations per user
                    const randomDestination = travelDestinations[Math.floor(Math.random() * travelDestinations.length)];
                    await TravelDestination.create({
                        title: `${randomDestination.title} by ${user.firstname}`,
                        description: randomDestination.description,
                        locationId: await Location.findOne({}).then(l => l._id), // Get a random location's ID
                        dateFrom: new Date(),
                        dateTo: new Date(new Date().setDate(new Date().getDate() + 7)),
                        userId: user._id, // Reference the user's _id
                        createDate: new Date()
                    });
                    console.log(`Added travel destination for user: ${user.firstname} ${user.lastname}\n`);
                }
            }
            console.log('Added default travel destinations to Travel Destinations collection\n');
        }

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
