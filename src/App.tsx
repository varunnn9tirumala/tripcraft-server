import { BrowserRouter, Routes, Route } from "react-router-dom"

import Header from "./components/Header"
import Footer from "./components/Footer"
import SaraAI from "./components/SaraAI"

import LandingPage from "./pages/LandingPage"
import SearchResults from "./pages/SearchResults"
import Trips from "./pages/Trips"
import About from "./pages/About"
import Admin from "./pages/Admin"
import AdminLogin from "./pages/AdminLogin"
import SaraChat from "./pages/SaraChat"

export default function App(){

return(

<BrowserRouter>

<div className="flex flex-col min-h-screen">

<Header/>

<Routes>

<Route path="/" element={<LandingPage />} />

<Route path="/results" element={<SearchResults />} />

<Route path="/trips" element={<Trips />} />

<Route path="/about" element={<About />} />

<Route path="/sara" element={<SaraChat />} />

<Route path="/admin" element={<AdminLogin />} />

<Route path="/admin/dashboard" element={<Admin />} />

</Routes>

<Footer/>

<SaraAI/>

</div>

</BrowserRouter>

)

}