export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {

    const { message, trip } = req.body

    const shortMessage = message?.toLowerCase().trim()

    let userPrompt = ""

    // Greeting handling
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

    // acknowledgement
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

    // main travel improvement logic
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

Improve the travel package WITHOUT increasing the price.

Mention the price only if relevant.
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
        max_tokens: 200,

        messages: [

          {
            role: "system",
            content: `
You are **SARA**, the AI Travel Assistant of TripCraft.

Your job is to help users improve their travel packages WITHOUT increasing the price.

You must behave like a professional travel consultant.

---------------------------------
CORE RULES
---------------------------------

1. Never increase the package price.
2. Only add complimentary improvements.
3. Recommend experiences popular for the destination.
4. Keep responses structured and easy to read.
5. Avoid long paragraphs.
6. Prefer bullet points.

---------------------------------
PACKAGE IMPROVEMENT LOGIC
---------------------------------

Budget Package:
• small complimentary upgrades

Standard Package:
• moderate travel improvements

Luxury Package:
• premium experiences and comfort upgrades

---------------------------------
RESPONSE FORMAT
---------------------------------

Use this structure:

Short introduction sentence.

Then improvements:

• improvement
• improvement
• improvement

Mention price only if needed:

Example:
"The total package price remains ₹15000."

Then ask user if they want more improvements.

---------------------------------
SMALL MESSAGE HANDLING
---------------------------------

Users may type:

hi
hello
ok
yes
price?
hotel?
airport?
food?
activities?

Understand the intent and respond helpfully.

---------------------------------
UNRELATED QUESTIONS
---------------------------------

If the user asks unrelated things (payments etc):

Politely answer briefly and bring conversation back to travel planning.

Example:

"We support multiple payment options during booking.  
Meanwhile, would you like me to improve your travel package?"

---------------------------------
INAPPROPRIATE LANGUAGE
---------------------------------

If the user uses rude language:

Respond politely and redirect conversation.

Example:

"I'm here to help plan your trip.  
Please let me know how you'd like to improve your travel package."

---------------------------------
DESTINATION INTELLIGENCE
---------------------------------

Use known attractions.

Goa:
• sunset cruise
• scuba diving
• beach nightlife

Hyderabad:
• Charminar
• Ramoji Film City
• street food walk

Bangalore:
• Lalbagh Garden
• Cubbon Park
• café hopping tour

---------------------------------
IMPORTANT
---------------------------------

• Do NOT repeat the price every message.
• Only mention price when relevant.
• Keep responses concise.
• Use bullet points.
• Sound professional and friendly.
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