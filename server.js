import express from "express"
import cors from "cors"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { connectDB } from "./database.js"
import Location from "./models/Location.js"
import Hotel from "./models/Hotel.js"
import Flight from "./models/Flight.js"
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Connect MongoDB
connectDB()

// Gemini setup
const genAI = new GoogleGenerativeAI("AIzaSyBo73GBSZnZUiE2Ck_Lcw8FE0-hkPY6lFA")

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
})

let lastRequestTime = 0

// -----------------------------
// GET FLIGHTS
// -----------------------------
app.get("/api/flights", async (req,res)=>{

try{

const {origin,destination} = req.query

if(!origin || !destination){
return res.json([])
}

const flights = await Flight.find({
origin: { $regex: origin, $options: "i" },
destination: { $regex: destination, $options: "i" }
}).limit(6)

res.json(flights)

}catch(error){

console.log("Flight fetch error:",error)

res.status(500).json({
error:"Failed to fetch flights"
})

}

})
// -----------------------------
// GET HOTELS (ALL OR SEARCH)
// -----------------------------
app.get("/api/hotels", async (req, res) => {
  try {

    const city = req.query.city

    let query = {}

    if (city) {
      query.City = { $regex: city, $options: "i" }
    }

    const hotels = await Hotel.find(query)

    const formattedHotels = hotels.map(h => ({
      name: h.Hotel_Name,
      rating: h.Hotel_Rating,
      price: h.Hotel_Price,
      city: h.City
    }))

    res.json(formattedHotels)

  } catch (error) {
    console.log("Hotel fetch error:", error)

    res.status(500).json({
      error: "Failed to fetch hotels"
    })
  }
})
// -----------------------------
// TEST ROUTE
// -----------------------------
app.get("/", (req, res) => {
  res.send("🚀 SARA SERVER IS RUNNING")
})


// -----------------------------
// GET ALL LOCATIONS
// -----------------------------
// -----------------------------
// GET ALL LOCATIONS
// -----------------------------
app.get("/api/locations", async (req, res) => {

  try {

    const locations = await Location.find()

    res.json(locations)

  } catch (error) {

    console.log("Location fetch error:", error)

    res.status(500).json({
      error: "Failed to fetch locations"
    })

  }

})


// -----------------------------
// SEARCH LOCATIONS
// -----------------------------
app.get("/api/locations/search", async (req, res) => {

  try {

    const q = req.query.q
    console.log("Search query:", q)

    if (!q) {
      return res.json([])
    }

    const locations = await Location.find({
      name: { $regex: q, $options: "i" }
    }).limit(10)
     console.log("Results:", locations)

    res.json(locations)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: "Search failed"
    })

  }

})


// -----------------------------
// SARA AI ROUTE
// -----------------------------
app.post("/api/sara", async (req, res) => {

  const message = req.body.message

  if (!message) {
    return res.json({
      reply: "Please send a message."
    })
  }

  const now = Date.now()

  if (now - lastRequestTime < 3000) {
    return res.json({
      reply: "⏳ Please wait a few seconds before sending another message."
    })
  }

  lastRequestTime = now

  try {

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }]
        }
      ]
    })

    const response = await result.response
    const text = response.text()

    res.json({
      reply: text
    })

  } catch (error) {

    console.log("Gemini error:", error.message)

    if (error.status === 429 || error.message.includes("429")) {

      return res.json({
        reply:
`⚠️ SARA is receiving many requests right now.

Please wait about 1 minute and try again.`
      })

    }

    res.json({
      reply:
`⚠️ SARA AI is temporarily unavailable.

Please try again in a moment.`
    })

  }

})


// -----------------------------
// START SERVER
// -----------------------------
app.listen(5050, () => {

  console.log("🚀 SARA SERVER RUNNING http://localhost:5050")

})