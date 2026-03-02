import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SaraAI from "../components/SaraAI"

export default function LandingPage(){

const navigate = useNavigate()

const [departure,setDeparture] = useState("")
const [destination,setDestination] = useState("")
const [departDate,setDepartDate] = useState("")
const [returnDate,setReturnDate] = useState("")
const [travelers,setTravelers] = useState(1)

const [hotels,setHotels] = useState<any[]>([])

const [depSuggestions,setDepSuggestions] = useState<any[]>([])
const [desSuggestions,setDesSuggestions] = useState<any[]>([])



/* ----------------------------- */
/* FETCH DEPARTURE CITIES */
/* ----------------------------- */

async function handleDeparture(value:string){

setDeparture(value)

if(value.length < 2){
setDepSuggestions([])
return
}

try{

const res = await fetch(
`http://localhost:5050/api/locations/search?q=${value}`
)

const data = await res.json()

setDepSuggestions(data)

}catch(err){
console.log(err)
}

}



/* ----------------------------- */
/* FETCH DESTINATION CITIES */
/* ----------------------------- */

async function handleDestination(value:string){

setDestination(value)

if(value.length < 2){
setDesSuggestions([])
return
}

try{

const res = await fetch(
`http://localhost:5050/api/locations/search?q=${value}`
)

const data = await res.json()

setDesSuggestions(data)

}catch(err){
console.log(err)
}

}



/* ----------------------------- */
/* FETCH HOTELS */
/* ----------------------------- */

useEffect(()=>{

if(!destination) return

async function fetchHotels(){

try{

const res = await fetch(
`http://localhost:5050/api/hotels?city=${destination}`
)

const data = await res.json()

setHotels(data)

}catch(err){
console.log(err)
}

}

fetchHotels()

},[destination])



/* ----------------------------- */
/* SEARCH PACKAGES */
/* ----------------------------- */

function searchPackages(){

navigate("/results",{
state:{
departure,
destination,
departDate,
returnDate,
travelers
}
})

}



return(

<div className="flex flex-col min-h-screen">


{/* HERO SECTION */}

<div
className="relative flex flex-col items-center justify-center pt-16 pb-20"
style={{
backgroundImage:"url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34')",
backgroundSize:"cover",
backgroundPosition:"center"
}}
>

<div className="absolute inset-0 backdrop-blur-md bg-black/40"></div>

<div className="relative text-center">


{/* TITLE */}

<h1 className="text-6xl font-bold text-white mb-8">
TripCraft ✈
</h1>



{/* SEARCH BOX */}

<div className="bg-white rounded-xl shadow-xl p-6 w-[850px] max-w-[95%]">

<h2 className="text-2xl font-semibold mb-1">
Search Travel Packages
</h2>

<p className="text-gray-500 mb-6 text-sm">
Find combined flight and hotel deals
</p>



<div className="grid md:grid-cols-2 gap-4">


{/* Departure */}

<div className="relative">

<label className="block text-sm font-medium mb-1">
Departure City
</label>

<input
value={departure}
onChange={(e)=>handleDeparture(e.target.value)}
placeholder="Select departure city"
className="border p-3 rounded-md w-full"
/>

{depSuggestions.length>0 && (

<div className="absolute bg-white border w-full shadow-md mt-1 z-10 rounded-md">

{depSuggestions.map((place:any)=>(
<div
key={place._id}
onClick={()=>{
setDeparture(place.name)
setDepSuggestions([])
}}
className="p-2 hover:bg-blue-100 cursor-pointer"
>
{place.name}, {place.country}
</div>
))}

</div>

)}

</div>



{/* Destination */}

<div className="relative">

<label className="block text-sm font-medium mb-1">
Destination City
</label>

<input
value={destination}
onChange={(e)=>handleDestination(e.target.value)}
placeholder="Select destination city"
className="border p-3 rounded-md w-full"
/>

{desSuggestions.length>0 && (

<div className="absolute bg-white border w-full shadow-md mt-1 z-10 rounded-md">

{desSuggestions.map((place:any)=>(
<div
key={place._id}
onClick={()=>{
setDestination(place.name)
setDesSuggestions([])
}}
className="p-2 hover:bg-blue-100 cursor-pointer"
>
{place.name}, {place.country}
</div>
))}

</div>

)}

</div>



{/* Departure Date */}

<div>

<label className="block text-sm font-medium mb-1">
Departure Date
</label>

<input
type="date"
value={departDate}
onChange={(e)=>setDepartDate(e.target.value)}
className="border p-3 rounded-md w-full"
/>

</div>



{/* Return Date */}

<div>

<label className="block text-sm font-medium mb-1">
Return Date
</label>

<input
type="date"
value={returnDate}
onChange={(e)=>setReturnDate(e.target.value)}
className="border p-3 rounded-md w-full"
/>

</div>

</div>



{/* Travelers */}

<div className="mt-4">

<label className="block text-sm font-medium mb-1">
Number of Travelers
</label>

<input
type="number"
value={travelers}
onChange={(e)=>setTravelers(Number(e.target.value))}
className="border p-3 rounded-md w-full"
/>

</div>



<button
onClick={searchPackages}
className="bg-orange-600 hover:bg-orange-700 text-white w-full py-3 rounded-md mt-6"
>
Search Packages
</button>

</div>

</div>

</div>



{/* HOTEL PREVIEW SECTION */}

{hotels.length > 0 && (

<section className="p-10 bg-gray-100">

<h2 className="text-3xl font-bold mb-6">
Hotels in {destination}
</h2>

<div className="grid md:grid-cols-3 gap-6">

{hotels.slice(0,3).map((hotel:any,index:number)=>(
<div key={index} className="bg-white p-6 rounded-xl shadow">

<h3 className="text-xl font-bold">
{hotel.name || hotel.Hotel_Name}
</h3>

<p className="text-yellow-500">
⭐ {hotel.rating || hotel.Hotel_Rating}
</p>

<p className="text-green-600 font-bold">
₹ {hotel.price || hotel.Hotel_Price}
</p>

</div>
))}

</div>

</section>

)}



{/* WEBSITE INFO */}

<section className="bg-gray-100 py-20 px-10 text-center">

<h2 className="text-4xl font-bold mb-8">
Intelligent Travel Planning
</h2>

<p className="max-w-3xl mx-auto text-gray-600 text-lg">
TripCraft helps travelers discover the perfect travel package in seconds.
Our smart travel engine combines flights, hotels and destinations
into personalized travel experiences.
</p>



<div className="grid md:grid-cols-3 gap-12 mt-14 max-w-6xl mx-auto">

<div className="p-6 bg-white rounded-xl shadow-lg">

<h3 className="text-xl font-semibold mb-3">
AI Travel Search
</h3>

<p className="text-gray-600">
Instantly discover the best travel packages using our AI engine.
</p>

</div>



<div className="p-6 bg-white rounded-xl shadow-lg">

<h3 className="text-xl font-semibold mb-3">
SARA AI Assistant
</h3>

<p className="text-gray-600">
Your intelligent travel companion guiding you step-by-step.
</p>

</div>



<div className="p-6 bg-white rounded-xl shadow-lg">

<h3 className="text-xl font-semibold mb-3">
Customize Your Trip
</h3>

<p className="text-gray-600">
Design your perfect journey with smart recommendations.
</p>

</div>

</div>

</section>



{/* FLOATING SARA BUTTON */}

<SaraAI/>


</div>

)

}