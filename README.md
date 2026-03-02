# Whytrip Full-stack Application

A tourism information platform for Indonesia built with a dynamic Node.js backend and a PostgreSQL database.

## Project Structure

```text
why-trip/
├── frontend/             # Client-side HTML, CSS, and interactive JS
│   ├── assets/           # Images, styles, and script files
│   ├── index.html        # Main landing page
│   └── ...               # Other tourism pages
├── backend/              # Node.js Express server
│   ├── src/
│   │   ├── config/       # Database connection
│   │   ├── controllers/  # Route logic
│   │   ├── middleware/   # Auth and security
│   │   ├── routes/       # API endpoints
│   │   └── index.js      # Server entry point
│   └── .env              # Environment variables
└── .gitignore            # Git configuration
```

## Setup Instructions

### 1. Database & Environment Variables
1. Ensure you have a PostgreSQL database running.
2. Create a `.env` file inside the `backend/` folder. You can use `backend/.env.example` as a template:
   ```bash
   cp backend/.env.example backend/.env
   ```
3. Update the variables in `.env`:
   - `PORT`: Server port (default: 5001)
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A secure string for JWT authentication

### 2. Backend
```bash
cd backend
npm install
npm run dev
```
The server will run on `http://localhost:5001`.

### 3. Frontend
Open `frontend/index.html` in your browser (Live Server recommended).

## Deployment

Proyek ini dirancang untuk dideploy menggunakan model **Hybrid**:
- **Frontend**: [Vercel](https://vercel.com/) (Gratis, Cepat, Optimized for static assets).
- **Backend**: [Railway](https://railway.app/) (Terintegrasi dengan PostgreSQL, Handal untuk Node.js).

### Ringkasan Langkah Deploy:
1.  **Backend**: Deploy folder `backend` ke Railway, set variabel `.env` di dashboard Railway.
2.  **Konfigurasi**: Update `API_BASE_URL` di `frontend/assets/script/main.js` dengan URL dari Railway.
3.  **Frontend**: Deploy folder `frontend` ke Vercel.

Untuk panduan detail, lihat [deployment_guide.md](file:///Users/kouseina/.gemini/antigravity/brain/6f31c832-54e1-42ae-a43d-34f819e4ca10/deployment_guide.md).

## Features
- **Dynamic Content:** Destinations and regions are fetched from the API.
- **Authentication:** Register and Login with JWT security.
- **Reviews:** Users can leave ratings and ulasan on specific destinations.
- **Search:** Search destinations by type and province.
