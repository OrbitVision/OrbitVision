import './App.css';
import CesiumMap from './Components/CesiumMap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<CesiumMap />} />
      </Routes>
    </Router>
  )
}

export default App
