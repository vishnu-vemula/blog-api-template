# Epic Blog API Documentation

Base URL: `http://localhost:4000/api`

## Authentication

The API supports two methods of authentication:

1.  **JWT Bearer Token**: Used for user management and content creation.
    *   Header: `Authorization: Bearer <your_jwt_token>`
2.  **API Key**: Used for accessing blog content from external applications.
    *   Header: `x-api-key: <your_api_key>`

---

## Endpoints

### 1. Authentication & Users

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/users/register` | Register a new user | No |
| `POST` | `/users/login` | Login and receive JWT token | No |
| `GET` | `/users/profile` | Get current user's profile | Yes (JWT) |
| `PUT` | `/users/profile` | Update current user's profile | Yes (JWT) |
| `DELETE` | `/users/profile` | Delete current user's account | Yes (JWT) |
| `PUT` | `/users/change-password` | Change password | Yes (JWT) |
| `GET` | `/users` | Get all users (paginated) | Yes (Admin/Superadmin) |
| `GET` | `/users/:userId` | Get user by ID | No |
| `GET` | `/users/username/:username` | Get user by username | No |

**Register Payload:**
```json
{
  "email": "user@example.com",
  "username": "user123",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 2. API Keys

Manage API keys for accessing content programmatically.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api-keys` | Create a new API key | Yes (JWT) |
| `GET` | `/api-keys` | List all API keys | Yes (JWT) |
| `DELETE` | `/api-keys/:id` | Delete an API key | Yes (JWT) |

**Create API Key Payload:**
```json
{
  "name": "My Portfolio Site"
}
```

### 3. Blogs

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/blogs` | Get all blogs (paginated) | No |
| `GET` | `/blogs/popular` | Get popular blogs | No |
| `GET` | `/blogs/:blogId` | Get blog by ID | No |
| `GET` | `/blogs/slug/:slug` | Get blog by slug | No |
| `GET` | `/blogs/author/:authorId` | Get blogs by author | Optional |
| `GET` | `/blogs/tag/:tag` | Get blogs by tag | No |
| `POST` | `/blogs` | Create a new blog | Yes (JWT or API Key) |
| `GET` | `/blogs/user/my-blogs` | Get current user's blogs | Yes (JWT or API Key) |
| `PUT` | `/blogs/:blogId` | Update a blog | Yes (JWT or API Key) |
| `DELETE` | `/blogs/:blogId` | Delete a blog | Yes (JWT or API Key) |
| `POST` | `/blogs/:blogId/publish` | Publish a blog | Yes (JWT or API Key) |
| `POST` | `/blogs/:blogId/unpublish` | Unpublish a blog | Yes (JWT or API Key) |

**Create Blog Payload:**
```json
{
  "title": "My First Post",
  "content": "Hello world...",
  "status": "published", // or "draft"
  "tags": ["tech", "life"]
}
```

### 4. Categories

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/categories` | Get all categories | No |
| `GET` | `/categories/tree` | Get category tree | No |
| `POST` | `/categories` | Create category (Admin) | Yes (JWT) |
| `PUT` | `/categories/:categoryId` | Update category (Admin) | Yes (JWT) |
| `DELETE` | `/categories/:categoryId` | Delete category (Admin) | Yes (JWT) |

### 5. Comments

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/comments/blog/:blogId` | Get comments for a blog | No |
| `POST` | `/comments` | Add a comment | Yes (JWT) |
| `PUT` | `/comments/:commentId` | Update a comment | Yes (JWT) |
| `DELETE` | `/comments/:commentId` | Delete a comment | Yes (JWT) |

### 6. Likes

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/likes/toggle` | Toggle like on blog/comment | Yes (JWT) |
| `GET` | `/likes/check` | Check if liked | Yes (JWT) |

---

## Health Check

`GET /health` - Returns API status and version.
