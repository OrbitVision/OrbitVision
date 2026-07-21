import './App.css';
import CesiumMap from './Components/CesiumMap';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './Context/AuthContext';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/satellites' element={<CesiumMap />} />
          <Route path='/' element={<Navigate to="/login" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
