import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`DB connected to : ${conn.connection.host}`);
    }
    catch(err){
        console.error(`Error : ${err}`);
        process.exit(1);
    }
}