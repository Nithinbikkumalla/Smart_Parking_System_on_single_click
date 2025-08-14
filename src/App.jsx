import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { RealtimeProvider } from './contexts/RealtimeContext'
import Login from './components/Login'
import ParkingGrid from './components/ParkingGrid'
import AdminDashboard from './components/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import ConnectionStatus from './components/ConnectionStatus'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <RealtimeProvider>
        <Router>
          <div className="App">
            <ConnectionStatus />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <ParkingGrid />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </RealtimeProvider>
    </AuthProvider>
  )
}

export default App
