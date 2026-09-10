 # 📝 Mini Blogging Platform

A full-stack Mini Blogging Platform where users can register, login, create and manage blog posts, search blogs, filter blogs by category, and add comments.

## 🚀 Live Demo

### Frontend
https://mini-blogging-platform-1-wjf6.onrender.com

### Backend API
https://mini-blogging-platform-br6r.onrender.com

### GitHub Repository
https://github.com/rahulraj2007k-pixel/mini-blogging-platform

---

## ✨ Features

### 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Password hashing using bcryptjs
- Logout functionality
- Protected user routes

### 📝 Blog Posts

- Create blog posts
- Publish posts
- Save posts as drafts
- Edit own posts
- Delete own posts
- View single blog post
- Author information
- Featured image support

### 🔍 Search & Filter

- Search blogs by title
- Search blogs by content/keyword
- Filter blogs by category
- Dashboard filter for:
  - All Posts
  - Published Posts
  - Draft Posts

### 💬 Comments

- Add comments to published posts
- Display comments with author information
- Login required for commenting

### 🛡️ Authorization

- Users can edit only their own posts
- Users can delete only their own posts
- Protected APIs using JWT authentication

### 📱 Responsive Design

- Desktop responsive layout
- Tablet responsive layout
- Mobile responsive layout

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### Authentication & Security

- JWT
- bcryptjs

### Development Tools

- Visual Studio Code
- Git
- GitHub

### Deployment

- Render

---

## 📂 Project Structure

```text
Mini Blogging Platform/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   └── commentRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── auth.js
│   │   ├── main.js
│   │   └── posts.js
│   │
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── create-post.html
│   ├── edit-post.html
│   ├── post.html
│   └── dashboard.html
│
├── .gitignore
└── README.md
```

---

## ⚙️ How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/rahulraj2007k-pixel/mini-blogging-platform.git
```

### 2. Open Project

```bash
cd mini-blogging-platform
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_JWT_SECRET
```

### 5. Start Backend

```bash
npm start
```

For development:

```bash
npm run dev
```

### 6. Run Frontend

Open the `frontend` folder using Visual Studio Code and run `index.html` using Live Server.

---

## 🔗 API Routes

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Posts

```text
POST   /api/posts
GET    /api/posts
GET    /api/posts/my-posts
GET    /api/posts/search/posts
GET    /api/posts/category/:category
GET    /api/posts/:id
PUT    /api/posts/:id
DELETE /api/posts/:id
```

### Comments

```text
POST /api/comments/:postId
GET  /api/comments/:postId
```

---

## 🔒 Security

The project implements:

- JWT authentication
- Password hashing using bcryptjs
- Protected API routes
- User authorization
- Owner-only edit and delete permissions
- Environment variables for sensitive configuration

> Never commit the `.env` file or database credentials to GitHub.

---

## 🖥️ Application Pages

| Page | Purpose |
|---|---|
| Home | View published blogs |
| Register | Create a new account |
| Login | Login to the platform |
| Dashboard | Manage personal posts |
| Create Post | Create a new blog |
| Edit Post | Update an existing blog |
| Single Post | Read a complete blog and comments |

---

## 📊 Project Workflow

```text
User
  │
  ├── Register
  │
  ├── Login
  │      │
  │      └── JWT Token
  │
  └── Dashboard
         │
         ├── Create Post
         ├── Edit Post
         ├── Delete Post
         ├── Publish Post
         └── Save Draft
                │
                ▼
             Express.js
                │
                ▼
             MongoDB
                │
                ▼
          Blog Data Storage
```

---

## 🌐 Deployment

The project is deployed using Render.

### Frontend

```text
https://mini-blogging-platform-1-wjf6.onrender.com
```

### Backend

```text
https://mini-blogging-platform-br6r.onrender.com
```

### Database

MongoDB Atlas is used for cloud database storage.

---

## 📸 Screenshots

Screenshots of the following features can be added here:

- Home Page
- Login Page
- Register Page
- Dashboard
- Create Post
- Edit Post
- Single Blog
- Comments
- Search & Filter

---

## 🔮 Future Scope

The project can be enhanced with:

- User profile pictures
- Like and unlike posts
- Bookmark/save posts
- Admin dashboard
- Rich text editor
- Image upload using cloud storage
- Pagination
- Email verification
- Password reset
- Social media sharing
- Post tags
- User following system

---

## 🎓 Project Information

**Project:** Mini Blogging Platform

**Type:** Full-Stack Web Application

**Purpose:** BCA Minor Project

**Frontend:** HTML, CSS, JavaScript

**Backend:** Node.js, Express.js

**Database:** MongoDB

**Authentication:** JWT + bcryptjs

**Deployment:** Render

---

## 👨‍💻 Developer

**Rahul Kumar**

BCA 3rd Year

---

## 📄 License

This project is created for educational and academic purposes.