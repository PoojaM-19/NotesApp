# NotesApp – MERN Stack Notes Management System

A multi-user Notes Management Application built using the MERN Stack (MongoDB, Express.js, React.js, and Node.js).

## Features

### Authentication
- User Registration and Login
- JWT-based Authentication
- Password Hashing using bcrypt
- Remember Me functionality
- Role-based access (User and Admin)

### Notes Management
- Create Notes
- View Notes
- Edit Notes
- Delete Notes
- Add Multiple Tags to Notes
- Search Notes by Title and Content
- Filter Notes by Tags
- Pagination

### Admin Features
- View all users' notes
- Delete any user's notes
- Edit only their own notes
- Manage their own notes

### User Features
- Manage personal notes
- View profile
- Search and filter notes

### Security
- Protected API Routes
- Role-based Authorization
- Input Validation
- Rate Limiting
- Environment Variables

## Technology Stack

**Frontend**
- React.js
- Vite
- React Router DOM
- Axios
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- express-rate-limit

## Project Structure

```text
task4-aut/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## Installation and Setup

### 1. Clone Repository

```bash
git clone https://github.com/PoojaM-19/NotesApp.git
cd NotesApp
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and configure:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

Start backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

http://localhost:5173

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile | Get logged-in profile |

### Notes

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/notes | Create note |
| GET | /api/notes | Get notes |
| PUT | /api/notes/:id | Update own note |
| DELETE | /api/notes/:id | Delete own note or admin-delete |

### Notes Query Parameters

- `search` – Search notes by title or content.
- `tag` – Filter notes by tag.
- `page` – Select page number.
- `limit` – Set notes per page.

## Default Admin Account

Admin account is created using the backend seed script.

Do not publish actual login credentials or secret keys in this repository.

## Author

**Pooja Maurya**

GitHub: https://github.com/PoojaM-19

## Project

MERN Stack Internship 

Notes Management Application
