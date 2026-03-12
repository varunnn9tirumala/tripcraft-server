import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
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

export default function AdminDashboard(){

const navigate = useNavigate()

const [users,setUsers] = useState<any[]>([])
const [filtered,setFiltered] = useState<any[]>([])
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

fetchUsers()

},[])



/* ----------------------------- */
/* FETCH USERS */
/* ----------------------------- */

async function fetchUsers(){

try{

setLoading(true)

const snapshot = await getDocs(collection(db,"users"))

const data = snapshot.docs.map(doc => ({
id: doc.id,
...doc.data()
}))

setUsers(data)
setFiltered(data)

setLoading(false)

}catch(err){

console.log(err)
setLoading(false)

}

}



/* ----------------------------- */
/* SEARCH */
/* ----------------------------- */

function handleSearch(value:string){

setSearch(value)

const filteredData = users.filter(user =>
user.name?.toLowerCase().includes(value.toLowerCase()) ||
user.email?.toLowerCase().includes(value.toLowerCase())
)

setFiltered(filteredData)

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

const totalUsers = users.length

const totalBookings = users.reduce(
(sum,user)=> sum + (user.bookings || 0),
0
)

const saraUsage = users.filter(user =>
user.usedSara === true
).length

const normalUsers = totalUsers - saraUsage



/* ----------------------------- */
/* PIE CHART DATA */
/* ----------------------------- */

const pieData = [

{ name:"Normal Users", value:normalUsers },
{ name:"Used SARA", value:saraUsage }

]

const COLORS = ["#22c55e","#3b82f6"]



/* ----------------------------- */
/* BAR CHART DATA */
/* ----------------------------- */

const barData = [

{
name:"Users",
value:totalUsers
},

{
name:"Bookings",
value:totalBookings
},

{
name:"SARA Usage",
value:saraUsage
}

]



return(

<div className="min-h-screen bg-gray-100 p-10">

{/* HEADER */}

<div className="flex justify-between items-center mb-8">

<h1 className="text-3xl font-bold">
TripCraft Admin Dashboard
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
Total Users
</h2>

<p className="text-3xl font-bold mt-2">
{totalUsers}
</p>

</div>

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-gray-500">
Total Bookings
</h2>

<p className="text-3xl font-bold mt-2 text-green-600">
{totalBookings}
</p>

</div>

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-gray-500">
SARA AI Usage
</h2>

<p className="text-3xl font-bold mt-2 text-blue-600">
{saraUsage}
</p>

</div>

</div>



{/* CHARTS */}

<div className="grid md:grid-cols-2 gap-10 mb-12">

<div className="bg-white p-6 rounded-xl shadow">

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



<div className="bg-white p-6 rounded-xl shadow">

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



{/* SEARCH */}

<div className="mb-6">

<input
value={search}
onChange={(e)=>handleSearch(e.target.value)}
placeholder="Search users..."
className="border p-3 rounded-lg w-80"
/>

</div>



{/* USER TABLE */}

<div className="bg-white rounded-xl shadow overflow-x-auto">

<table className="w-full text-left">

<thead className="bg-gray-100">

<tr>

<th className="p-4">Name</th>
<th className="p-4">Email</th>
<th className="p-4">Bookings</th>
<th className="p-4">SARA Usage</th>

</tr>

</thead>

<tbody>

{loading && (

<tr>
<td className="p-6 text-center" colSpan={4}>
Loading data...
</td>
</tr>

)}

{!loading && filtered.length === 0 && (

<tr>
<td className="p-6 text-center" colSpan={4}>
No users found
</td>
</tr>

)}

{filtered.map(user => (

<tr key={user.id} className="border-t hover:bg-gray-50">

<td className="p-4 font-medium">
{user.name || "Unknown"}
</td>

<td className="p-4 text-gray-600">
{user.email || "Unknown"}
</td>

<td className="p-4">
{user.bookings || 0}
</td>

<td className="p-4">

{user.usedSara
? "🤖 Used"
: "—"}

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)

}