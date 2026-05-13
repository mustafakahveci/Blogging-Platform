# Blogging Platform API

A secure and scalable RESTful Blogging Platform API built with **Spring Boot**, **Spring Security**, **JWT Authentication**, and **MySQL**.

This project provides authentication, authorization, blog post management, profile management, pagination, filtering, sorting, and Swagger API documentation.

---

## Features

### Authentication & Security

- JWT Authentication
- User Registration & Login
- BCrypt Password Hashing
- Protected API Endpoints
- Ownership-based Authorization
- Secure Environment Variables Configuration

### User Management

- Get Current User Profile
- Update Current User Profile
- Get User By ID
- Get User By Username
- Get User Posts

### Post Management

- Create Post
- Update Post
- Delete Post
- Get Post By ID
- Get All Posts
- Get Posts By Username

### Advanced Query Features

- Pagination
- Sorting
- Keyword Search
- Category Filtering

### Documentation

- Swagger / OpenAPI Integration
- Postman Collection Included

---

## Tech Stack

### Backend

- Java 24
- Spring Boot
- Spring Security
- JWT (JSON Web Token)
- Spring Data JPA (Hibernate)
- MySQL
- Lombok
- Maven
- Swagger / OpenAPI

---

## Project Structure

```text
blogging-platform-api/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com.mustafakahveci.blogging_platform_api/
│   │   │       ├── config/
│   │   │       ├── controller/
│   │   │       ├── dto/
│   │   │       ├── exception/
│   │   │       ├── model/
│   │   │       ├── repository/
│   │   │       ├── security/
│   │   │       └── service/
│   │   └── resources/
│   └── test/
│
├── postman/
├── pom.xml
└── README.md
```

---

## API Features

### Authentication Flow

```text
Register
   ↓
Login
   ↓
JWT Token
   ↓
Authenticated Requests
```

Protected endpoints require:

```http
Authorization: Bearer <jwt_token>
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Users

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/users/me` | Get current user |
| PUT | `/api/users/me` | Update current profile |
| GET | `/api/users/{id}` | Get user by id |
| GET | `/api/users/username/{username}` | Get user by username |
| GET | `/api/users/{username}/posts` | Get user's posts |

### Posts

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/posts` | Create post |
| GET | `/api/posts` | Get all posts |
| GET | `/api/posts/{id}` | Get post by id |
| PUT | `/api/posts/{id}` | Update post |
| DELETE | `/api/posts/{id}` | Delete post |
| GET | `/api/posts?page=0&size=5` | Paginated posts |
| GET | `/api/posts?sortBy=createdAt&direction=desc` | Sorted posts |
| GET | `/api/posts?keyword=spring` | Search posts |
| GET | `/api/posts?category=BACKEND` | Filter posts |

---

## Pagination, Sorting & Filtering

### Pagination

```http
GET /api/posts?page=0&size=5
```

### Sorting

```http
GET /api/posts?sortBy=createdAt&direction=desc
```

### Search

```http
GET /api/posts?keyword=spring
```

### Category Filter

```http
GET /api/posts?category=BACKEND
```

### Combined Query

```http
GET /api/posts?keyword=jwt&category=BACKEND
```

---

## API Documentation

Interactive API documentation is provided via Swagger / OpenAPI integration.

A Postman collection is also included in the project files for testing API endpoints.

---

## Environment Variables

The application uses environment variables for sensitive credentials.

Required variables:

```env
DB_URL=your_database_url
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=86400000
```

---

## Postman Collection

Postman collection is included in:

```text
postman/blogging-platform-api.postman_collection.json
```

---

## Author

**Mustafa Kahveci**