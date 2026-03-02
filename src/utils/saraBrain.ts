export function generateSaraReply(message:string,destination:string){

const lower = message.toLowerCase()

/* YES / ACCEPT */

if(
lower.includes("yes") ||
lower.includes("ok") ||
lower.includes("sure") ||
lower.includes("fine")
){

return {
improved:true,
text:`Great! I've upgraded your TripCraft package for ${destination}.

Your package now includes:

🏨 Premium 4★ Hotel Upgrade
🍽 Complimentary Breakfast
🚖 Airport Pickup & Drop
🗺 Guided City Sightseeing
🛡 Travel Insurance
⏰ Late Checkout

All added **without increasing the price** 🎉

Would you like to confirm this upgraded package?`
}

}


/* LUXURY REQUEST */

if(lower.includes("luxury") || lower.includes("hotel")){

return {
improved:true,
text:`I've upgraded your hotel stay.

🏨 4★ Premium Hotel
🛏 Deluxe Room
🍽 Breakfast Included
🚖 Airport Pickup

Your package price remains the same.

Would you like to confirm?`
}

}


/* ACTIVITIES */

if(
lower.includes("activities") ||
lower.includes("tour") ||
lower.includes("sightseeing")
){

return {
improved:true,
text:`I've added new activities:

🗺 City Sightseeing Tour
🏝 Local Attractions
📸 Photography Spots
🍜 Local Food Experience

All included in your TripCraft package.

Ready to confirm the package?`
}

}


/* DEFAULT */

return {
improved:false,
text:`Tell me how you'd like to improve the trip.

Examples:

• Better hotel
• Luxury stay
• Sightseeing tours
• Food experiences
• Adventure activities`
}

}