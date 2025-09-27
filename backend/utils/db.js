import mongoose from "mongoose"

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("mongodb connected successfully");
    } catch(error){
        console.log("error while connecting mongodb:", error.message);
    }
}
export default connectDB;
    