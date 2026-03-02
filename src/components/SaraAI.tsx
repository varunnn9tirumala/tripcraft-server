import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function SaraAI(){

const navigate = useNavigate()

const [open,setOpen] = useState(false)
const [message,setMessage] = useState("")
const [chat,setChat] = useState([
{
sender:"sara",
text:"Hi 👋 I'm SARA, your AI travel assistant."
}
])

function sendMessage(){

if(message.trim()==="") return

const userMsg = {sender:"user",text:message}

const saraReply = {
sender:"sara",
text:"Let me improve your travel package for you ✨"
}

setChat([...chat,userMsg,saraReply])
setMessage("")
}

return(

<div>

{/* MAIN BUTTON */}

<button
onClick={()=>navigate("/sara")}
className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-xl z-50 hover:bg-blue-700"
>
SARA 🤖
</button>


{/* SMALL CHAT WINDOW */}

{open && (

<div className="fixed bottom-20 right-6 w-80 bg-white shadow-2xl rounded-xl flex flex-col">

<div className="bg-blue-600 text-white p-3 rounded-t-xl">
SARA Travel Assistant
</div>

<div className="p-3 h-64 overflow-y-auto text-sm">

{chat.map((msg,index)=>(

<div
key={index}
className={`mb-2 ${
msg.sender==="user" ? "text-right" : "text-left"
}`}
>

<span
className={`inline-block px-3 py-2 rounded-lg ${
msg.sender==="user"
? "bg-blue-600 text-white"
: "bg-gray-200"
}`}
>

{msg.text}

</span>

</div>

))}

</div>

<div className="flex border-t">

<input
value={message}
onChange={(e)=>setMessage(e.target.value)}
placeholder="Ask SARA..."
className="flex-1 p-2 outline-none"
/>

<button
onClick={sendMessage}
className="bg-blue-600 text-white px-4"
>
Send
</button>

</div>

</div>

)}

</div>

)

}