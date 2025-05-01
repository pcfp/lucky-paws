import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SearchPage from './pages/Search';
import './App.css'


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/lucky-paws/" element={<Login />} />
        <Route path="/lucky-paws/search" element={<SearchPage />} />
      </Routes>
    </Router>
  )
}

export default App
