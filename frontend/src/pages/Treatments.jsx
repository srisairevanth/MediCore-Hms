import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import toast from 'react-hot-toast'
import { Plus, X, Trash2 } from 'lucide-react'

export default function Treatments() {
  const [treatments, setTreatments] = useState([])
  const [patients, setPatients]     = useState([])
  const [doctors, setDoctors]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [modal, setModal]           = useState(false)
  const [form, setForm]             = useState({ patientId:'', doctorId:'', diagnosis:'', prescription:'', treatmentDate: new Date().toISOString().split('T')[0] })

  const load = async () => {
    try {
      const [t, p, d] = await Promise.all([api.get('/api/treatments'), api.get('/api/patients'), api.get('/api/doctors')])
      setTreatments(t.data); setPatients(p.data); setDoctors(d.data)
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const submit = async e => {
    e.preventDefault()
    try {
      await api.post('/api/treatments', form)
      toast.success('Treatment recorded!')
      setModal(false); load()
    } catch (err) { toast.error(err.response?.data || 'Error') }
  }

  const remove = async id => {
    if (!confirm('Delete this record?')) return
    try { await api.delete(`/api/treatments/${id}`); toast.success('Deleted'); load() }
    catch { toast.error('Failed') }
  }

  if (loading) return <div style={{ color:'#94a3b8', padding:40 }}>Loading...</div>

  return (
    <>
      <div className="page-hdr">
        <div><div className="page-title">Treatments</div><div className="page-sub">{treatments.length} records</div></div>
        <button className="btn btn-teal" onClick={() => setModal(true)}><Plus size={16}/>Add Treatment</button>
      </div>

      <div className="cards-grid">
        {treatments.map(t => (
          <div key={t.id} className="card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div>
                <div style={{ fontWeight:600, fontSize:15 }}>{t.patient?.name}</div>
                <div className="text-sm text-muted">by {t.doctor?.name}</div>
              </div>
              <div className="mono text-xs text-muted">{t.treatmentDate}</div>
            </div>
            <div style={{ fontSize:13, marginBottom:8 }}>
              <span className="text-muted">Diagnosis: </span>
              <strong>{t.diagnosis}</strong>
            </div>
            {t.prescription && (
              <div style={{ background:'#f8fafc', borderLeft:'3px solid #0d9488', borderRadius:'0 8px 8px 0', padding:'10px 12px', fontSize:13, color:'#475569', marginBottom:10 }}>
                {t.prescription}
              </div>
            )}
            <div style={{ paddingTop:10, borderTop:'1px solid #f1f5f9' }}>
              <button className="btn btn-danger btn-xs" onClick={() => remove(t.id)}><Trash2 size={12}/>Delete</button>
            </div>
          </div>
        ))}
        {treatments.length === 0 && (
          <div style={{ gridColumn:'1/-1', textAlign:'center', color:'#94a3b8', padding:40 }}>No treatment records yet</div>
        )}
      </div>

      {modal && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-hdr">
              <div className="modal-title">Add Treatment</div>
              <button onClick={() => setModal(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8' }}><X size={20}/></button>
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
              <div className="form-group"><label>Diagnosis *</label>
                <input placeholder="Hypertension, Diabetes..." required value={form.diagnosis} onChange={e => setForm({...form, diagnosis:e.target.value})}/>
              </div>
              <div className="form-group"><label>Prescription</label>
                <textarea rows={3} placeholder="Medication details, dosage..." value={form.prescription} onChange={e => setForm({...form, prescription:e.target.value})}/>
              </div>
              <div className="form-group"><label>Treatment Date</label>
                <input type="date" value={form.treatmentDate} onChange={e => setForm({...form, treatmentDate:e.target.value})}/>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-teal">Save Treatment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
