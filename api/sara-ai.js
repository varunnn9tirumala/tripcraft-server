export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {

    const { message, trip } = req.body || {}

    const departure = trip?.departure || "Unknown"
    const destination = trip?.destination || "Unknown"
    const travelers = trip?.travelers || "Unknown"
    const departDate = trip?.departDate || "Unknown"
    const returnDate = trip?.returnDate || "Unknown"

    const response = await fetch("https://api.openai.com/v1/chat/completions", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },

      body: JSON.stringify({

        model: "gpt-4o-mini",
        max_tokens: 160,
        temperature: 0.65,

        messages: [

          {
            role: "system",
            content: `
You are SARA, the AI travel assistant for TripCraft.

Your job is to improve travel packages WITHOUT increasing the price.

Rules:
- Speak like a friendly travel agent.
- Keep responses short (3–5 lines).
- Mention the destination when possible.
- Suggest 2–4 complimentary upgrades.
- Use bullet points for upgrades.
- Never increase the package price.

Possible complimentary upgrades:
• Free breakfast
• Airport pickup
• Sightseeing tour
• Travel insurance
• Room upgrade
• Early check-in
• Late checkout
• Local cultural experiences

Response format:

Start with a friendly comment about the destination.

Example:
"Great choice visiting Goa! 🌴"

Then suggest upgrades like:

• Complimentary airport pickup
• Free breakfast during your stay
• Guided sunset beach tour

End with a helpful question like:
"Would you like me to include these upgrades in your trip?"
`
          },

          {
            role: "user",
            content: `
User Trip Details

Departure: ${departure}
Destination: ${destination}
Travelers: ${travelers}
Dates: ${departDate} to ${returnDate}

User Request:
${message || ""}

Improve this travel package without increasing the price.
`
          }

        ]

      })

    })

    const data = await response.json()

    if (!data || !data.choices || !data.choices[0]) {

      console.log("OpenAI error:", data)

      return res.status(500).json({
        reply: "AI service temporarily unavailable. Please try again."
      })

    }

    const aiReply = data.choices[0].message.content.trim()

    res.status(200).json({
      reply: aiReply
    })

  } catch (error) {

    console.log("Server error:", error)

    res.status(500).json({
      reply: "AI server error. Please try again."
    })

  }

}