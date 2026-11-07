# NotesApp API Documentation

Base URL: `http://localhost:5000/api`

## 1. Authentication APIs

### Register User

- **Method:** POST
- **Endpoint:** `/auth/register`
- **Access:** Public

Request Body:

```json
{
  "name": "Pooja Maurya",
  "email": "pooja@gmail.com",
  "password": "Password@123"
}
```

### Login User

- **Method:** POST
- **Endpoint:** `/auth/login`
- **Access:** Public

Request Body:

```json
{
  "email": "pooja@gmail.com",
  "password": "Password@123"
}
```

Response includes authentication token and user details.

### Get User Profile

- **Method:** GET
- **Endpoint:** `/auth/profile`
- **Access:** Authenticated users

## 2. Notes APIs

All notes APIs require a JWT token in the Authorization header.

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### Create Note

- **Method:** POST
- **Endpoint:** `/notes`
- **Access:** Authenticated users

Request Body:

```json
{
  "title": "JavaScript Notes",
  "content": "Learning JavaScript fundamentals.",
  "tags": ["study", "javascript"]
}
```

### Get Notes

- **Method:** GET
- **Endpoint:** `/notes`
- **Access:** Authenticated users

Query Parameters:

| Parameter | Description |
|---|---|
| search | Search by title or content |
| tag | Filter notes by tag |
| page | Page number |
| limit | Number of notes per page |

Example:

```text
GET /api/notes?search=javascript&page=1&limit=6&tag=study
```

Response:

```json
{
  "message": "Notes fetched successfully",
  "data": [],
  "page": 1,
  "total": 0,
  "pages": 0
}
```

### Update Note

- **Method:** PUT
- **Endpoint:** `/notes/:id`
- **Access:** Note owner only

Request Body:

```json
{
  "title": "Updated JavaScript Notes",
  "content": "Updated learning content.",
  "tags": ["javascript", "learning"]
}
```

### Delete Note

- **Method:** DELETE
- **Endpoint:** `/notes/:id`
- **Access:** Note owner or Admin

## 3. Role-Based Permissions

| Feature | User | Admin |
|---|---|---|
| Create notes | Yes | Yes |
| View own notes | Yes | Yes |
| View all notes | No | Yes |
| Edit own notes | Yes | Yes |
| Edit another user's notes | No | No |
| Delete own notes | Yes | Yes |
| Delete another user's notes | No | Yes |

## 4. Security

- JWT-based authentication.
- Password hashing using bcryptjs.
- Protected routes.
- Role-based authorization.
- Request validation.
- Rate limiting on authentication routes.
- Environment variables for sensitive configuration.

## 5. Error Handling

The API returns appropriate HTTP status codes:

| Status Code | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Resource not found |
| 500 | Internal server error |

---

**Project:** NotesApp – MERN Stack

**Author:** Pooja Maurya
