import mongoose from "mongoose"

const FlightSchema = new mongoose.Schema({

airline: String,
origin: String,
destination: String,
departureTime: String,
arrivalTime: String,
duration: String,
price: Number

})

export default mongoose.model("Flight", FlightSchema)