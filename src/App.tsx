import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SearchPage from './pages/Search';
import './App.css'


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/lucky-dogs/" element={<Login />} />
        <Route path="/lucky-dogs/search" element={<SearchPage />} />
      </Routes>
    </Router>
  )
}

export default App
