import mongoose from "mongoose"
const dbConnect = async () => {
 await mongoose.connect(process.env.MONGO_URL)
 console.log("MongoDB Connected")
}
export default dbConnect