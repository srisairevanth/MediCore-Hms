import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api, saveAuth } from '../lib/api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'STAFF' })
  const [loading, setLoading] = useState(false)

  const handle = async e => {
    e.preventDefault(); setLoading(true)
    try {
      const { data } = await api.post('/api/auth/register', form)
      saveAuth(data.token, { name: data.name, email: data.email, role: data.role })
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">
          <div className="auth-logo-icon">🏥</div>
          <div className="auth-logo-name">MediCore HMS</div>
        </div>
        <div className="auth-title">Create account</div>
        <div className="auth-sub">Register for system access</div>
        <form onSubmit={handle} className="form-grid">
          {[
            { key:'name',     label:'Full Name', type:'text',     placeholder:'Dr. John Smith' },
            { key:'email',    label:'Email',     type:'email',    placeholder:'john@hospital.com' },
            { key:'password', label:'Password',  type:'password', placeholder:'••••••••' },
          ].map(({ key, label, type, placeholder }) => (
            <div className="form-group" key={key}>
              <label>{label}</label>
              <input type={type} placeholder={placeholder} required
                value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}/>
            </div>
          ))}
          <div className="form-group">
            <label>Role</label>
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              {['ADMIN','DOCTOR','STAFF','PATIENT'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-teal w-full" disabled={loading}
            style={{ justifyContent:'center', padding:'12px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-link">Already registered? <Link to="/login">Sign in</Link></div>
      </div>
    </div>
  )
}
