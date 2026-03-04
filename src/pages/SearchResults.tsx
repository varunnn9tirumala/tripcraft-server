import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export default function SearchResults(){

const location = useLocation()
const navigate = useNavigate()

const trip = location.state || {}

const {
departure = "",
destination = "",
departDate = "",
returnDate = "",
travelers = 1
} = trip

const [showPopup,setShowPopup] = useState(false)

const [flights,setFlights] = useState<any[]>([])
const [hotels,setHotels] = useState<any[]>([])


// -----------------------------
// BUTTON FUNCTIONS
// -----------------------------

function bookPackage(){
alert("✅ Package booked successfully!")
}

function improveAgain(){

navigate("/sara",{
state:{
departure,
destination,
departDate,
returnDate,
travelers
}
})

}


// -----------------------------
// POPUP TIMER
// -----------------------------

useEffect(()=>{

if(!departure || !destination) return

const timer = setTimeout(()=>{
setShowPopup(true)
},8000)

return ()=>clearTimeout(timer)

},[departure,destination])


function handleSatisfied(){
alert("👍 Great! Your interest is saved.")
setShowPopup(false)
}

function handleNotSatisfied(){

navigate("/sara",{
state:{
departure,
destination,
departDate,
returnDate,
travelers
}
})

}


// -----------------------------
// FETCH FLIGHTS
// -----------------------------

useEffect(()=>{

async function fetchFlights(){

try{

const res = await fetch(`https://tripcraft-server.onrender.com/api/flights?origin=${departure}&destination=${destination}`)

const data = await res.json()

setFlights(data || [])

}catch(err){
console.log("Flight error:",err)
}

}

if(departure && destination){
fetchFlights()
}

},[departure,destination])


// -----------------------------
// FETCH HOTELS
// -----------------------------

useEffect(()=>{

async function fetchHotels(){

try{

const res = await fetch(
`https://tripcraft-server.onrender.com/api/hotels?city=${destination}`
)

const data = await res.json()

const formatted = (data || []).map((h:any)=>({
name: h.Hotel_Name || h.name,
rating: h.Hotel_Rating || h.rating,
price: h.Hotel_Price || h.price
}))

setHotels(formatted)

}catch(err){
console.log(err)
}

}

if(destination){
fetchHotels()
}

},[destination])


// -----------------------------
// PRICE CALCULATION
// -----------------------------

let flightPrice = flights.length > 0 ? flights[0].price : 7000
let hotelPrice = hotels.length > 0 ? hotels[0].price : 5000

const basePrice = (flightPrice + hotelPrice) * travelers

const packages = [

{
name:"Basic Package",
price: basePrice,
features:[
"3★ Hotel",
"Flight Included",
"Breakfast",
"City Visit"
]
},

{
name:"Standard Package",
price: basePrice + 3000,
features:[
"4★ Hotel",
"Flight Included",
"Airport Pickup",
"Breakfast",
"City Tour"
]
},

{
name:"Premium Package",
price: basePrice + 7000,
features:[
"5★ Hotel",
"Flight Included",
"Luxury Pickup",
"Guided City Tour",
"Travel Insurance",
"Late Checkout"
]
}

]



return(

<div className="min-h-screen bg-gray-100 p-10 relative">

<h1 className="text-4xl font-bold mb-8">
Travel Packages
</h1>


{/* TRIP INFO */}

<div className="mb-8 text-lg">

<span className="font-semibold">{departure}</span>

{" → "}

<span className="font-semibold">{destination}</span>

&nbsp;&nbsp;|&nbsp;&nbsp;

{departDate} → {returnDate}

&nbsp;&nbsp;|&nbsp;&nbsp;

{travelers} Travelers

</div>


{/* FLIGHTS */}

<h2 className="text-2xl font-semibold mb-4">
Available Flights
</h2>

<div className="grid md:grid-cols-3 gap-6">

{flights.map((flight:any,index:number)=>(

<div key={index} className="bg-white p-6 rounded-xl shadow">

<h3 className="text-xl font-bold mb-2">
{flight.airline}
</h3>

<p className="text-gray-600">
Route: {flight.origin} → {flight.destination}
</p>

<p className="text-gray-600">
Departure: {flight.departureTime}
</p>

<p className="text-gray-600">
Arrival: {flight.arrivalTime}
</p>

<p className="text-blue-600 font-bold mt-3">
₹ {flight.price}
</p>

</div>

))}

</div>


{/* HOTELS */}

<h2 className="text-2xl font-semibold mt-10 mb-4">
Recommended Hotels
</h2>

<div className="grid md:grid-cols-3 gap-6">

{hotels.map((hotel:any,index:number)=>(
<div key={index} className="bg-white p-6 rounded-xl shadow">

<h3 className="text-xl font-bold mb-2">
{hotel.name}
</h3>

<p className="text-yellow-500">
⭐ {hotel.rating}
</p>

<p className="text-green-600 font-bold mt-3">
₹ {hotel.price} / night
</p>

</div>
))}

</div>


{/* PACKAGE OPTIONS */}

<h2 className="text-2xl font-semibold mt-12 mb-4">
Available Travel Packages
</h2>

<div className="grid md:grid-cols-3 gap-6">

{packages.map((pkg,index)=>(

<div key={index} className="bg-white p-6 rounded-xl shadow">

<h3 className="text-xl font-bold mb-3">
{pkg.name}
</h3>

<ul className="list-disc ml-5 text-gray-600 mb-4">

{pkg.features.map((f,i)=>(
<li key={i}>{f}</li>
))}

</ul>

<p className="text-2xl font-bold text-orange-600 mb-4">
₹ {pkg.price}
</p>

<button
onClick={bookPackage}
className="bg-green-600 text-white px-4 py-2 rounded-lg"
>
Book Package
</button>

</div>

))}

</div>


{/* POPUP */}

{showPopup && (

<div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">

<div className="bg-white p-8 rounded-xl shadow-xl text-center w-[400px]">

<h2 className="text-xl font-bold mb-4">
Are you satisfied with this package?
</h2>

<p className="text-gray-600 mb-6">
If not, our AI assistant SARA can improve it for you.
</p>

<div className="flex justify-center gap-4">

<button
onClick={handleSatisfied}
className="bg-green-600 text-white px-6 py-2 rounded-lg"
>
Yes 👍
</button>

<button
onClick={handleNotSatisfied}
className="bg-blue-600 text-white px-6 py-2 rounded-lg"
>
Ask SARA 🤖
</button>

</div>

</div>

</div>

)}

</div>

)

}