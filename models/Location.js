import mongoose from "mongoose"

const locationSchema = new mongoose.Schema({

  name: String,
  country: String,
  type: String,
  airport: String,
  popular: Boolean

})

export default mongoose.model("Location", locationSchema)