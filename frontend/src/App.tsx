import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Menu from './pages/Menu'
import Ruleta from './pages/Ruleta'
import BlackJack from './pages/Blackjack'
import './index.css'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token')
  return token ? <>{children}</> : <Navigate to="/login" />
}

const JugadorRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token')
  const role  = localStorage.getItem('role')
  if (!token) return <Navigate to="/login" />
  if (role !== 'jugador') return <Navigate to="/menu" />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"     element={<Login />} />
        <Route path="/menu"      element={<PrivateRoute><Menu /></PrivateRoute>} />
        <Route path="/ruleta"    element={<JugadorRoute><Ruleta /></JugadorRoute>} />
        <Route path="/blackjack" element={<JugadorRoute><BlackJack /></JugadorRoute>} />
        <Route path="*"          element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}