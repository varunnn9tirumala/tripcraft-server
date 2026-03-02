import { useState, useEffect } from "react"
import { Home, Map, Info, Shield } from "lucide-react"

import { loginWithGoogle, logoutUser, listenAuth } from "../auth"

export default function Header(){

const [user,setUser] = useState<any>(null)

useEffect(()=>{

const unsub = listenAuth((u:any)=>{
setUser(u)
})

return ()=>unsub()

},[])

return(

<header className="bg-black text-white px-10 py-4 flex items-center justify-between shadow-lg">

<h1 className="text-3xl font-extrabold tracking-widest text-blue-400">
Trip Craft ✈
</h1>

<nav className="flex items-center gap-8 text-lg font-semibold">

<a href="/" className="flex items-center gap-2 hover:text-blue-400">
<Home size={20}/>
Home
</a>

<a href="/trips" className="flex items-center gap-2 hover:text-blue-400">
<Map size={20}/>
Trips
</a>

<a href="/about" className="flex items-center gap-2 hover:text-blue-400">
<Info size={20}/>
About
</a>

<a href="/admin" className="flex items-center gap-2 hover:text-blue-400">
<Shield size={20}/>
Admin
</a>

</nav>

<div>

{user ? (

<div className="flex items-center gap-4">

<span>
Hello {user.displayName}
</span>

<button
onClick={logoutUser}
className="bg-red-500 px-3 py-1 rounded"
>
Logout
</button>

</div>

) : (

<button
onClick={loginWithGoogle}
className="bg-blue-500 px-4 py-2 rounded"
>
Login with Google
</button>

)}

</div>

</header>

)

}