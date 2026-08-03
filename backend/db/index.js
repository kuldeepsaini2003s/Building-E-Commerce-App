import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DB_NAME}`
    );
    console.log(`Connected to MongoDB ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("Error while connecting MongoDB", error);
  }
};

export default connectDB;
