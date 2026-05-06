import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login.jsx";
import SignUpPage from "./pages/register.jsx";    
import UserProfile from "./pages/userprofile.jsx";
import LandingPage from "./pages/landingpage.jsx";
import Dashboard from "./pages/dashboard.jsx";
import './App.css'

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </Router>
  )
}

export default App
