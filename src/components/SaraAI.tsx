import { useState, useRef, useEffect } from "react"

export default function SaraAI(){

const [open,setOpen] = useState(false)
const [message,setMessage] = useState("")
const [loading,setLoading] = useState(false)

const chatEndRef = useRef<any>(null)

const [chat,setChat] = useState([
{
sender:"sara",
text:"Hi 👋 I'm SARA, your AI travel assistant. Ask me anything about your trip!"
}
])

useEffect(()=>{
chatEndRef.current?.scrollIntoView({behavior:"smooth"})
},[chat,loading])


async function sendMessage(){

if(message.trim()==="") return

const userMsg = { sender:"user", text:message }

setChat(prev => [...prev,userMsg])
setMessage("")
setLoading(true)

try{

const res = await fetch("/api/sara-ai",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({
message,
trip:{}
})
})

const data = await res.json()

const saraReply = {
sender:"sara",
text:data.reply || "Sorry, I couldn't generate a response."
}

setChat(prev => [...prev,saraReply])

}catch(err){

setChat(prev => [...prev,{
sender:"sara",
text:"AI server error. Please try again."
}])

}

setLoading(false)

}

return(

<div>

<button
onClick={()=>setOpen(!open)}
className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-xl z-50 hover:bg-blue-700"
>
SARA 🤖
</button>

{open && (

<div className="fixed bottom-20 right-6 w-[340px] bg-white shadow-2xl rounded-xl flex flex-col overflow-hidden">

<div className="bg-blue-600 text-white p-3 flex justify-between items-center">

<span className="font-semibold">SARA Travel Assistant</span>

<button
onClick={()=>setOpen(false)}
className="text-white text-lg"
>
✕
</button>

</div>

<div className="p-4 h-72 overflow-y-auto text-sm space-y-3 bg-gray-50">

{chat.map((msg,index)=>(

<div
key={index}
className={`flex ${msg.sender==="user" ? "justify-end" : "justify-start"}`}
>

<div
className={`max-w-[75%] px-3 py-2 rounded-lg break-words ${
msg.sender==="user"
? "bg-blue-600 text-white"
: "bg-gray-200 text-gray-800"
}`}
>

{msg.text}

</div>

</div>

))}

{loading && (
<div className="text-gray-500 text-sm">
SARA is thinking...
</div>
)}

<div ref={chatEndRef}></div>

</div>

<div className="flex border-t">

<input
value={message}
onChange={(e)=>setMessage(e.target.value)}
onKeyDown={(e)=>{
if(e.key==="Enter"){
sendMessage()
}
}}
placeholder="Ask SARA..."
className="flex-1 p-3 outline-none text-sm"
/>

<button
onClick={sendMessage}
className="bg-blue-600 text-white px-5"
>
Send
</button>

</div>

</div>

)}

</div>

)

}