import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('MongoDB URI not found. Set MONGO_URI or MONGODB_URI in the server .env file.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn('MongoDB connection failed. Starting app without DB for now.');
    console.warn(error.message);
  }
};

export default connectDB;
