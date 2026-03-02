import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AdminLogin(){

const navigate = useNavigate()

const [username,setUsername] = useState("")
const [password,setPassword] = useState("")

function handleLogin(){
  navigate("/admin/dashboard")
}

function login(){

if(username==="SRM research" && password==="SRM user 123"){

navigate("/admin/dashboard")

}else{

alert("Invalid credentials")

}

}

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