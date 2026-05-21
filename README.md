# Blogging Platform

A full-stack blogging platform built with **Spring Boot**, **React**, and **MySQL**.

Users can register, login, create posts, manage profiles, explore public user pages, and browse articles with filtering and pagination.

---

## Features

### Authentication & Security
- JWT-based authentication
- User registration and login
- Protected routes
- Ownership-based authorization
- Public and private profile access

### Post Management
- Create, update and delete posts
- Post detail pages
- Cover image support via image URL
- Category-based organization
- Search functionality
- Pagination support

### User Profiles
- Personal profile page
- Public user profile pages
- Profile image support
- Bio customization
- User-specific posts

### UI / UX
- Responsive design
- Modern blog-style interface
- Loading, error and empty states
- Custom 404 page
- Clean and reusable component structure

---

## Tech Stack

### Backend
- Java
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA (Hibernate)
- MySQL

### Frontend
- React
- React Router
- Axios
- Tailwind CSS
- Vite

---

## Project Structure

```text
blogging-platform-api/    → Spring Boot REST API
blogging-platform-ui/     → React frontend
```

---

## Screenshots

### Home Page

<img width="866" height="763" alt="home-page" src="https://github.com/user-attachments/assets/8bef24b7-0c76-4995-af13-2c226697eb5b" />


### Profile Page

<img width="645" height="744" alt="profile-page" src="https://github.com/user-attachments/assets/71fc2533-d3cb-4088-8101-54c369a10bb2" />


### Public Profile Page

<img width="447" height="662" alt="public-profile-page" src="https://github.com/user-attachments/assets/af439797-4420-47a1-ba6c-cb684985c087" />

### Post Detail Page

<img width="1243" height="763" alt="post-detail-page" src="https://github.com/user-attachments/assets/fa820b21-ea8d-4038-97cf-a1b5339c2931" />


---

## API Features

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
```

### Posts

```text
GET    /api/posts
GET    /api/posts/{id}
POST   /api/posts
PUT    /api/posts/{id}
DELETE /api/posts/{id}
```

### Users

```text
GET    /api/users/me
PUT    /api/users/me
GET    /api/users/public/{username}
```
