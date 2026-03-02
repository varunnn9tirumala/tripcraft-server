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
        messages: [
          {
            role: "system",
            content:
              "You are SARA, the AI travel assistant for TripCraft. Improve travel packages without increasing price."
          },
          {
            role: "user",
            content: `
Trip details:
Departure: ${trip.departure}
Destination: ${trip.destination}
Travelers: ${trip.travelers}
Dates: ${trip.departDate} to ${trip.returnDate}

User request: ${message}
`
          }
        ]
      })
    })

    const data = await response.json()

    res.status(200).json({
      reply: data.choices[0].message.content
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "AI server error" })
  }
}