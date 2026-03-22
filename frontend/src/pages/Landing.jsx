import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '👥', bg: '#f0fdfa', title: 'Patient Management', desc: 'Register and manage patient records with full medical history, contact details and search.' },
  { icon: '🩺', bg: '#f0fdf4', title: 'Doctor Directory',   desc: 'Track doctors by specialization, department, and availability status in real time.' },
  { icon: '📅', bg: '#eff6ff', title: 'Appointments',       desc: 'Book and manage appointments with status tracking — Pending, Confirmed, Completed.' },
  { icon: '💊', bg: '#fdf4ff', title: 'Treatments',         desc: 'Record diagnoses, prescriptions, and treatment history for every patient.' },
  { icon: '🏥', bg: '#fff7ed', title: 'Departments',        desc: 'Manage hospital departments with floor info and live bed occupancy tracking.' },
  { icon: '🔐', bg: '#fef2f2', title: 'Secure Auth',        desc: 'JWT-based authentication with BCrypt password hashing and role-based access.' },
]

export default function Landing() {
  return (
    <div className="landing">
      {/* Nav */}
      <nav className="landing-nav">
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:34, height:34, background:'#0d9488', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🏥</div>
          <span style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:18 }}>MediCore HMS</span>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <Link to="/login"    className="btn btn-outline">Sign In</Link>
          <Link to="/register" className="btn btn-teal">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="landing-hero">
        <div className="hero-badge">🟢 Live on Railway + Vercel</div>
        <h1 className="hero-h1">Modern <span>Hospital</span><br/>Management System</h1>
        <p className="hero-p">A complete full-stack solution — Spring Boot REST API with React frontend, deployed on Railway and Vercel.</p>
        <div className="hero-btns">
          <Link to="/login"    className="btn btn-teal"    style={{ padding:'13px 28px', fontSize:16 }}>Enter Dashboard →</Link>
          <Link to="/register" className="btn btn-outline" style={{ padding:'13px 28px', fontSize:16 }}>Create Account</Link>
        </div>
        <div style={{ marginTop:20, fontSize:13, color:'#64748b', fontFamily:'JetBrains Mono,monospace' }}>
          Demo: admin@hms.com / admin123
        </div>
      </div>

      {/* Features */}
      <div className="features">
        {FEATURES.map(f => (
          <div key={f.title} className="feat-card">
            <div className="feat-icon" style={{ background: f.bg }}>{f.icon}</div>
            <div className="feat-title">{f.title}</div>
            <div className="feat-desc">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Tech stack */}
      <div style={{ padding:'0 60px 60px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:24, marginBottom:20 }}>Tech Stack</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
          {['Spring Boot 3.2','Java 21','JWT Auth','Spring Security','PostgreSQL (Neon)','Hibernate JPA','Vite + React 18','React Router','Axios','Recharts','Railway','Vercel'].map(t => (
            <span key={t} style={{ padding:'6px 14px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:13, fontFamily:'JetBrains Mono,monospace', color:'#64748b' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="landing-cta">
        <h2>Ready to get started?</h2>
        <p>Login with demo credentials or create your own account.</p>
        <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
          <Link to="/login"    className="btn" style={{ background:'white', color:'#0f766e', padding:'13px 28px', fontSize:16 }}>Sign In →</Link>
          <Link to="/register" className="btn" style={{ background:'rgba(255,255,255,0.15)', color:'white', border:'1px solid rgba(255,255,255,0.3)', padding:'13px 28px', fontSize:16 }}>Register</Link>
        </div>
      </div>

      {/* Footer */}
      <div className="landing-footer">
        <span>MediCore HMS — Spring Boot + Vite React © 2026</span>
        <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:12 }}>Railway + Vercel + Neon</span>
      </div>
    </div>
  )
}
