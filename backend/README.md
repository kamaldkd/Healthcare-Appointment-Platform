# HealthBook Backend API

A **Node.js + Express + MongoDB** REST API for a Healthcare Appointment Booking Platform.

---

## 📦 Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Runtime     | Node.js                           |
| Framework   | Express.js 4.x                    |
| Database    | MongoDB (via Mongoose 8.x)        |
| Auth        | JWT (jsonwebtoken) + bcryptjs     |
| Dev Tool    | nodemon                           |

---

## 🚀 Setup & Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/healthbook?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@healthbook.com
ADMIN_PASSWORD=Admin@123
NODE_ENV=development
```

> **Important:** Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

### 3. Seed the Database

Populates the DB with an admin account and 10 sample doctors:

```bash
npm run seed
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Start in Production

```bash
npm start
```

The API will be available at: `http://localhost:5000`

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                   # MongoDB connection
├── controllers/
│   ├── authController.js       # Auth logic
│   ├── doctorController.js     # Doctor CRUD
│   ├── appointmentController.js# Appointment logic
│   └── userController.js       # User profile + admin stats
├── middleware/
│   ├── auth.js                 # JWT verification
│   └── adminAuth.js            # Admin role guard
├── models/
│   ├── User.js                 # User schema (patient/admin)
│   ├── Doctor.js               # Doctor schema
│   └── Appointment.js          # Appointment schema
├── routes/
│   ├── authRoutes.js
│   ├── doctorRoutes.js
│   ├── appointmentRoutes.js
│   └── userRoutes.js
├── scripts/
│   └── seed.js                 # DB seeder
├── .env.example
├── package.json
├── server.js
└── README.md
```

---

## 🔐 Authentication

All protected routes require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are returned on successful `register` and `login` responses.

---

## 📡 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint            | Access  | Description               |
|--------|---------------------|---------|---------------------------|
| POST   | `/register`         | Public  | Register a new patient    |
| POST   | `/login`            | Public  | Login (patient or admin)  |
| GET    | `/me`               | Private | Get current user info     |

**Register body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "phone": "555-1234",
  "gender": "male",
  "dob": "1990-05-15",
  "address": "123 Main St"
}
```

**Login body:**
```json
{ "email": "john@example.com", "password": "secret123" }
```

---

### Doctors — `/api/doctors`

| Method | Endpoint    | Access       | Description                                |
|--------|-------------|--------------|--------------------------------------------|
| GET    | `/`         | Public       | Get all doctors (`?specialty=` `?search=`) |
| GET    | `/:id`      | Public       | Get doctor by ID                           |
| POST   | `/`         | Admin        | Add a new doctor                           |
| PUT    | `/:id`      | Admin        | Update a doctor                            |
| DELETE | `/:id`      | Admin        | Delete a doctor (cancels appointments)     |

**Query params for GET /:**
- `?specialty=Cardiologist` — filter by specialty
- `?search=Johnson` — search by doctor name

---

### Appointments — `/api/appointments`

| Method | Endpoint          | Access  | Description                              |
|--------|-------------------|---------|------------------------------------------|
| POST   | `/`               | Patient | Book a new appointment                   |
| GET    | `/my`             | Patient | Get logged-in patient's appointments     |
| PUT    | `/:id/cancel`     | Patient | Cancel an appointment (pending/confirmed)|
| GET    | `/`               | Admin   | Get all appointments (`?status=`)        |
| PUT    | `/:id/status`     | Admin   | Update appointment status                |

**Book appointment body:**
```json
{
  "doctorId": "<doctor_mongo_id>",
  "date": "2024-08-20",
  "time": "10:30",
  "notes": "First visit"
}
```

**Update status body (admin):**
```json
{ "status": "confirmed" }
```

Valid statuses: `pending`, `confirmed`, `cancelled`, `completed`

---

### Users — `/api/users`

| Method | Endpoint          | Access  | Description                  |
|--------|-------------------|---------|------------------------------|
| GET    | `/profile`        | Private | Get own profile              |
| PUT    | `/profile`        | Private | Update own profile           |
| GET    | `/admin/stats`    | Admin   | Get dashboard statistics     |

**Update profile body:**
```json
{
  "name": "John Doe",
  "phone": "555-9999",
  "gender": "male",
  "dob": "1990-05-15",
  "address": "456 New St",
  "image": "https://example.com/avatar.jpg"
}
```

**Admin stats response:**
```json
{
  "success": true,
  "stats": {
    "totalDoctors": 10,
    "totalAppointments": 42,
    "totalPatients": 35,
    "pendingAppointments": 8,
    "confirmedAppointments": 15,
    "completedAppointments": 12,
    "cancelledAppointments": 7,
    "recentAppointments": [ ... ]
  }
}
```

---

## 🌱 Seed Data

Running `npm run seed` creates:
- **1 Admin user** — email/password from `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- **10 Doctors** across specialties: Cardiology, Neurology, Pediatrics, Orthopedics, Dermatology, Psychiatry, Gynecology, ENT, Endocrinology, Gastroenterology

---

## ⚠️ Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Descriptive error message here"
}
```

| HTTP Code | Meaning                              |
|-----------|--------------------------------------|
| 400       | Bad Request / Validation error       |
| 401       | Unauthorized (missing/invalid token) |
| 403       | Forbidden (insufficient role)        |
| 404       | Resource not found                   |
| 409       | Conflict (e.g. email already exists) |
| 500       | Internal Server Error                |
