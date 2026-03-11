import { useLocation } from "react-router-dom"
import { useState, useRef, useEffect } from "react"

export default function SaraChat(){

const location = useLocation()

const trip = location.state || {}

const {
departure="",
destination="",
departDate="",
returnDate="",
travelers=1,
selectedPackage=""
} = trip

const [message,setMessage] = useState("")
const [loading,setLoading] = useState(false)

const chatEndRef = useRef<any>(null)

const [chat,setChat] = useState<any[]>([
{
sender:"sara",
text:`Hi 👋 I'm SARA, your TripCraft AI travel assistant.

I see you're planning a trip from ${departure} to ${destination}.

You're currently viewing the ${selectedPackage || "travel"} package.

How can I improve your trip?`
}
])

// Auto scroll
useEffect(()=>{
chatEndRef.current?.scrollIntoView({behavior:"smooth"})
},[chat,loading])

async function sendMessage(){

if(message.trim()==="") return

const userMsg = {sender:"user",text:message}

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
selectedPackage
}
})

})

const data = await res.json()

const aiReply={
sender:"sara",
text:data.reply
}

setChat(prev=>[...prev,aiReply])

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

return(

<div className="min-h-screen bg-gray-100 flex justify-center items-center p-10">

<div className="bg-white shadow-xl rounded-xl w-[650px] flex flex-col">

{/* HEADER */}

<div className="bg-blue-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">

<h1 className="text-lg font-semibold">
🤖 SARA AI Travel Assistant
</h1>

</div>

{/* TRIP SUMMARY */}

<div className="bg-blue-50 border-b px-6 py-3 text-sm">

<p className="font-semibold mb-1">Your Trip</p>

<p>
{departure} → {destination}
</p>

<p>
{departDate} → {returnDate}
</p>

<p>
{travelers} Travelers • {selectedPackage}
</p>

</div>

{/* CHAT AREA */}

<div className="h-[420px] overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">

{chat.map((msg,index)=>(

<div
key={index}
className={`flex items-end ${
msg.sender==="user"?"justify-end":"justify-start"
}`}
>

{msg.sender==="sara" && (
<div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2 text-sm">
🤖
</div>
)}

<div
className={`max-w-[70%] px-4 py-2 rounded-xl text-sm leading-relaxed break-words ${
msg.sender==="user"
? "bg-blue-600 text-white rounded-br-none"
: "bg-white border text-gray-800 rounded-bl-none"
}`}
>

{msg.text}

</div>

{msg.sender==="user" && (
<div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ml-2 text-sm">
👤
</div>
)}

</div>

))}

{loading && (

<div className="flex items-center text-gray-500 text-sm">

<div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2">
🤖
</div>

SARA is thinking...

</div>

)}

<div ref={chatEndRef}></div>

</div>

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
className="flex-1 border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
/>

<button
onClick={sendMessage}
className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm"
>
Send
</button>

</div>

</div>

</div>

)

}