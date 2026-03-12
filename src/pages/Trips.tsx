import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

type Trip = {
id:string
departure:string
destination:string
departDate:string
returnDate:string
travelers:number
package:string
price:number
bookingType:string
}

export default function Trips(){

const [trips,setTrips] = useState<Trip[]>([])
const [loading,setLoading] = useState(true)

useEffect(()=>{

async function fetchTrips(){

try{

const snapshot = await getDocs(collection(db,"trips"))

const list:Trip[] = snapshot.docs.map(doc => ({
id:doc.id,
...doc.data()
})) as Trip[]

setTrips(list)
setLoading(false)

}catch(err){

console.log("Error loading trips:",err)
setLoading(false)

}

}

fetchTrips()

},[])

return(

<div className="min-h-screen bg-gray-100 p-10">

<h1 className="text-3xl font-bold mb-8">
Your Trips
</h1>

{loading && (
<p>Loading trips...</p>
)}

{!loading && trips.length === 0 && (
<p>No trips booked yet.</p>
)}

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{trips.map(trip => (

<div key={trip.id}
className="bg-white shadow-lg rounded-xl p-6 border">

<h2 className="text-xl font-bold mb-2">
{trip.departure} → {trip.destination}
</h2>

<p className="text-gray-600">
📅 {trip.departDate} → {trip.returnDate}
</p>

<p className="text-gray-600">
👥 Travelers: {trip.travelers}
</p>

<p className="text-gray-700 mt-2">
📦 Package: {trip.package}
</p>

<p className="text-orange-600 font-bold mt-3">
₹ {trip.price}
</p>

<p className="text-sm text-gray-500 mt-2">
Booking via {trip.bookingType === "sara" ? "🤖 SARA AI" : "Normal Search"}
</p>

</div>

))}

</div>

</div>

)

}