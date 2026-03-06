import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

export default function AdminDashboard(){

const navigate = useNavigate()

const [analytics,setAnalytics] = useState<any[]>([])
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

fetchAnalytics()

},[])



/* ----------------------------- */
/* FETCH ANALYTICS */
/* ----------------------------- */

async function fetchAnalytics(){

try{

setLoading(true)

const snapshot = await getDocs(collection(db,"analytics"))

const data = snapshot.docs.map(doc => ({
id: doc.id,
...doc.data()
}))

setAnalytics(data)

setLoading(false)

}catch(err){

console.log(err)
setLoading(false)

}

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

const totalUsers = analytics.length

const normalSatisfied = analytics.filter(a =>
a.normalSearchSatisfied === true
).length

const saraUsed = analytics.filter(a =>
a.saraSatisfied === true
).length



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
Satisfied by Normal Search
</h2>

<p className="text-3xl font-bold mt-2 text-green-600">
{normalSatisfied}
</p>

</div>

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-gray-500">
Used SARA AI
</h2>

<p className="text-3xl font-bold mt-2 text-blue-600">
{saraUsed}
</p>

</div>

</div>



{/* USER TABLE */}

<div className="bg-white rounded-xl shadow overflow-x-auto">

<table className="w-full text-left">

<thead className="bg-gray-100">

<tr>

<th className="p-4">Name</th>
<th className="p-4">Email</th>
<th className="p-4">Normal Search</th>
<th className="p-4">SARA AI</th>

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

{!loading && analytics.length === 0 && (

<tr>
<td className="p-6 text-center" colSpan={4}>
No data found
</td>
</tr>

)}

{analytics.map(user => (

<tr key={user.id} className="border-t hover:bg-gray-50">

<td className="p-4 font-medium">
{user.name || "Anonymous"}
</td>

<td className="p-4 text-gray-600">
{user.email}
</td>

<td className="p-4">

{user.normalSearchSatisfied
? "✅ Yes"
: "❌ No"}

</td>

<td className="p-4">

{user.saraSatisfied
? "🤖 Used SARA"
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