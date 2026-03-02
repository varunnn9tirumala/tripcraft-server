import fs from "fs"
import csv from "csv-parser"
import { connectDB } from "./database.js"
import Location from "./models/Location.js"

await connectDB()

const results = []

fs.createReadStream("worldcities.csv")
.pipe(csv())
.on("data", (data) => {

  results.push({
    name: data.name,
    country: data.country,
    type: "city"
  })

})
.on("end", async () => {

  await Location.insertMany(results)

  console.log("🌍 Cities imported:", results.length)

  process.exit()

})