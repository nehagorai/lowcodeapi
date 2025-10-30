# 🚀 LowCodeAPI — Local Setup Guide

How to Run LowCodeAPI on Your Local Machine

---

## 🧩 Prerequisites

Make sure you have:

- Node.js **18+**
- **npm** or **yarn**
- **Docker** & **Docker Compose**
- **MySQL client** (`mysql` CLI)

---

## ⚙️ Quick Start

### 1️⃣ Clone the repository
```bash
git clone https://github.com/samal/lowcodeapi.git
cd lowcodeapi
```

### 2️⃣ Start MySQL + Redis with Docker
```bash
cd docker
docker compose -f docker-compose.dev.yml up
# (Wait until MySQL is ready)
```

### 3️⃣ Install dependencies
```bash
cd ../server && npm install
cd ../ui && yarn  # or npm install
```

### 4️⃣ Import the seed database
```bash
# From server/sql folder
mysql -h 127.0.0.1 -P 3306 -u lowcodeapi -p lowcodeapi < seed-tables.sql
```

### 5️⃣ Create .env files (server & UI)


```bash
# Run inside both folders
npm run env

# OR manually copy:
# cp .env.example .env
# inside .env DB_HOST=127.0.0.1
```

### 6️⃣ Run both server & UI together
```bash
# Start the server
cd server
npm run dev

# In a new terminal, start the UI
cd ui
npm run dev
```

Now open your browser:

- **App UI →** [http://localhost:3000](http://localhost:3000)  
- **Login Page →** [http://localhost:3000/login](http://localhost:3000/login)

---

## 👤 Create a Login User
```bash
cd server
EMAIL=you@example.com PASSWORD=your_password npm run create
```
Refresh the server folder (npm run dev).
Then log in using your new credentials.

---

## ✅ Done!

You now have **LowCodeAPI** running locally.  
If any step fails, ensure Docker containers are up and `.env` files are correct.
