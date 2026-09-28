# Blog Project — Node.js

Documentation implementation: **Register, Login, Cookies, Protected Route & View Blog**

## Features

- User Registration (Name, Email, Password, Confirm Password)
- User Login with password hashing (bcrypt)
- Cookie-based authentication (`httpOnly` cookie with userId)
- Protected `/blogs` route (middleware checks cookie + valid user)
- View-only blogs (no Create / Edit / Delete)
- Logout clears the authentication cookie
- Bootstrap UI
- Sample blogs seeded automatically on first run

## Technologies

| Technology     | Purpose                        |
|----------------|--------------------------------|
| Node.js        | Backend runtime                |
| Express.js     | Server and routing             |
| MongoDB        | Database                       |
| Mongoose       | ODM                            |
| EJS            | Template engine                |
| Cookie Parser  | Cookie management              |
| bcrypt         | Password hashing               |
| Bootstrap 5    | UI                             |

## Project Structure

```
blog-project/
├── models/
│   ├── User.js
│   └── Blog.js          # Added for MongoDB blog storage
├── routes/
│   ├── authRoutes.js
│   └── blogRoutes.js
├── middleware/
│   └── authMiddleware.js
├── views/
│   ├── login.ejs
│   ├── register.ejs
│   ├── dashboard.ejs
│   └── blogs.ejs
├── public/
│   └── css/
│       └── style.css
├── app.js
├── package.json
├── .env
└── README.md
```

## Setup & Run

1. **Install MongoDB** (if not already running) and start the service.

2. **Install dependencies**
   ```bash
   cd blog-project
   npm install
   ```

3. **Configure environment** (already set in `.env`)
   ```
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/blog_project
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. Open http://localhost:3000

## Routes

| Method | Route      | Purpose         | Protected |
|--------|------------|-----------------|-----------|
| GET    | `/`        | Home            | No        |
| GET    | `/register`| Register Page   | No        |
| POST   | `/register`| Register User   | No        |
| GET    | `/login`   | Login Page      | No        |
| POST   | `/login`   | Login User      | No        |
| GET    | `/blogs`   | View Blogs      | Yes       |
| GET    | `/logout`  | Logout          | Yes       |

## Flow Summary

1. **Register** → Validate → Hash password → Save User → Redirect to Login
2. **Login** → Find User → Compare password → Set `userId` cookie → Redirect to `/blogs`
3. **Protected Route** → Middleware checks cookie + valid user → Show blogs or redirect to login
4. **Logout** → Clear cookie → Redirect to login

## Notes

- Passwords are hashed with bcrypt (salt rounds = 10) before saving.
- Cookie is `httpOnly` for better security against XSS.
- Sample blogs are automatically inserted if the collection is empty.
- Create / Edit / Delete Blog and Admin Panel are **not** included (as per documentation).
