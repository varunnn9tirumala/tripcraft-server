import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

import {
PieChart,
Pie,
Cell,
Tooltip,
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
ResponsiveContainer
} from "recharts"

export default function Admin(){

const [username,setUsername] = useState("")
const [password,setPassword] = useState("")
const [logged,setLogged] = useState(false)

const [users,setUsers] = useState<any[]>([])


// ============================
// CHECK LOGIN SESSION
// ============================

useEffect(()=>{

const admin = localStorage.getItem("adminLogged")

if(admin==="true"){
setLogged(true)
}

},[])


// ============================
// LOAD USERS FROM FIREBASE
// ============================

useEffect(()=>{

async function loadUsers(){

try{

const querySnapshot = await getDocs(collection(db,"users"))

const list:any[] = []

querySnapshot.forEach((doc)=>{
list.push({
id: doc.id,
...doc.data()
})
})

setUsers(list)

}catch(err){

console.log("Error loading users:",err)

}

}

if(logged){
loadUsers()
}

},[logged])


// ============================
// ADMIN LOGIN
// ============================

function login(){

if(username==="SRM research" && password==="SRM user 123"){

localStorage.setItem("adminLogged","true")
setLogged(true)

}else{

alert("Invalid credentials")

}

}


// ============================
// LOGOUT
// ============================

function logout(){

localStorage.removeItem("adminLogged")
setLogged(false)

}


// ============================
// ANALYTICS CALCULATIONS
// ============================

const totalUsers = users.length

const saraUsers = users.filter(u => u.usedSara === true).length
const normalUsers = totalUsers - saraUsers

const totalBookings = users.reduce(
(sum, u) => sum + (u.bookings || 0),
0
)


// ============================
// CHART DATA
// ============================

const pieData = [
{ name:"Normal Users", value:normalUsers },
{ name:"Used SARA", value:saraUsers }
]

const barData = [
{ name:"Users", value:totalUsers },
{ name:"Bookings", value:totalBookings },
{ name:"SARA Usage", value:saraUsers }
]

const COLORS = ["#22c55e","#3b82f6"]


// ============================
// DASHBOARD UI
// ============================

if(logged){

return(

<div className="p-10 bg-gray-100 min-h-screen">

<h1 className="text-3xl font-bold mb-6">
TripCraft Admin Panel
</h1>

<button
onClick={logout}
className="bg-red-500 text-white px-4 py-2 rounded mb-6"
>
Logout
</button>


{/* ===================== */}
{/* STATS */}
{/* ===================== */}

<div className="grid grid-cols-3 gap-6 mb-10">

<div className="bg-white shadow p-6 rounded-lg">
<h2 className="text-xl font-semibold">Total Users</h2>
<p className="text-3xl text-blue-600 mt-3">{totalUsers}</p>
</div>

<div className="bg-white shadow p-6 rounded-lg">
<h2 className="text-xl font-semibold">Total Bookings</h2>
<p className="text-3xl text-green-600 mt-3">{totalBookings}</p>
</div>

<div className="bg-white shadow p-6 rounded-lg">
<h2 className="text-xl font-semibold">SARA AI Usage</h2>
<p className="text-3xl text-purple-600 mt-3">{saraUsers}</p>
</div>

</div>


{/* ===================== */}
{/* CHARTS */}
{/* ===================== */}

<div className="grid grid-cols-2 gap-10 mb-10">

<div className="bg-white shadow p-6 rounded-lg">

<h2 className="text-lg font-semibold mb-4">
User Behaviour
</h2>

<ResponsiveContainer width="100%" height={300}>

<PieChart>

<Pie
data={pieData}
dataKey="value"
cx="50%"
cy="50%"
outerRadius={100}
label
>

{pieData.map((entry,index)=>(
<Cell key={index} fill={COLORS[index]} />
))}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>


<div className="bg-white shadow p-6 rounded-lg">

<h2 className="text-lg font-semibold mb-4">
Platform Insights
</h2>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={barData}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="name"/>

<YAxis/>

<Tooltip/>

<Bar dataKey="value" fill="#3b82f6"/>

</BarChart>

</ResponsiveContainer>

</div>

</div>


{/* ===================== */}
{/* USERS TABLE */}
{/* ===================== */}

<table className="w-full border bg-white shadow">

<thead className="bg-gray-100">

<tr>
<th className="p-3 border">Name</th>
<th className="p-3 border">Email</th>
<th className="p-3 border">Bookings</th>
<th className="p-3 border">SARA Usage</th>
</tr>

</thead>

<tbody>

{users.map((u,index)=>(

<tr key={index}>

<td className="p-3 border">
{u.name || "-"}
</td>

<td className="p-3 border">
{u.email || "-"}
</td>

<td className="p-3 border">
{u.bookings || 0}
</td>

<td className="p-3 border">
{u.usedSara ? "🤖 Used" : "-"}
</td>

</tr>

))}

</tbody>

</table>

</div>

)

}


// ============================
// LOGIN PAGE
// ============================

return(

<div className="flex items-center justify-center min-h-screen bg-gray-100">

<div className="bg-white p-10 rounded-xl shadow-xl w-[400px]">

<h1 className="text-2xl font-bold mb-6 text-center">
Admin Login
</h1>

<input
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
className="border p-3 w-full mb-4 rounded"
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="border p-3 w-full mb-6 rounded"
/>

<button
onClick={login}
className="bg-blue-600 text-white w-full py-3 rounded"
>
Login
</button>

</div>

</div>

)

}