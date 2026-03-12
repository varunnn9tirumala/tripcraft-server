import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

export default function Trips(){

const [trips,setTrips] = useState<any[]>([])

useEffect(()=>{

async function loadTrips(){

const snapshot = await getDocs(collection(db,"trips"))

const list:any[] = []

snapshot.forEach(doc=>{
list.push({
id:doc.id,
...doc.data()
})
})

setTrips(list)

}

loadTrips()

},[])

return(

<div className="p-10">

<h1 className="text-3xl font-bold mb-6">
Your Trips
</h1>

<div className="grid md:grid-cols-2 gap-6">

{trips.map((trip)=>(

<div key={trip.id} className="bg-white shadow p-6 rounded-lg">

<h2 className="text-xl font-semibold mb-2">
{trip.departure} → {trip.destination}
</h2>

<p>Dates: {trip.departDate} - {trip.returnDate}</p>

<p>Travelers: {trip.travelers}</p>

<p>Package: {trip.package}</p>

<p className="text-green-600 font-bold">
₹ {trip.price}
</p>

</div>

))}

</div>

</div>

)

}