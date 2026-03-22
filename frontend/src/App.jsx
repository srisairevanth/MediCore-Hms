import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { isLoggedIn } from './lib/api'
import Landing      from './pages/Landing'
import Login        from './pages/Login'
import Register     from './pages/Register'
import Layout       from './components/layout/Layout'
import Dashboard    from './pages/Dashboard'
import Patients     from './pages/Patients'
import Doctors      from './pages/Doctors'
import Appointments from './pages/Appointments'
import Treatments   from './pages/Treatments'
import Departments  from './pages/Departments'

function Protected({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: '10px', fontSize: '14px' },
        success: { iconTheme: { primary: '#0d9488', secondary: '#fff' } }
      }}/>
      <Routes>
        <Route path="/"         element={<Landing />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard"    element={<Protected><Layout><Dashboard /></Layout></Protected>} />
        <Route path="/patients"     element={<Protected><Layout><Patients /></Layout></Protected>} />
        <Route path="/doctors"      element={<Protected><Layout><Doctors /></Layout></Protected>} />
        <Route path="/appointments" element={<Protected><Layout><Appointments /></Layout></Protected>} />
        <Route path="/treatments"   element={<Protected><Layout><Treatments /></Layout></Protected>} />
        <Route path="/departments"  element={<Protected><Layout><Departments /></Layout></Protected>} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
