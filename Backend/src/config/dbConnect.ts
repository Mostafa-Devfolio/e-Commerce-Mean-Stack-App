import mongoose from "mongoose"


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI as string);
        console.log("Database Connected")
    } catch (err) {
        console.log(`Error: ${err.message}`);
        process.exit(1);
    }
}

export default connectDB;