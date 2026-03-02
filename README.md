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

## Features
- **Dynamic Content:** Destinations and regions are fetched from the API.
- **Authentication:** Register and Login with JWT security.
- **Reviews:** Users can leave ratings and ulasan on specific destinations.
- **Search:** Search destinations by type and province.
