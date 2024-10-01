import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true }, // Custom numeric ID
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createDate: { type: Date, default: Date.now }
});

// Travel Destination Schema
const travelDestinationSchema = new mongoose.Schema({
    destinationId: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true},
    title: { type: String, required: true },
    description: { type: String },
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' }, //  reference to Location
    picture: { type: String }, // Assuming the picture is a URL
    dateFrom: { type: Date },
    dateTo: { type: Date },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //  userId reference to User
    createDate: { type: Date, default: Date.now }
});

// Location Schema
const locationSchema = new mongoose.Schema({
    locationId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    location: { type: String, required: true },
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' } // reference to Country
});

// Country Schema
const countrySchema = new mongoose.Schema({
    countryId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true }, 
    country: { type: String, required: true }
});


// Create Models
const User = mongoose.model('User', userSchema);
const TravelDestination = mongoose.model('TravelDestination', travelDestinationSchema);
const Location = mongoose.model('Location', locationSchema);
const Country = mongoose.model('Country', countrySchema);

// Export Models
export { User, TravelDestination, Location, Country };