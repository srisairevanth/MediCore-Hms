import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import toast from 'react-hot-toast'
import { Plus, X, Edit2, Trash2 } from 'lucide-react'

const EMPTY = { name:'', specialization:'', email:'', phone:'', availabilityStatus:'AVAILABLE', departmentId:'' }
const STATUS_BADGE = { AVAILABLE:'badge-available', BUSY:'badge-busy', OFF_DUTY:'badge-off_duty' }

export default function Doctors() {
  const [doctors, setDoctors]       = useState([])
  const [departments, setDepts]     = useState([])
  const [search, setSearch]         = useState('')
  const [loading, setLoading]       = useState(true)
  const [modal, setModal]           = useState(false)
  const [editing, setEditing]       = useState(null)
  const [form, setForm]             = useState(EMPTY)

  const load = async () => {
    try {
      const [d, dept] = await Promise.all([api.get('/api/doctors'), api.get('/api/departments')])
      setDoctors(d.data); setDepts(dept.data)
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = d  => { setEditing(d); setForm({ name:d.name, specialization:d.specialization, email:d.email||'', phone:d.phone||'', availabilityStatus:d.availabilityStatus, departmentId:d.department?.id||'' }); setModal(true) }
  const close    = () => { setModal(false); setEditing(null) }

  const submit = async e => {
    e.preventDefault()
    try {
      editing ? await api.put(`/api/doctors/${editing.id}`, form) : await api.post('/api/doctors', form)
      toast.success(editing ? 'Doctor updated' : 'Doctor added')
      close(); load()
    } catch { toast.error('Error saving doctor') }
  }

  const remove = async id => {
    if (!confirm('Delete this doctor?')) return
    try { await api.delete(`/api/doctors/${id}`); toast.success('Deleted'); load() }
    catch { toast.error('Failed to delete') }
  }

  return (
    <>
      <div className="page-hdr">
        <div><div className="page-title">Doctors</div><div className="page-sub">{doctors.length} registered</div></div>
        <button className="btn btn-teal" onClick={openAdd}><Plus size={16}/>Add Doctor</button>
      </div>

      <div className="search-wrap">
        <input placeholder="Search by name or specialization..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:380 }}/>
        {search && <button className="btn btn-outline btn-sm" onClick={() => setSearch('')}>Clear</button>}
      </div>

      {loading ? <div style={{ color:'#94a3b8', padding:40 }}>Loading...</div> : (
        <div className="cards-grid">
          {filtered.map(d => (
            <div key={d.id} className="card" style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:44, height:44, background:'#f0fdf4', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🩺</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:15 }}>{d.name}</div>
                    <div className="text-muted text-sm">{d.specialization}</div>
                  </div>
                </div>
                <span className={`badge ${STATUS_BADGE[d.availabilityStatus]}`}>{d.availabilityStatus?.replace('_',' ')}</span>
              </div>
              {d.department && <div className="text-sm text-muted">🏥 {d.department.name}</div>}
              {d.phone && <div className="mono text-sm text-muted">📞 {d.phone}</div>}
              <div style={{ display:'flex', gap:8, paddingTop:8, borderTop:'1px solid #f1f5f9' }}>
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(d)}><Edit2 size={12}/>Edit</button>
                <button className="btn btn-danger  btn-sm" onClick={() => remove(d.id)}><Trash2 size={12}/>Delete</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ gridColumn:'1/-1', textAlign:'center', color:'#94a3b8', padding:40 }}>No doctors found</div>}
        </div>
      )}

      {modal && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && close()}>
          <div className="modal">
            <div className="modal-hdr">
              <div className="modal-title">{editing ? 'Edit Doctor' : 'Add Doctor'}</div>
              <button onClick={close} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8' }}><X size={20}/></button>
            </div>
            <form onSubmit={submit} className="form-grid">
              <div className="form-group"><label>Full Name *</label><input placeholder="Dr. Jane Smith" required value={form.name} onChange={e => setForm({...form, name:e.target.value})}/></div>
              <div className="form-group"><label>Specialization *</label><input placeholder="Cardiology" required value={form.specialization} onChange={e => setForm({...form, specialization:e.target.value})}/></div>
              <div className="form-row">
                <div className="form-group"><label>Email</label><input type="email" placeholder="jane@hms.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})}/></div>
                <div className="form-group"><label>Phone</label><input placeholder="+91 9876543210" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})}/></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Availability</label>
                  <select value={form.availabilityStatus} onChange={e => setForm({...form, availabilityStatus:e.target.value})}>
                    {['AVAILABLE','BUSY','OFF_DUTY'].map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Department</label>
                  <select value={form.departmentId} onChange={e => setForm({...form, departmentId:e.target.value})}>
                    <option value="">— None —</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-teal">{editing ? 'Update' : 'Add Doctor'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
