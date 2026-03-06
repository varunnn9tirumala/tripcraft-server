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
        max_tokens: 180,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `
You are SARA, the AI travel assistant for TripCraft.

Your job is to improve travel packages WITHOUT increasing the price.

Guidelines:
• Keep answers short and friendly (3–5 lines)
• Speak like a professional travel agent
• Always reference the destination when possible
• Suggest complimentary experiences such as:
  - Free breakfast
  - Airport pickup
  - Sightseeing tour
  - Travel insurance
  - Room upgrade
  - Local cultural experiences

Tone example:
"Great choice visiting Goa! 🌴 I can enhance your package by adding a complimentary beach sightseeing tour and free breakfast without increasing the price."

Always be helpful, human-like, and easy to understand.
`
          },

          {
            role: "user",
            content: `
User Trip Details:

Departure: ${trip?.departure || "Unknown"}
Destination: ${trip?.destination || "Unknown"}
Travelers: ${trip?.travelers || "Unknown"}
Dates: ${trip?.departDate || "Unknown"} to ${trip?.returnDate || "Unknown"}

User Request:
${message}

Improve this travel package without increasing the price.
`
          }

        ]
      })
    })

    const data = await response.json()

    if (!data.choices) {
      console.log("OpenAI error:", data)
      return res.status(500).json({
        reply: "AI service temporarily unavailable."
      })
    }

    res.status(200).json({
      reply: data.choices[0].message.content
    })

  } catch (error) {

    console.log("Server error:", error)

    res.status(500).json({
      reply: "AI server error. Please try again."
    })

  }
}