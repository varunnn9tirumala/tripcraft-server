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
travelers=1
} = trip

const [message,setMessage] = useState("")
const [loading,setLoading] = useState(false)

const chatEndRef = useRef<any>(null)

const [chat,setChat] = useState<any[]>([
{
sender:"sara",
text:`Hi 👋 I'm SARA.

I see you're planning a trip from ${departure} to ${destination}.

Tell me what you'd like to improve — hotels, experiences, or price value.`
}
])

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
travelers
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
text:"AI server error. Please try again."
}
])

}

setLoading(false)

}

return(

<div className="min-h-screen bg-gray-100 flex justify-center items-center p-10">

<div className="bg-white shadow-xl rounded-xl w-[600px] p-6">

<h1 className="text-2xl font-bold mb-3">
SARA AI Travel Assistant
</h1>

{/* TRIP SUMMARY */}

<div className="bg-blue-50 border rounded-lg p-3 mb-4 text-sm">

<p className="font-semibold mb-1">Your Trip</p>

<p>
{departure} → {destination}
</p>

<p>
{departDate} → {returnDate}
</p>

<p>
{travelers} Travelers
</p>

</div>

<div className="h-[380px] overflow-y-auto border rounded-lg p-4 mb-4 space-y-3 bg-gray-50">

{chat.map((msg,index)=>(

<div
key={index}
className={`flex ${msg.sender==="user"?"justify-end":"justify-start"}`}
>

<div
className={`max-w-[75%] px-4 py-2 rounded-lg break-words ${
msg.sender==="user"
? "bg-blue-600 text-white"
: "bg-gray-200 text-gray-800"
}`}
>

{msg.text}

</div>

</div>

))}

{loading && <p className="text-gray-500">SARA is thinking...</p>}

<div ref={chatEndRef}></div>

</div>

<div className="flex gap-2">

<input
value={message}
onChange={(e)=>setMessage(e.target.value)}
onKeyDown={(e)=>{
if(e.key==="Enter"){
sendMessage()
}
}}
placeholder="Ask SARA to improve your trip..."
className="flex-1 border p-3 rounded-lg"
/>

<button
onClick={sendMessage}
className="bg-blue-600 text-white px-5 py-3 rounded-lg"
>

Send

</button>

</div>

</div>

</div>

)

}