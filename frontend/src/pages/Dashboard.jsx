import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Users, UserCheck, Calendar, Building2, Activity, Clock } from 'lucide-react'

const STAT_CARDS = s => [
  { label:'Total Patients',    value: s.totalPatients,     Icon: Users,      bg:'#f0fdfa', color:'#0d9488' },
  { label:'Total Doctors',     value: s.totalDoctors,      Icon: UserCheck,  bg:'#f0fdf4', color:'#22c55e' },
  { label:'Appointments',      value: s.totalAppointments, Icon: Calendar,   bg:'#eff6ff', color:'#3b82f6' },
  { label:'Departments',       value: s.totalDepartments,  Icon: Building2,  bg:'#fff7ed', color:'#f59e0b' },
  { label:'Available Doctors', value: s.availableDoctors,  Icon: Activity,   bg:'#f0fdf4', color:'#22c55e' },
  { label:'Pending Appts',     value: s.pendingAppts,      Icon: Clock,      bg:'#fef3c7', color:'#d97706' },
]

const PIE_COLORS = ['#f59e0b','#3b82f6','#22c55e','#ef4444','#8b5cf6']

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/dashboard/stats')
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const pieData = stats ? [
    { name:'Pending',    value: Number(stats.pendingAppts)   || 0 },
    { name:'Confirmed',  value: Number(stats.confirmedAppts) || 0 },
    { name:'Completed',  value: Number(stats.completedAppts) || 0 },
  ] : []

  const barData = stats ? [
    { name:'Patients',    count: Number(stats.totalPatients)     || 0 },
    { name:'Doctors',     count: Number(stats.totalDoctors)      || 0 },
    { name:'Appts',       count: Number(stats.totalAppointments) || 0 },
    { name:'Departments', count: Number(stats.totalDepartments)  || 0 },
  ] : []

  if (loading) return <div style={{ padding:40, color:'#64748b' }}>Loading...</div>

  return (
    <>
      <div className="page-hdr">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Hospital overview at a glance</div>
        </div>
      </div>

      <div className="stats-grid">
        {STAT_CARDS(stats || {}).map(({ label, value, Icon, bg, color }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon" style={{ background: bg }}>
              <Icon size={24} color={color}/>
            </div>
            <div>
              <div className="stat-num">{value ?? 0}</div>
              <div className="stat-lbl">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:600, marginBottom:16 }}>Overview</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="#94a3b8"/>
              <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#94a3b8"/>
              <Tooltip contentStyle={{ borderRadius:10, border:'1px solid #e2e8f0', fontSize:13 }}/>
              <Bar dataKey="count" fill="#0d9488" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:600, marginBottom:16 }}>Appointment Status</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]}/>)}
              </Pie>
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize:13 }}/>
              <Tooltip contentStyle={{ borderRadius:10, border:'1px solid #e2e8f0', fontSize:13 }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {stats?.recentAppointments?.length > 0 && (
        <div className="table-wrap mt-6">
          <div style={{ padding:'16px 20px', fontFamily:'Outfit,sans-serif', fontWeight:600, borderBottom:'1px solid #f1f5f9' }}>
            Recent Appointments
          </div>
          <table>
            <thead><tr><th>Patient</th><th>Doctor</th><th>Date & Time</th><th>Status</th></tr></thead>
            <tbody>
              {stats.recentAppointments.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight:500 }}>{a.patient?.name || '—'}</td>
                  <td className="text-muted">{a.doctor?.name || '—'}</td>
                  <td className="mono text-sm">{a.appointmentTime ? new Date(a.appointmentTime).toLocaleString() : '—'}</td>
                  <td><span className={`badge badge-${a.status?.toLowerCase()}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
