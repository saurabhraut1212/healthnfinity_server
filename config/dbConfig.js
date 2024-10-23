import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected to database')
    } catch (error) {
        console.log("Failed to connect database")
    }
}
export default dbConnect;