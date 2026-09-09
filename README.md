# Mini Blogging Platform

A full-stack Mini Blogging Platform where users can register, login, create and manage blog posts, search blogs, filter blogs by category, and add comments.

## 🚀 Features

### Authentication
- User registration
- User login
- JWT-based authentication
- Password hashing using bcryptjs
- Logout functionality

### Blog Posts
- Create blog posts
- Publish posts
- Save posts as drafts
- Edit own posts
- Delete own posts
- View single blog post
- Author information
- Featured image support

### Search & Filter
- Search blogs by title
- Search blogs by content/keyword
- Filter blogs by category

### Comments
- Add comments to published posts
- Display comments with author information
- Login required for commenting

### Authorization
- Users can edit only their own posts
- Users can delete only their own posts
- Protected APIs using JWT authentication

### Responsive Design
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

---

## 📁 Project Structure

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
│   └── server.js
│
├── frontend/
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   └── main.js
│   │
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── create-post.html
│   ├── edit-post.html
│   ├── post.html
│   └── dashboard.html
│
└── README.md