export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {

    const { message, trip } = req.body

    const shortMessage = message?.toLowerCase().trim()

    let userPrompt = ""

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
• local experiences

Maximum 2 sentences.
`
    }

    else{

      userPrompt = `
User Trip Details:

Departure: ${trip?.departure || "Unknown"}
Destination: ${trip?.destination || "Unknown"}
Travelers: ${trip?.travelers || "Unknown"}
Package: ${trip?.selectedPackage || "Standard Package"}
Package Price: ₹${trip?.price || "Not Provided"}
Dates: ${trip?.departDate || "Unknown"} to ${trip?.returnDate || "Unknown"}

User Request:
${message}

Improve the travel package WITHOUT increasing price.

Always clearly mention the final price:
"The total price remains ₹${trip?.price}".
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

Rules:

1. NEVER increase the package price
2. Add complimentary experiences only
3. Suggest activities popular for the destination
4. Adjust upgrades based on package:

Budget → small upgrades
Standard → moderate upgrades
Luxury → premium upgrades

5. Keep replies SHORT (1–2 sentences)
6. Friendly travel expert tone
7. If the user asks about payment methods, answer:
   "Yes, we support UPI (PhonePe, Google Pay), cards, and net banking."
8. If the user asks about room size or hotel details, explain briefly about the hotel amenities.
9. Keep answers short (1–2 sentences).

Example:

"Great choice visiting Goa! 🌴
I've added a complimentary sunset cruise and beach yoga session.
Your total price remains the same."
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