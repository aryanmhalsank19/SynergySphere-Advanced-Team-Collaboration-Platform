***🌐 SynergySphere – Team Collaboration MVP***

SynergySphere is a lightweight, intelligent team collaboration platform built for hackathons and fast-moving teams. It helps organize projects, assign and track tasks, communicate in project-specific threads, and surface risks like workload overload and deadline surprises.

✨ Features

🔐 User Auth (Register/Login with JWT)

📂 Projects (create, list, view, archive)

👥 Project Members (roles: admin/member/viewer)

✅ Tasks (CRUD, Kanban board, drag & drop)

💬 Comments (threaded discussions per project/task)

🔔 Notifications (task assigned, comment added, deadlines)

📊 Insights (charts for workload & deadlines using Recharts)

📱 Responsive UI (mobile + desktop friendly)

🏠 Landing Page (marketing-style with CTA)

🛠️ Tech Stack

Backend: Django 5 + Django REST Framework + Simple JWT
Frontend: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui + Recharts
DB: SQLite (dev), MySQL/Postgres (prod)

⚡ Quickstart
Backend
cd synergy-backend
python manage.py migrate
python manage.py runserver 0.0.0.0:8000

Frontend
cd synergy-frontend
npm install
npm run dev


Frontend will run at http://localhost:3000
Backend API at http://localhost:8000/api/

🚀 Demo

👉 Live Demo Link : https://spark-synergy-pro.vercel.app/
 
