# ⭐ Store Rating Platform

> FullStack Intern Coding Challenge Submission
> Built using React.js, Express.js, PostgreSQL, and Prisma ORM.

---

# 📌 Problem Statement

Build a full-stack web application that allows users to submit ratings for stores registered on the platform.

The platform should support:

* User registration & login
* Role-based dashboards
* Store rating system (1 to 5)
* Search, sorting, filtering
* Admin management panel
* Secure authentication
* Proper validations
* Clean database design

---

# 👥 User Roles

The application supports three user roles:

1. 👑 System Administrator
2. 👤 Normal User
3. 🏪 Store Owner

---

# 🚀 Features Implemented

## 👑 System Administrator

* Secure login
* Add stores
* Add users (Admin / User / Owner)
* View dashboard statistics
* View all stores and users
* Search & filter records
* View user details
* Logout

---

## 👤 Normal User

* Register account
* Secure login
* Change password
* Browse all stores
* Search stores by name and address
* Submit rating (1–5)
* Update rating
* Logout

---

## 🏪 Store Owner

* Secure login
* Change password
* View average rating
* View users who rated their store
* Logout

---

# 🛠 Tech Stack

| Layer          | Technology      |
| -------------- | --------------- |
| Frontend       | React.js + Vite |
| Backend        | Express.js      |
| Database       | PostgreSQL      |
| ORM            | Prisma          |
| Authentication | JWT             |
| HTTP Client    | Axios           |
| Styling        | CSS             |

---

# 📂 Project Structure

```bash
store-rating-platform/
│── backend/
│   ├── prisma/
│   ├── src/
│   ├── package.json
│   └── .env.example
│
│── frontend/
│   ├── src/
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone <your-github-repo-url>
cd store-rating-platform
```

---

## 2️⃣ Backend Setup

```bash
cd backend
npm install
copy .env.example .env
npx prisma migrate dev --name init
npm run prisma:generate
npm run prisma:seed
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

# 🔐 Default Admin Credentials

```text
Email: admin@storerating.com
Password: Admin@123
```

---

# 🔌 API Endpoints

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
PUT  /api/auth/change-password
```

---

## Admin Routes

```http
GET  /api/admin/dashboard/stats
POST /api/admin/users
POST /api/admin/stores
GET  /api/admin/users
GET  /api/admin/stores
GET  /api/admin/users/:id
```

---

## User Routes

```http
GET  /api/stores
POST /api/ratings
PUT  /api/ratings/:id
```

---

## Owner Routes

```http
GET /api/owner/dashboard
```

---

# ✅ Validation Rules

| Field    | Rule                                             |
| -------- | ------------------------------------------------ |
| Name     | Minimum 20, Maximum 60 characters                |
| Address  | Maximum 400 characters                           |
| Email    | Standard email format                            |
| Password | 8–16 chars, one uppercase, one special character |

Password Regex:

```regex
^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$
```

---

# 🧠 Database Design Highlights

* One user can rate one store only once
* Ratings can be updated later
* Role-based users table
* Secure password hashing using bcrypt
* Prisma relational schema
* Indexed queries for performance

---

# 🌟 Key Highlights

✅ Full-stack architecture
✅ Clean modular codebase
✅ Role-based authentication
✅ Real-world CRUD operations
✅ Search + Filtering + Sorting
✅ Dashboard analytics
✅ Protected routes
✅ Prisma ORM integration
✅ PostgreSQL relational design

---

# 🚀 Future Improvements

* Email verification
* Password reset
* Charts dashboard
* Pagination
* Better UI animations
* Deployment (Vercel / Render / Railway)

---

# 👨‍💻 Developer

**Prasad Bhagyawant**

---

# 📬 Final Submission Note

This project was developed as part of the **FullStack Intern Coding Challenge** to demonstrate practical skills in:

* Frontend Development
* Backend APIs
* Authentication Systems
* Database Design
* Role-Based Access Control
* Full-stack Application Architecture
