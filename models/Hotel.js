import mongoose from "mongoose"

const HotelSchema = new mongoose.Schema({

Hotel_Name: String,
Hotel_Rating: Number,
Hotel_Price: Number,
City: String

})

export default mongoose.model("Hotel", HotelSchema)