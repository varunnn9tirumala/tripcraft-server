import mongoose from "mongoose"

export const connectDB = async () => {

  try {

    await mongoose.connect(
      
"mongodb+srv://varunnn9tirumala:varunnn9@cluster0.knecdeg.mongodb.net/tripcraft"
    )

    console.log("✅ MongoDB connected")

  } catch (error) {

    console.log("MongoDB error:", error)

  }

}