import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./features/user/login.jsx";
import SignUpPage from "./features/user/register.jsx";    
import UserProfile from "./features/user/userprofile.jsx";
import LandingPage from "./pages/landingpage.jsx";
<<<<<<< HEAD
import Dashboard from "./pages/dashboard.jsx";
import HospitalDashboard from "./pages/hospital.jsx"
import HospitalRegister from "./pages/hospitalregister.jsx";
import Admin from "./pages/admin.jsx";
import AdminLogin from "./pages/adminlogin.jsx";
=======
import Dashboard from "./features/user/dashboard.jsx";
>>>>>>> vertical-slices/frontend
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hospital" element={<HospitalDashboard />} />
          <Route path="/hospital/register" element={<HospitalRegister />} />
          <Route path="/admin/dashboard" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />  
        </Routes>
      </div>
    </Router>
  );
}

export default App
