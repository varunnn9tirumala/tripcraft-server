import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

import { doc, setDoc } from "firebase/firestore"
import { db } from "../firebase"
import { getAuth } from "firebase/auth"

type Package = {
name: string
price: number
features: string[]
}

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
const [packages,setPackages] = useState<Package[]>([])

// -----------------------------
// NAVIGATE TO SARA
// -----------------------------

function improveWithSara(pkgName:string){

navigate("/sara",{
state:{
departure,
destination,
departDate,
returnDate,
travelers,
selectedPackage: pkgName
}
})

}

// -----------------------------
// POPUP TIMER
// -----------------------------

useEffect(()=>{

if(!departure || !destination) return

const timer = setTimeout(()=> setShowPopup(true),15000)

return ()=>clearTimeout(timer)

},[departure,destination])

// -----------------------------
// FIREBASE ANALYTICS
// -----------------------------

async function handleSatisfied(){

const auth = getAuth()
const user = auth.currentUser

if(user){

await setDoc(doc(db,"analytics",user.uid),{

name:user.displayName,
email:user.email,
normalSearchSatisfied:true,
saraSatisfied:false,
timestamp:new Date()

})

}

alert("👍 Great! Your interest is saved.")
setShowPopup(false)

}

async function handleNotSatisfied(){

const auth = getAuth()
const user = auth.currentUser

if(user){

await setDoc(doc(db,"analytics",user.uid),{

name:user.displayName,
email:user.email,
normalSearchSatisfied:false,
saraSatisfied:true,
timestamp:new Date()

})

}

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
// FETCH DATA FROM BACKEND
// -----------------------------

useEffect(()=>{

async function calculatePackages(){

try{

const flightRes = await fetch(
`https://tripcraft-server.onrender.com/api/flights?origin=${departure}&destination=${destination}`
)

const flights = await flightRes.json()

const hotelRes = await fetch(
`https://tripcraft-server.onrender.com/api/hotels?city=${destination}`
)

const hotels = await hotelRes.json()

// -----------------------------
// AVERAGE FLIGHT PRICE
// -----------------------------

const flightPrices =
flights?.map((f:any)=>f.price) || []

const avgFlight =
flightPrices.length > 0
? flightPrices.reduce((a:number,b:number)=>a+b,0) / flightPrices.length
: 7000

// -----------------------------
// AVERAGE HOTEL PRICE
// -----------------------------

const hotelPrices =
hotels?.map((h:any)=>h.Hotel_Price || h.price || 5000)

const avgHotel =
hotelPrices.length > 0
? hotelPrices.reduce((a:number,b:number)=>a+b,0) / hotelPrices.length
: 5000

let basePrice = (avgFlight + avgHotel) * travelers

// -----------------------------
// SAFETY PRICE LOGIC
// -----------------------------

const indianCities = [
"Delhi","Goa","Mumbai","Chennai","Bangalore",
"Kolkata","Hyderabad","Pune","Jaipur","Kochi"
]

const isInternational = !indianCities.includes(destination)

if(isInternational){

if(basePrice < 60000){
basePrice = 60000 * travelers
}

}else{

if(basePrice < 15000){
basePrice = 15000 * travelers
}

}

// -----------------------------
// CREATE PACKAGES
// -----------------------------

setPackages([

{
name:"Budget Package",
price: Math.round(basePrice * 0.8),
features:[
"3★ Comfortable Hotel",
"Airport Pickup",
"Daily Breakfast",
"City Sightseeing"
]
},

{
name:"Standard Package",
price: Math.round(basePrice),
features:[
"4★ Premium Hotel",
"Airport Pickup",
"Guided City Tour",
"Breakfast + Dinner"
]
},

{
name:"Luxury Package",
price: Math.round(basePrice * 1.4),
features:[
"5★ Luxury Resort",
"Private Airport Transfer",
"Exclusive Guided Tours",
"Travel Insurance",
"Late Checkout"
]
}

])

}catch(err){

console.log("Pricing error:",err)

setPackages([

{
name:"Budget Package",
price: 15000,
features:["3★ Hotel","Airport Pickup","Breakfast"]
},

{
name:"Standard Package",
price: 22000,
features:["4★ Hotel","City Tour","Dinner"]
},

{
name:"Luxury Package",
price: 35000,
features:["5★ Resort","Private Pickup","Travel Insurance"]
}

])

}

}

if(destination){
calculatePackages()
}

},[destination,departure,travelers])

return(

<div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">

<div className="bg-white shadow-xl rounded-xl p-8 mb-10 w-full max-w-4xl text-center">

<h2 className="text-sm text-gray-500 mb-2">
Your Trip
</h2>

<h1 className="text-3xl font-bold mb-3">
{departure} → {destination}
</h1>

<p className="text-gray-600">
{departDate} – {returnDate}
</p>

<p className="text-gray-600">
{travelers} Travelers
</p>

</div>

<h2 className="text-2xl font-bold mb-6">
Recommended Travel Packages
</h2>

<div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">

{packages.map((pkg,index)=>(

<div key={index}
className={`bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between transition hover:shadow-2xl
${pkg.name==="Luxury Package" ? "border-2 border-orange-400 scale-105" : ""}
`}>

<h3 className="text-xl font-bold mb-3">
{pkg.name}
</h3>

<ul className="text-gray-600 mb-6 space-y-1">

{pkg.features.map((f,i)=>(
<li key={i}>• {f}</li>
))}

</ul>

<p className="text-2xl font-bold text-orange-600 mb-4">
Starting from ₹ {pkg.price}
</p>

<div className="flex flex-col gap-3">

<button
onClick={()=>alert(`🎉 ${pkg.name} booked successfully!`)}
className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
>
Book Now
</button>

<button
onClick={()=>improveWithSara(pkg.name)}
className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
>
Improve with SARA 🤖
</button>

</div>

</div>

))}

</div>

{showPopup && (

<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">

<div className="bg-white p-8 rounded-xl shadow-xl text-center w-[420px]">

<h2 className="text-xl font-bold mb-4">
Are you satisfied with this package?
</h2>

<p className="text-gray-600 mb-6">
If not, our AI assistant SARA can improve it for you.
</p>

<div className="flex justify-center gap-4">

<button
onClick={handleSatisfied}
className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
>
Yes 👍
</button>

<button
onClick={handleNotSatisfied}
className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
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