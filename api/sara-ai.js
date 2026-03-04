export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {

    const { message, trip = {} } = req.body

    const {
      departure = "",
      destination = "",
      travelers = "",
      departDate = "",
      returnDate = ""
    } = trip

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 200,
        messages: [
          {
            role: "system",
            content: `
You are SARA, the AI travel assistant of TripCraft.

Your job is to improve travel packages WITHOUT increasing price.

You can add complimentary experiences like:
• Free breakfast
• Airport pickup
• Sightseeing tour
• Travel insurance
• Room upgrade
• Late checkout

Always speak like a friendly travel agent.
Keep responses short and helpful.
`
          },
          {
            role: "user",
            content: `
Trip Details

Departure: ${departure}
Destination: ${destination}
Travelers: ${travelers}
Dates: ${departDate} to ${returnDate}

User request:
${message}
`
          }
        ]
      })
    })

    const data = await response.json()

    // Handle OpenAI errors safely
    if (!response.ok) {
      console.log("OpenAI API error:", data)
      return res.status(500).json({
        error: "OpenAI API error"
      })
    }

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response."

    return res.status(200).json({
      reply
    })

  } catch (error) {

    console.log("Server error:", error)

    return res.status(500).json({
      error: "AI server error"
    })
  }
}