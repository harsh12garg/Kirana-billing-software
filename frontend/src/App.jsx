import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import POS from './pages/POS'
import Bills from './pages/Bills'
import Credits from './pages/Credits'
import Customers from './pages/Customers'
import Settings from './pages/Settings'
import GSTCalculator from './pages/GSTCalculator'
import Layout from './components/Layout'

function App() {
  const { user } = useSelector((state) => state.auth)

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        
        <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="pos" element={<POS />} />
          <Route path="bills" element={<Bills />} />
          <Route path="credits" element={<Credits />} />
          <Route path="customers" element={<Customers />} />
          <Route path="gst-calculator" element={<GSTCalculator />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
