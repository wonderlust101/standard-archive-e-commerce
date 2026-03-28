import mongoose from "mongoose";

export const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error("MONGO_URI is not defined in your environment variables. Please check your .env file.");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
    } catch (err) {
        console.error("Initial MongoDB connection failed:", err);
        process.exit(1);
    }
};

// Mongoose connections
mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
mongoose.connection.on('disconnected', () => console.log('Disconnected from MongoDB'));