import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

export default function AdminDashboard(){

const navigate = useNavigate()

const [chats,setChats] = useState<any[]>([])
const [filteredChats,setFilteredChats] = useState<any[]>([])
const [loading,setLoading] = useState(true)

const [search,setSearch] = useState("")


/* ----------------------------- */
/* AUTH CHECK */
/* ----------------------------- */

useEffect(()=>{

const auth = localStorage.getItem("adminAuth")

if(auth !== "true"){
navigate("/admin")
}

fetchChats()

},[])



/* ----------------------------- */
/* FETCH CHATS */
/* ----------------------------- */

async function fetchChats(){

try{

setLoading(true)

const querySnapshot = await getDocs(collection(db,"saraChats"))

const data = querySnapshot.docs.map(doc => ({
id: doc.id,
...doc.data()
}))

setChats(data)
setFilteredChats(data)

setLoading(false)

}catch(err){
console.log(err)
setLoading(false)
}

}



/* ----------------------------- */
/* SEARCH FILTER */
/* ----------------------------- */

function handleSearch(value:string){

setSearch(value)

const filtered = chats.filter(chat =>
chat.message?.toLowerCase().includes(value.toLowerCase()) ||
chat.reply?.toLowerCase().includes(value.toLowerCase()) ||
chat.email?.toLowerCase().includes(value.toLowerCase())
)

setFilteredChats(filtered)

}



/* ----------------------------- */
/* LOGOUT */
/* ----------------------------- */

function logout(){

localStorage.removeItem("adminAuth")
navigate("/")

}



/* ----------------------------- */
/* STATS */
/* ----------------------------- */

const totalChats = chats.length

const satisfiedUsers = chats.filter(chat =>
chat.reply?.toLowerCase().includes("upgrade")
).length

const satisfactionRate = totalChats
? Math.round((satisfiedUsers / totalChats) * 100)
: 0



return(

<div className="min-h-screen bg-gray-100 p-10">

{/* HEADER */}

<div className="flex justify-between items-center mb-8">

<h1 className="text-3xl font-bold">
TripCraft Admin Panel
</h1>

<button
onClick={logout}
className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
>
Logout
</button>

</div>



{/* STATS */}

<div className="grid md:grid-cols-3 gap-8 mb-10">

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-gray-500">
Total SARA Chats
</h2>

<p className="text-3xl font-bold mt-2">
{totalChats}
</p>

</div>

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-gray-500">
AI Improvements
</h2>

<p className="text-3xl font-bold mt-2">
{satisfiedUsers}
</p>

</div>

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-gray-500">
User Satisfaction
</h2>

<p className="text-3xl font-bold mt-2 text-green-600">
{satisfactionRate}%
</p>

</div>

</div>



{/* SEARCH BAR */}

<div className="flex gap-4 mb-6">

<input
value={search}
onChange={(e)=>handleSearch(e.target.value)}
placeholder="Search chats..."
className="border p-3 rounded-lg w-80"
/>

<button
onClick={fetchChats}
className="bg-blue-600 text-white px-5 rounded-lg"
>
Refresh
</button>

</div>



{/* CHAT TABLE */}

<div className="bg-white rounded-xl shadow overflow-x-auto">

<table className="w-full text-left">

<thead className="bg-gray-100">

<tr>

<th className="p-4">User</th>
<th className="p-4">Email</th>
<th className="p-4">User Message</th>
<th className="p-4">AI Reply</th>

</tr>

</thead>

<tbody>

{loading && (

<tr>
<td className="p-6 text-center" colSpan={4}>
Loading chats...
</td>
</tr>

)}


{!loading && filteredChats.length === 0 && (

<tr>
<td className="p-6 text-center" colSpan={4}>
No chats found
</td>
</tr>

)}


{filteredChats.map(chat => (

<tr key={chat.id} className="border-t hover:bg-gray-50">

<td className="p-4 font-medium">
{chat.name || "Anonymous"}
</td>

<td className="p-4 text-gray-600">
{chat.email || "-"}
</td>

<td className="p-4 max-w-[300px]">
{chat.message}
</td>

<td className="p-4 max-w-[300px] text-blue-600">
{chat.reply}
</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)

}