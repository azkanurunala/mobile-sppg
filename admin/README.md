# SPPG Admin Dashboard & Mobile API

Next.js (App Router) project serving as the dashboard and API backend for the SPPG system.

## 🚀 Getting Started

### 1. Install Dependencies
Ensure you have installed the packages (including Prisma 5.x):
```bash
npm install
```

### 2. Database Sync
Push your schema to the Neon database:
```bash
npm run db:push
```
*Note: Do not use `npx prisma db push` directly to avoid version mismatches. Use the npm script.*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000/admin](http://localhost:3000/admin) to view the dashboard.

## 📡 API Endpoints (For Mobile)

- `POST /api/mobile/auth/login`: Authenticate user.
- `GET /api/mobile/sppg`: Get list of SPPGs.

## 🛠 Management Tools

- **Database Studio**: View data in browser
  ```bash
  npm run db:studio
  ```
- **Seeding Data**: Populate initial master data
  ```bash
  npx tsx prisma/seed.ts
  ```
