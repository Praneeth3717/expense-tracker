import mongoose from 'mongoose'

const MONGO_URI=process.env.MONGO_URI||""

if (!MONGO_URI) {
  throw new Error("MongoDB connection string is missing!");
}

const connectDB=async():Promise<void>=>{
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log("Error connecting to MongoDB:",error)
        process.exit(1)
    }
}

export default connectDB