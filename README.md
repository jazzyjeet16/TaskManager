# TaskManager — Full Stack REST API + React UI

> Backend-focused intern assignment: JWT auth, RBAC, CRUD, Swagger docs, React frontend.

---

## 🗂️ Project Structure

```
project/
├── backend/
│   ├── src/
│   │   ├── config/         # DB pool, Swagger config, schema.sql
│   │   ├── controllers/    # Business logic (auth, tasks, admin)
│   │   ├── middleware/     # JWT auth, role guard, validation runner
│   │   ├── models/         # SQL query functions (User, Task)
│   │   ├── routes/v1/      # Versioned Express routers + Swagger JSDoc
│   │   ├── validators/     # express-validator rule sets
│   │   └── app.js          # Entry point: middleware stack, routes, error handler
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/            # Axios instance with JWT interceptor
    │   ├── components/     # Navbar, ProtectedRoute, TaskModal
    │   ├── context/        # AuthContext (global user state)
    │   ├── pages/          # Login, Register, Dashboard, AdminPanel
    │   └── styles/         # global.css
    └── package.json
```

---

## ⚙️ Setup — Backend



### 1. Configure environment

```bash
cd backend
cp .env
# Edit .env — fill in DB credentials and a strong JWT_SECRET
```

### 2. Install dependencies & run

```bash
npm install
npm run dev       # development (nodemon)
# or
npm start         # production
```

Server starts at: **http://localhost:5000**  
Swagger UI at:    **http://localhost:5000/api-docs**

---

## 🖥️ Setup — Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at: **http://localhost:5173**  
(Vite proxies `/api` → `http://localhost:5000`)

---

## 🔑 API Endpoints (v1)

### Auth  `(no token required)`
| Method | Endpoint                  | Description         |
|--------|---------------------------|---------------------|
| POST   | `/api/v1/auth/register`   | Register new user   |
| POST   | `/api/v1/auth/login`      | Login → get JWT     |
| GET    | `/api/v1/auth/me`         | Get own profile 🔒  |

### Tasks  `(JWT required)`
| Method | Endpoint              | Description                       |
|--------|-----------------------|-----------------------------------|
| GET    | `/api/v1/tasks`       | Get my tasks (paginate + filter)  |
| POST   | `/api/v1/tasks`       | Create a task                     |
| GET    | `/api/v1/tasks/:id`   | Get one task                      |
| PATCH  | `/api/v1/tasks/:id`   | Update title/desc/status          |
| DELETE | `/api/v1/tasks/:id`   | Delete a task                     |

### Admin  `(JWT + role=admin required)`
| Method | Endpoint                  | Description          |
|--------|---------------------------|----------------------|
| GET    | `/api/v1/admin/users`     | List all users       |
| DELETE | `/api/v1/admin/users/:id` | Delete a user        |
| GET    | `/api/v1/admin/tasks`     | List all tasks       |

---

## 🛡️ Security Practices

- **Passwords** hashed with bcryptjs (salt rounds = 12)
- **JWT** signed with HS256; verified on every protected request; token stripped from DB lookup on each call
- **Input sanitization** via express-validator (trim, normalizeEmail, length limits)
- **Helmet** sets 11 secure HTTP headers
- **Rate limiting** — 100 req/15 min globally; 10 req/15 min on `/login` (brute-force protection)
- **Body size limit** — 10 kb max to prevent payload attacks
- **Ownership checks** — users can only read/edit/delete their own tasks
- **Role guard** middleware is a factory (`authorize('admin')`) reusable for any future role

---

## 📈 Scalability Note

| Concern | Approach |
|---|---|
| **Horizontal scaling** | Stateless JWT means any instance can verify tokens — deploy N replicas behind a load balancer (nginx / AWS ALB) with no sticky sessions |
| **Database** | PostgreSQL connection pool (max 20). Add read replicas for read-heavy load. Migrate to PgBouncer for >1000 concurrent connections |
| **Caching** | Add Redis (`ioredis`) to cache `/admin/users` and `/admin/tasks` lists with a short TTL; invalidate on write |
| **API versioning** | Routes live under `/api/v1/` — adding `/api/v2/` is a folder + router import away |
| **Modular structure** | Each entity (tasks, users) has its own controller/model/route/validator — adding a new module (e.g. `projects`) follows the same pattern |
| **Microservices path** | Auth service and Task service can be extracted independently; they share only the DB and JWT secret |
| **Logging** | Replace `console.error` with Winston / Pino for structured JSON logs → pipe to ELK or CloudWatch |
| **Docker** | Each service gets a `Dockerfile`; `docker-compose.yml` wires `api + postgres + redis` |

---

## 🧪 Quick Test (curl)

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com","password":"pass123"}'

# Login → copy the token
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"pass123"}'

# Create task
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","description":"Milk, eggs, bread"}'
```
