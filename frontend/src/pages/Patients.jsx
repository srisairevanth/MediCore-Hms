import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import toast from 'react-hot-toast'
import { Plus, Search, X, Edit2, Trash2, User } from 'lucide-react'

const EMPTY = { name:'', age:'', gender:'Male', phone:'', address:'', medicalHistory:'' }

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const load = async () => {
    try {
      const { data } = await api.get(`/api/patients${search ? `?search=${search}` : ''}`)
      setPatients(data)
    } catch { toast.error('Failed to load patients') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [search])

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = p  => { setEditing(p); setForm({ name:p.name, age:p.age, gender:p.gender, phone:p.phone||'', address:p.address||'', medicalHistory:p.medicalHistory||'' }); setModal(true) }
  const close    = () => { setModal(false); setEditing(null) }

  const submit = async e => {
    e.preventDefault()
    try {
      editing ? await api.put(`/api/patients/${editing.id}`, form) : await api.post('/api/patients', form)
      toast.success(editing ? 'Patient updated' : 'Patient added')
      close(); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  const remove = async id => {
    if (!confirm('Delete this patient?')) return
    try { await api.delete(`/api/patients/${id}`); toast.success('Deleted'); load() }
    catch { toast.error('Failed to delete') }
  }

  return (
    <>
      <div className="page-hdr">
        <div><div className="page-title">Patients</div><div className="page-sub">{patients.length} records</div></div>
        <button className="btn btn-teal" onClick={openAdd}><Plus size={16}/>Add Patient</button>
      </div>

      <div className="search-wrap">
        <div style={{ position:'relative', flex:1 }}>
          <Search size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }}/>
          <input style={{ paddingLeft:36 }} placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        {search && <button className="btn btn-outline" onClick={() => setSearch('')}>Clear</button>}
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Name</th><th>Age</th><th>Gender</th><th>Phone</th><th>Actions</th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign:'center', color:'#94a3b8', padding:40 }}>Loading...</td></tr>
            ) : patients.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign:'center', color:'#94a3b8', padding:40 }}>No patients found</td></tr>
            ) : patients.map((p, i) => (
              <tr key={p.id}>
                <td className="text-muted text-sm">{i+1}</td>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:32, height:32, background:'#f0fdfa', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <User size={15} color="#0d9488"/>
                    </div>
                    <span style={{ fontWeight:500 }}>{p.name}</span>
                  </div>
                </td>
                <td className="text-muted">{p.age}</td>
                <td className="text-muted">{p.gender}</td>
                <td className="mono text-sm">{p.phone || '—'}</td>
                <td>
                  <div style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-outline btn-xs" onClick={() => openEdit(p)}><Edit2 size={12}/>Edit</button>
                    <button className="btn btn-danger  btn-xs" onClick={() => remove(p.id)}><Trash2 size={12}/>Delete</button>
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
              <div className="modal-title">{editing ? 'Edit Patient' : 'Add Patient'}</div>
              <button onClick={close} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8' }}><X size={20}/></button>
            </div>
            <form onSubmit={submit} className="form-grid">
              <div className="form-group"><label>Full Name *</label><input placeholder="John Doe" required value={form.name} onChange={e => setForm({...form, name:e.target.value})}/></div>
              <div className="form-row">
                <div className="form-group"><label>Age *</label><input type="number" placeholder="25" required min="0" max="150" value={form.age} onChange={e => setForm({...form, age:e.target.value})}/></div>
                <div className="form-group"><label>Gender *</label>
                  <select value={form.gender} onChange={e => setForm({...form, gender:e.target.value})}>
                    {['Male','Female','Other'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Phone</label><input placeholder="+91 9876543210" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})}/></div>
              <div className="form-group"><label>Address</label><input placeholder="City, State" value={form.address} onChange={e => setForm({...form, address:e.target.value})}/></div>
              <div className="form-group"><label>Medical History</label><textarea rows={3} placeholder="Known conditions..." value={form.medicalHistory} onChange={e => setForm({...form, medicalHistory:e.target.value})}/></div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-teal">{editing ? 'Update' : 'Add Patient'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
