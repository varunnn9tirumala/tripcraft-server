export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {

    const { message, trip } = req.body

    const shortMessage = message?.toLowerCase().trim()

    let userPrompt = ""

    // Handle greeting messages
    if(
      shortMessage === "hi" ||
      shortMessage === "hello" ||
      shortMessage === "hey"
    ){
      userPrompt = `
The user greeted you.

Reply with a short friendly greeting and ask what improvement they want for their trip.

Maximum 2 sentences.
`
    }

    // Handle ok/thanks
    else if(
      shortMessage === "ok" ||
      shortMessage === "okay" ||
      shortMessage === "thanks"
    ){
      userPrompt = `
The user acknowledged your message.

Reply politely and ask if they want:
• better hotel
• activities
• cheaper options

Maximum 2 sentences.
`
    }

    else{

      userPrompt = `
User Trip Details:

Departure: ${trip?.departure || "Unknown"}
Destination: ${trip?.destination || "Unknown"}
Travelers: ${trip?.travelers || "Unknown"}
Dates: ${trip?.departDate || "Unknown"} to ${trip?.returnDate || "Unknown"}

User Request:
${message}

Improve the travel package without increasing price.
`
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },

      body: JSON.stringify({

        model: "gpt-4o-mini",

        temperature: 0.6,

        max_tokens: 120,

        messages: [

          {
            role: "system",
            content: `
You are SARA, the AI travel assistant of TripCraft.

Your job is to improve travel packages WITHOUT increasing the price.

Rules:

1. NEVER increase the package price.
2. Add only complimentary experiences.
3. Choose experiences popular for the destination.
4. Adjust improvements based on package type:

Budget → small upgrades  
Standard → moderate upgrades  
Luxury → premium experiences  

5. Keep answers short (2–3 sentences).
6. Sound like a friendly travel expert.

Example:

"Great choice visiting Goa! 🌴  
I've added a complimentary sunset cruise and a local seafood tasting experience to your package.  
Your total price remains the same."

Avoid long explanations.
Avoid repeating greetings.
`
          },

          {
            role: "user",
            content: userPrompt
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

  }

  catch (error) {

    console.log("Server error:", error)

    res.status(500).json({
      reply: "AI server error. Please try again."
    })

  }

}