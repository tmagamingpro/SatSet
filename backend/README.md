# SatSet Backend (ElysiaJS)

## Jalankan backend

```bash
cd backend
npm install
npm run dev
```

Untuk setup `.env` di PowerShell:

```powershell
Copy-Item .env.example .env
```

Nilai `HOST`, `PORT`, dan `CORS_ORIGINS` diatur lewat file `.env`.
Untuk mode Supabase, isi juga:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Lalu jalankan SQL di [supabase/app_state.sql](/c:/Users/User/Documents/TEGAR/TEGAR/website-pertama/vscode/reactjs/SatSet/backend/supabase/app_state.sql).
SQL tersebut membuat tabel `app_state` sekaligus mengisi seluruh data awal aplikasi.

## Opsi Bun (opsional)

Jika Bun sudah terpasang:

```bash
bun install
bun run src/server.js
```

## Endpoint utama

- `GET /health`
- `GET /bootstrap` (users, orders, categories, statusColors, demoAccounts, reports, serviceAreas, notifications, chats)
- `POST /auth/login`
- `POST /users/register`
- `PATCH /users/:id`
- `DELETE /users/:id`
- `POST /orders`
- `PATCH /orders/:id`
- `POST /chats` (hanya transaksi aktif)
- `POST /notifications`
- `PATCH /notifications/read/:userId`
- `POST /reports`
- `PATCH /reports/:id`
