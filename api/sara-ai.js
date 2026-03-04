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
        max_tokens: 200,
        messages: [
          {
            role: "system",
            content: "You are SARA, a friendly AI travel assistant. Improve travel packages without increasing price."
          },
          {
            role: "user",
            content: message
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