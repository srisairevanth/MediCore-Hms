import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import toast from 'react-hot-toast'
import { Plus, X, Edit2, Trash2 } from 'lucide-react'

const EMPTY = { name:'', floor:'', totalBeds:'', occupiedBeds:'' }
const COLORS = ['#0d9488','#22c55e','#3b82f6','#f59e0b','#ef4444','#8b5cf6']

export default function Departments() {
  const [departments, setDepts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY)

  const load = async () => {
    try { const { data } = await api.get('/api/departments'); setDepts(data) }
    catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = d  => { setEditing(d); setForm({ name:d.name, floor:d.floor||'', totalBeds:d.totalBeds||'', occupiedBeds:d.occupiedBeds||'' }); setModal(true) }
  const close    = () => { setModal(false); setEditing(null) }

  const submit = async e => {
    e.preventDefault()
    try {
      const payload = { ...form, totalBeds: parseInt(form.totalBeds)||0, occupiedBeds: parseInt(form.occupiedBeds)||0 }
      editing ? await api.put(`/api/departments/${editing.id}`, payload) : await api.post('/api/departments', payload)
      toast.success(editing ? 'Department updated' : 'Department added')
      close(); load()
    } catch { toast.error('Error saving department') }
  }

  const remove = async id => {
    if (!confirm('Delete this department?')) return
    try { await api.delete(`/api/departments/${id}`); toast.success('Deleted'); load() }
    catch { toast.error('Failed to delete') }
  }

  if (loading) return <div style={{ color:'#94a3b8', padding:40 }}>Loading...</div>

  return (
    <>
      <div className="page-hdr">
        <div><div className="page-title">Departments</div><div className="page-sub">{departments.length} departments</div></div>
        <button className="btn btn-teal" onClick={openAdd}><Plus size={16}/>Add Department</button>
      </div>

      <div className="cards-grid">
        {departments.map((d, i) => {
          const color = COLORS[i % COLORS.length]
          const pct = d.totalBeds > 0 ? Math.round((d.occupiedBeds / d.totalBeds) * 100) : 0
          return (
            <div key={d.id} className="card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div style={{ width:44, height:44, background:`${color}18`, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🏥</div>
                <div style={{ display:'flex', gap:6 }}>
                  <button className="btn btn-outline btn-xs" onClick={() => openEdit(d)}><Edit2 size={12}/></button>
                  <button className="btn btn-danger  btn-xs" onClick={() => remove(d.id)}><Trash2 size={12}/></button>
                </div>
              </div>
              <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:17, marginBottom:4 }}>{d.name}</div>
              {d.floor && <div className="text-sm text-muted" style={{ marginBottom:12 }}>Floor: {d.floor}</div>}
              {d.totalBeds > 0 && (
                <>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#94a3b8', marginBottom:6 }}>
                    <span>Bed Occupancy</span>
                    <span style={{ color, fontWeight:600 }}>{d.occupiedBeds}/{d.totalBeds}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width:`${pct}%`, background:color }}/>
                  </div>
                </>
              )}
            </div>
          )
        })}
        {departments.length === 0 && (
          <div style={{ gridColumn:'1/-1', textAlign:'center', color:'#94a3b8', padding:40 }}>No departments found</div>
        )}
      </div>

      {modal && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && close()}>
          <div className="modal" style={{ maxWidth:420 }}>
            <div className="modal-hdr">
              <div className="modal-title">{editing ? 'Edit Department' : 'Add Department'}</div>
              <button onClick={close} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8' }}><X size={20}/></button>
            </div>
            <form onSubmit={submit} className="form-grid">
              <div className="form-group"><label>Department Name *</label><input placeholder="Cardiology" required value={form.name} onChange={e => setForm({...form, name:e.target.value})}/></div>
              <div className="form-group"><label>Floor</label><input placeholder="3rd Floor" value={form.floor} onChange={e => setForm({...form, floor:e.target.value})}/></div>
              <div className="form-row">
                <div className="form-group"><label>Total Beds</label><input type="number" min="0" placeholder="50" value={form.totalBeds} onChange={e => setForm({...form, totalBeds:e.target.value})}/></div>
                <div className="form-group"><label>Occupied Beds</label><input type="number" min="0" placeholder="0" value={form.occupiedBeds} onChange={e => setForm({...form, occupiedBeds:e.target.value})}/></div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-teal">{editing ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
