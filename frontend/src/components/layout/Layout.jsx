import { NavLink, useNavigate } from 'react-router-dom'
import { clearAuth, getUser } from '../../lib/api'
import { LayoutDashboard, Users, UserCheck, Calendar, Stethoscope, Building2, LogOut } from 'lucide-react'

const NAV = [
  { to: '/dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { to: '/patients',     label: 'Patients',     Icon: Users },
  { to: '/doctors',      label: 'Doctors',      Icon: UserCheck },
  { to: '/appointments', label: 'Appointments', Icon: Calendar },
  { to: '/treatments',   label: 'Treatments',   Icon: Stethoscope },
  { to: '/departments',  label: 'Departments',  Icon: Building2 },
]

export default function Layout({ children }) {
  const navigate = useNavigate()
  const user = getUser()

  const logout = () => { clearAuth(); navigate('/') }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sb-logo">
          <div className="sb-logo-icon">🏥</div>
          <div>
            <div className="sb-logo-name">MediCore</div>
            <div className="sb-logo-ver">HMS v3.0</div>
          </div>
        </div>
        <nav className="sb-nav">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `sb-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="sb-footer">
          <div className="sb-user">
            <div className="sb-user-name">{user?.name || 'User'}</div>
            <div className="sb-user-role">{user?.role || 'STAFF'}</div>
          </div>
          <button className="sb-logout" onClick={logout}>
            <LogOut size={14} style={{ display:'inline', marginRight:6 }} />Logout
          </button>
        </div>
      </aside>
      <main className="main">
        <div className="page">{children}</div>
      </main>
    </div>
  )
}
