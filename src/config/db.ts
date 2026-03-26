import mongoose from "mongoose";

if (process.env.MONGO_URI)
    throw new Error("MONGO_URI is not defined");

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
    } catch (err) {
        process.exit(1);
    }
}