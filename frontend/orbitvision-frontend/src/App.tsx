import "./App.css";
import { AuthProvider } from "./Context/AuthContext";
import CesiumMap from "./Components/CesiumMap";
import ProtectedRoute from "./Components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { LocationProvider } from "./Context/LocationContext";


function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <Router>
          <Routes>
    
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
    
            <Route path='/satellites' element={
              <ProtectedRoute>
                <CesiumMap />
              </ProtectedRoute>
            } />
  
            <Route path='/' element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />}/>
          
          </Routes>
        </Router>
      </LocationProvider>
    </AuthProvider>
  )
}

export default App
