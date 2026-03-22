import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || ''

export const api = axios.create({ baseURL: BASE })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('hms_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('hms_token')
      localStorage.removeItem('hms_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const saveAuth = (token, user) => {
  localStorage.setItem('hms_token', token)
  localStorage.setItem('hms_user', JSON.stringify(user))
}

export const getUser  = () => { try { return JSON.parse(localStorage.getItem('hms_user')) } catch { return null } }
export const getToken = () => localStorage.getItem('hms_token')
export const isLoggedIn = () => !!getToken()
export const clearAuth  = () => { localStorage.removeItem('hms_token'); localStorage.removeItem('hms_user') }
