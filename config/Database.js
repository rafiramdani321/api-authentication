import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const connectDb = () => {
  mongoose.set('strictQuery', false)
  return mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
}

export default connectDb