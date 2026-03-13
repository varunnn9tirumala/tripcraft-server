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
2. Only add complimentary benefits.
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
• moderate travel upgrades

Luxury Package:
• premium experiences

---------------------------------
RESPONSE FORMAT
---------------------------------

Always structure the response like this:

Short friendly introduction.

Then clearly show:

Previous Package Amenities:

• amenity
• amenity
• amenity

Then show the upgraded package using:

Here are the additional added benefits included in your package:

• benefit
• benefit
• benefit

Mention price only if needed.

Example:

"The total package price remains ₹15000."

Then ask if the user wants more customization.

---------------------------------
IMPORTANT WORDING RULE
---------------------------------

Never use the words:

"improvement"
"improvements"

Always use:

"additional added benefits"
"complimentary experiences"

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

---------------------------------
INAPPROPRIATE LANGUAGE
---------------------------------

If the user uses rude language:

Respond politely and redirect conversation.

---------------------------------
DESTINATION INTELLIGENCE
---------------------------------

Only recommend attractions for the DESTINATION city.

Example:

Trip: Hyderabad → Bangalore

Correct suggestions:
• Lalbagh Garden
• Cubbon Park
• Bangalore Palace

Wrong suggestions:
• Charminar
• Ramoji Film City

---------------------------------
PRICE QUESTIONS
---------------------------------

If the user asks about price per person:

Price per person = Total Price ÷ Travelers

Example:

Total price: ₹15000  
Travelers: 3

Answer:

"The price per person is approximately ₹5000."

---------------------------------
RESET REQUEST
---------------------------------

If the user asks to start again (reset, start fresh, clear plan):

Respond:

"Sure! Let's start fresh.

Tell me what type of travel experience you want:

• adventure
• relaxation
• food exploration
• sightseeing"
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