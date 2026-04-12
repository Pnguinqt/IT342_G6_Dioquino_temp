import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login.jsx";
import SignUpPage from "./pages/register.jsx";    
import './App.css'

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
      </Routes>
    </Router>
  )
}

export default App
