export default async function handler(req, res) {

if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" })
}

try {

const { message, trip } = req.body

const response = await fetch("https://api.openai.com/v1/chat/completions", {

method: "POST",

headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
},

body: JSON.stringify({

model: "gpt-4o-mini",

temperature: 0.7,

max_tokens: 200,

messages: [

{
role: "system",
content: `
You are **SARA**, the intelligent AI travel assistant of TripCraft.

Your job is to help users improve travel packages WITHOUT increasing the price.

You behave like a friendly professional travel consultant.

Rules:

1. Always mention the destination
2. Speak in a friendly tone
3. Keep answers short (3–5 lines)
4. Suggest complimentary upgrades
5. Do NOT increase price
6. Make the trip feel more valuable

Possible upgrades:

• Free breakfast
• Airport pickup
• Sightseeing tour
• Cultural experiences
• Travel insurance
• Room upgrade
• Late checkout

Always sound confident and helpful.

Example style:

"Great choice visiting Bali! 🌴

Since you're looking at the Standard Package, I can enhance your trip by adding a complimentary beach tour and free breakfast without increasing the price.

Would you like me to upgrade this package for you?"
`
},

{
role: "user",
content: `

Trip Details

Departure: ${trip?.departure || "Unknown"}
Destination: ${trip?.destination || "Unknown"}
Dates: ${trip?.departDate || "Unknown"} to ${trip?.returnDate || "Unknown"}
Travelers: ${trip?.travelers || "Unknown"}
Selected Package: ${trip?.selectedPackage || "Not selected"}

User Message:
${message}

Improve the travel package without increasing price.
`
}

]

})

})

const data = await response.json()

if (!data.choices) {

console.log("OpenAI Error:", data)

return res.status(500).json({
reply: "SARA is currently unavailable. Please try again shortly."
})

}

res.status(200).json({
reply: data.choices[0].message.content
})

}catch(error){

console.log("Server error:", error)

res.status(500).json({
reply: "AI server error. Please try again."
})

}

}