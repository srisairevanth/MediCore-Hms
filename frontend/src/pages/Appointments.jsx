import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import toast from 'react-hot-toast'
import { Plus, X } from 'lucide-react'

const EMPTY = { patientId:'', doctorId:'', appointmentTime:'', notes:'', status:'PENDING' }
const STATUSES = ['PENDING','CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED']
const BADGE = { PENDING:'badge-pending', CONFIRMED:'badge-confirmed', IN_PROGRESS:'badge-in_progress', COMPLETED:'badge-completed', CANCELLED:'badge-cancelled' }

export default function Appointments() {
  const [appointments, setAppts]  = useState([])
  const [patients, setPatients]   = useState([])
  const [doctors, setDoctors]     = useState([])
  const [filter, setFilter]       = useState('')
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY)

  const load = async () => {
    try {
      const [a, p, d] = await Promise.all([
        api.get(`/api/appointments${filter ? `?status=${filter}` : ''}`),
        api.get('/api/patients'), api.get('/api/doctors')
      ])
      setAppts(a.data); setPatients(p.data); setDoctors(d.data)
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [filter])

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = a  => {
    setEditing(a)
    setForm({ patientId: a.patient?.id||'', doctorId: a.doctor?.id||'', appointmentTime: a.appointmentTime?.slice(0,16)||'', notes: a.notes||'', status: a.status })
    setModal(true)
  }
  const close = () => { setModal(false); setEditing(null) }

  const submit = async e => {
    e.preventDefault()
    try {
      const payload = { ...form, appointmentTime: form.appointmentTime + ':00' }
      editing ? await api.put(`/api/appointments/${editing.id}`, payload) : await api.post('/api/appointments', payload)
      toast.success(editing ? 'Appointment updated' : 'Appointment booked!')
      close(); load()
    } catch (err) { toast.error(err.response?.data || 'Error') }
  }

  const remove = async id => {
    if (!confirm('Delete this appointment?')) return
    try { await api.delete(`/api/appointments/${id}`); toast.success('Deleted'); load() }
    catch { toast.error('Failed to delete') }
  }

  return (
    <>
      <div className="page-hdr">
        <div><div className="page-title">Appointments</div><div className="page-sub">{appointments.length} total</div></div>
        <button className="btn btn-teal" onClick={openAdd}><Plus size={16}/>Book Appointment</button>
      </div>

      <div className="filter-bar">
        <button className={`filter-btn ${filter===''?'active':''}`} onClick={() => setFilter('')}>All</button>
        {STATUSES.map(s => (
          <button key={s} className={`filter-btn ${filter===s?'active':''}`} onClick={() => setFilter(s)}>
            {s.replace('_',' ')}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Patient</th><th>Doctor</th><th>Date & Time</th><th>Status</th><th>Notes</th><th>Actions</th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign:'center', color:'#94a3b8', padding:40 }}>Loading...</td></tr>
            ) : appointments.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign:'center', color:'#94a3b8', padding:40 }}>No appointments found</td></tr>
            ) : appointments.map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight:500 }}>{a.patient?.name || '—'}</td>
                <td>
                  <div>{a.doctor?.name || '—'}</div>
                  <div className="text-xs text-muted">{a.doctor?.specialization}</div>
                </td>
                <td className="mono text-sm">{a.appointmentTime ? new Date(a.appointmentTime).toLocaleString() : '—'}</td>
                <td><span className={`badge ${BADGE[a.status]||''}`}>{a.status}</span></td>
                <td className="text-muted text-sm">{a.notes || '—'}</td>
                <td>
                  <div style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-outline btn-xs" onClick={() => openEdit(a)}>Edit</button>
                    <button className="btn btn-danger  btn-xs" onClick={() => remove(a.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && close()}>
          <div className="modal">
            <div className="modal-hdr">
              <div className="modal-title">{editing ? 'Edit Appointment' : 'Book Appointment'}</div>
              <button onClick={close} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8' }}><X size={20}/></button>
            </div>
            <form onSubmit={submit} className="form-grid">
              <div className="form-group"><label>Patient *</label>
                <select required value={form.patientId} onChange={e => setForm({...form, patientId:e.target.value})}>
                  <option value="">— Select Patient —</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Doctor *</label>
                <select required value={form.doctorId} onChange={e => setForm({...form, doctorId:e.target.value})}>
                  <option value="">— Select Doctor —</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Date & Time *</label>
                <input type="datetime-local" required value={form.appointmentTime} onChange={e => setForm({...form, appointmentTime:e.target.value})}/>
              </div>
              {editing && (
                <div className="form-group"><label>Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status:e.target.value})}>
                    {STATUSES.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
                  </select>
                </div>
              )}
              <div className="form-group"><label>Notes</label>
                <textarea rows={3} placeholder="Reason for visit..." value={form.notes} onChange={e => setForm({...form, notes:e.target.value})}/>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-teal">{editing ? 'Update' : 'Book'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
