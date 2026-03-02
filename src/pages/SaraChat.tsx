import { useLocation } from "react-router-dom"
import { useState } from "react"

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

const [chat,setChat] = useState<any[]>([
{
sender:"sara",
text:`Hi 👋 I'm SARA.

I see you're planning a trip from ${departure} to ${destination}.

How can I improve your travel package?`
}
])

async function sendMessage(){

if(message.trim()==="") return

const userMsg = {sender:"user",text:message}

setChat(prev=>[...prev,userMsg])

setMessage("")
setLoading(true)

try{

const res = await fetch("http://localhost:5050/api/sara-ai",{

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

<div className="bg-white shadow-xl rounded-xl w-[550px] p-6">

<h1 className="text-2xl font-bold mb-4">
SARA AI Travel Assistant
</h1>

<div className="h-[350px] overflow-y-auto border rounded-lg p-4 mb-4">

{chat.map((msg,index)=>(

<div key={index}
className={msg.sender==="user"?"text-right mb-3":"text-left mb-3"}>

<span className={`px-4 py-2 rounded-lg ${
msg.sender==="user"
? "bg-blue-600 text-white"
: "bg-gray-200"
}`}>

{msg.text}

</span>

</div>

))}

{loading && <p className="text-gray-500">SARA is thinking...</p>}

</div>

<div className="flex gap-2">

<input
value={message}
onChange={(e)=>setMessage(e.target.value)}
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