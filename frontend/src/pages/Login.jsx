import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api, saveAuth } from '../lib/api'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handle = async e => {
    e.preventDefault(); setLoading(true)
    try {
      const { data } = await api.post('/api/auth/login', form)
      saveAuth(data.token, { name: data.name, email: data.email, role: data.role })
      toast.success(`Welcome back, ${data.name}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">
          <div className="auth-logo-icon">🏥</div>
          <div className="auth-logo-name">MediCore HMS</div>
        </div>
        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Sign in to access the system</div>
        <form onSubmit={handle} className="form-grid">
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="admin@hms.com" required
              value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required
              value={form.password} onChange={e => setForm({...form, password: e.target.value})}/>
          </div>
          <button type="submit" className="btn btn-teal w-full" disabled={loading}
            style={{ justifyContent:'center', padding:'12px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="demo-hint">
          Demo: <strong>admin@hms.com</strong> / <strong>admin123</strong>
        </div>
        <div className="auth-link">No account? <Link to="/register">Register here</Link></div>
      </div>
    </div>
  )
}
