# 🏥 MediCore HMS v3 — Spring Boot + Vite React

Full-stack Hospital Management System with separate backend (Railway) and frontend (Vercel).

---

## 📁 Structure
```
hms-v3/
├── backend/   → Spring Boot REST API  → Deploy on Railway
└── frontend/  → Vite + React SPA      → Deploy on Vercel
```

---

## 🚀 Local Development

### Backend
```cmd
cd backend
# Edit src/main/resources/application.properties with your Neon DB details
mvn spring-boot:run
```
API runs at: http://localhost:8080

### Frontend
```cmd
cd frontend
npm install
npm run dev
```
App runs at: http://localhost:5173

> The Vite proxy forwards `/api` calls to `localhost:8080` automatically.

---

## ☁️ Deploy Backend to Railway

1. Push `backend/` folder to a GitHub repo
2. Go to **railway.app** → New Project → Deploy from GitHub
3. Add environment variables in Railway dashboard:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `jdbc:postgresql://your-neon-host/neondb?sslmode=require` |
| `DB_USERNAME` | `neondb_owner` |
| `DB_PASSWORD` | your Neon password |
| `JWT_SECRET` | any long random string |
| `CORS_ORIGINS` | `https://your-app.vercel.app` |

4. Railway auto-detects Spring Boot and deploys
5. Note your Railway URL: `https://xxx.up.railway.app`

---

## ☁️ Deploy Frontend to Vercel

1. Push `frontend/` folder to a GitHub repo (can be same repo, different folder)
2. Go to **vercel.com** → New Project → Import repo
3. Set **Root Directory** to `frontend`
4. Add environment variable in Vercel dashboard:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://xxx.up.railway.app` |

5. Deploy → get your Vercel URL

6. Go back to Railway → update `CORS_ORIGINS` with your Vercel URL → Redeploy

---

## 🔐 API Endpoints

All endpoints except `/api/auth/**` require: `Authorization: Bearer <token>`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login, get JWT token |
| GET | `/api/dashboard/stats` | Dashboard stats |
| GET/POST | `/api/patients` | List/create patients |
| GET/PUT/DELETE | `/api/patients/{id}` | Get/update/delete patient |
| GET/POST | `/api/doctors` | List/create doctors |
| GET/PUT/DELETE | `/api/doctors/{id}` | Get/update/delete doctor |
| GET/POST | `/api/appointments` | List/create appointments |
| GET/PUT/DELETE | `/api/appointments/{id}` | Get/update/delete appointment |
| GET/POST | `/api/treatments` | List/create treatments |
| DELETE | `/api/treatments/{id}` | Delete treatment |
| GET/POST | `/api/departments` | List/create departments |
| PUT/DELETE | `/api/departments/{id}` | Update/delete department |

---

## 🛠 Tech Stack

**Backend**
- Spring Boot 3.2.5 + Java 21
- Spring Security + JWT (JJWT 0.12.5)
- Spring Data JPA + Hibernate
- PostgreSQL on Neon
- Lombok + Maven

**Frontend**
- Vite + React 18
- React Router v6
- Axios (HTTP client)
- Recharts (charts)
- Lucide React (icons)
- React Hot Toast

**Deploy**
- Backend → Railway
- Frontend → Vercel
- Database → Neon (free PostgreSQL)

---

## 🔑 Demo Login
```
Email:    admin@hms.com
Password: admin123
```
