import { useLocation } from "react-router-dom"
import { useState, useRef, useEffect } from "react"

import { doc, setDoc, getDoc, addDoc, collection } from "firebase/firestore"
import { db } from "../firebase"
import { getAuth } from "firebase/auth"

type ChatMessage = {
  sender: "user" | "sara"
  text: string
}

export default function SaraChat(){

const location = useLocation()

const trip = location.state || {}

const {
departure="",
destination="",
departDate="",
returnDate="",
travelers=1,
selectedPackage="",
price=0
} = trip

const [message,setMessage] = useState(
selectedPackage
? `Can you improve this ${selectedPackage.toLowerCase()} with better experiences and amenities?`
: "Can you improve this travel package?"
)
const [loading,setLoading] = useState(false)
const [showBooking,setShowBooking] = useState(false)

const chatEndRef = useRef<HTMLDivElement | null>(null)

const [chat,setChat] = useState<ChatMessage[]>([
{
sender:"sara",
text:`Hi 👋 I'm SARA.

I see you're planning a trip from ${departure} to ${destination}.

You're currently viewing the ${selectedPackage || "travel"} package.

Tell me what you'd like to improve and I'll try to add complimentary experiences without increasing your price.`
}
])

// ======================
// AUTO SCROLL
// ======================

useEffect(()=>{
chatEndRef.current?.scrollIntoView({behavior:"smooth"})
},[chat,loading])

// ======================
// SEND MESSAGE
// ======================

async function sendMessage(){

if(message.trim()==="") return

const userMsg:ChatMessage = {sender:"user",text:message}

setChat(prev=>[...prev,userMsg])
setMessage("")
setLoading(true)

try{

const res = await fetch("/api/sara-ai",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
message,
trip:{
departure,
destination,
departDate,
returnDate,
travelers,
selectedPackage,
price
}
})

})

const data = await res.json()

const aiReply:ChatMessage = {
sender:"sara",
text:data.reply
}

setChat(prev=>[...prev,aiReply])

// show booking button after AI reply
setShowBooking(true)

}catch(err){

setChat(prev=>[
...prev,
{
sender:"sara",
text:"⚠️ AI server error. Please try again."
}
])

}

setLoading(false)

}


// ======================
// SAVE TRIP FUNCTION
// ======================

async function saveTrip(userId:string,name:string,email:string){

await addDoc(collection(db,"trips"),{

userId,
name,
email,

departure,
destination,
departDate,
returnDate,
travelers,

package:selectedPackage,
price,

bookingType:"sara",

createdAt:new Date()

})

}


// ======================
// CONFIRM SARA BOOKING
// ======================

async function confirmSaraBooking(){

const auth = getAuth()
const user = auth.currentUser

let name="Unknown"
let email="Unknown"
let userId="guest_"+Date.now()

if(user){
name=user.displayName || "Unknown"
email=user.email || "Unknown"
userId=user.uid
}

const ref = doc(db,"users",userId)

const snap = await getDoc(ref)

if(snap.exists()){

await setDoc(ref,{
name,
email,
usedSara:true,
bookings:(snap.data().bookings || 0)+1
},{merge:true})

}else{

await setDoc(ref,{
name,
email,
usedSara:true,
bookings:1
})

}

// Save trip
await saveTrip(userId,name,email)

alert("🎉 Booking confirmed with SARA!")

setShowBooking(false)

}


// ======================
// UI
// ======================

return(

<div className="min-h-screen bg-gray-100 flex justify-center items-center p-10">

<div className="bg-white shadow-xl rounded-xl w-[650px] flex flex-col">

{/* HEADER */}

<div className="bg-blue-600 text-white px-6 py-4 rounded-t-xl">
<h1 className="text-lg font-semibold">
🤖 SARA AI Travel Assistant
</h1>
</div>

{/* TRIP SUMMARY */}

<div className="bg-blue-50 border-b px-6 py-3 text-sm">

<p className="font-semibold mb-1">Your Trip</p>

<p>{departure} → {destination}</p>

<p>{departDate} → {returnDate}</p>

<p>{travelers} Travelers • {selectedPackage}</p>

</div>

{/* CHAT AREA */}

<div className="h-[420px] overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">

{chat.map((msg,index)=>(

<div
key={index}
className={`flex ${msg.sender==="user"?"justify-end":"justify-start"}`}
>

<div
className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${
msg.sender==="user"
? "bg-blue-600 text-white"
: "bg-white border text-gray-800"
}`}
>

{msg.text}

</div>

</div>

))}

{loading && <p className="text-gray-500">SARA is thinking...</p>}

<div ref={chatEndRef}></div>

</div>


{/* BOOKING ACTION */}

{showBooking && (

<div className="px-6 py-3 border-t flex gap-3">

<button
onClick={confirmSaraBooking}
className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
>
Confirm Booking with SARA
</button>

<button
onClick={()=>setShowBooking(false)}
className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm"
>
Continue Chat
</button>

</div>

)}

{/* INPUT */}

<div className="border-t px-4 py-3 flex gap-2">

<input
value={message}
onChange={(e)=>setMessage(e.target.value)}
onKeyDown={(e)=>{
if(e.key==="Enter"){
sendMessage()
}
}}
placeholder="Ask SARA to improve your trip..."
className="flex-1 border rounded-lg px-4 py-2 text-sm"
/>

<button
onClick={sendMessage}
className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm"
>
Send
</button>

</div>

</div>

</div>

)

}