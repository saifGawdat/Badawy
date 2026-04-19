# Badawy API Documentation

This document provides technical details for all available API endpoints in the Badawy platform.

## Base URL
All API requests should be made to:
`https://your-domain.com/api` (Local: `http://localhost:3000/api`)

## Authentication
Most management and content creation endpoints require authentication.
The platform uses **JWT-based authentication** stored in an **HttpOnly cookie** named `badawy_token`.

- When authenticated, the cookie is automatically sent with every request.
- If the token is missing or invalid, the API returns a `401 Unauthorized` response.

---

## 1. Authentication Endpoints

### POST `/auth/login`
Authenticate a user and set the session cookie.

**Request Body (JSON):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | string | Yes | Admin username |
| password | string | Yes | Admin password |

**Response (200 OK):**
```json
{
  "success": true,
  "id": "uuid",
  "username": "admin"
}
```

### POST `/auth/logout`
Clear the session cookie and logout the user.

**Response (200 OK):**
```json
{
  "success": true
}
```

### GET `/auth/me`
Verify the current session and get user details.
*Requires Authentication*

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "admin"
  }
}
```

---

## 2. Management & Settings

### GET `/about`
Fetch the public content for the About Dr. Badawi section.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "quoteEn": "...",
  "quoteAr": "...",
  "drNameEn": "...",
  "drNameAr": "...",
  "drTitleEn": "...",
  "drTitleAr": "...",
  "imageUrl": "cloudinary_url",
  "stat1Value": "95%",
  "stat1LabelEn": "...",
  ...
}
```

### PATCH `/about`
Update the About section content.
*Requires Authentication | Supports Multi-part Form Data*

**Request Parameters (FormData):**
- `drNameEn`, `drNameAr`, `drTitleEn`, `drTitleAr`
- `quoteEn`, `quoteAr`
- `stat1Value`, `stat1LabelEn`, `stat1LabelAr`
- `stat2Value`, `stat2LabelEn`, `stat2LabelAr`
- `image` (File): New profile image upload.

### GET `/site-settings`
Get global site settings (Contact, Social Media).

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "phone": "...",
    "whatsappPhone": "...",
    "location": "...",
    "facebookUrl": "...",
    "instagramUrl": "..."
  }
}
```

### PATCH `/site-settings`
Update global site settings.
*Requires Authentication | JSON*

---

## 3. Blog Endpoints

### GET `/blog`
List all published blog posts.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "uuid",
      "title": "Post Title",
      "slug": "post-slug",
      "excerpt": "...",
      "featuredImage": "cloudinary_url",
      "publishedAt": "2024-..."
    }
  ]
}
```

### GET `/blog/slug/[slug]`
Get a single blog post by its slug.

### POST `/blog`
Create a new blog post.
*Requires Authentication | Multi-part Form Data*

**Request Parameters (FormData):**
- `title`, `titleAr`, `slug`
- `excerpt`, `excerptAr`, `content`, `contentAr`
- `metaTitle`, `metaDescription`
- `published` (boolean string)
- `featuredImage` (File)

---

## 4. Content Modules

### `/hero-slides`
- **GET**: List all hero slides.
- **POST**: Create a new hero slide (Auth required | FormData: `title`, `subtitle`, `ctaText`, `image`).
- **DELETE `/[id]`**: Delete a slide (Auth required).

### `/items` (Services/Procedures)
- **GET**: List all service items.
- **POST**: Create a new item (Auth required | FormData: `title`, `description`, `image`).
- **PUT `/[id]`**: Update an item.
- **DELETE `/[id]`**: Delete an item.

### `/before-after`
- **GET**: List all entries.
- **POST**: Create new entry (Auth required | FormData: `title`, `beforeImage`, `afterImage`).

### `/comments` (Testimonials)
- **GET**: List all testimonials.
- **POST**: Create new testimonial (Auth required | FormData: `username`, `description`, `image`).

---

## 5. Analytics & Leads

### POST `/appointments`
Submit a new appointment request. *Public Interface*

**Request Body (JSON):**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+123...",
  "procedure": "Rhinoplasty",
  "message": "Prefer morning slots"
}
```

### GET `/appointments`
List all appointment requests. *Requires Authentication*

---

## Standard Error Responses

| Code | Meaning | Description |
|------|---------|-------------|
| 400 | Bad Request | Missing required fields or invalid data. |
| 401 | Unauthorized | Missing or invalid authentication session. |
| 404 | Not Found | Resource does not exist. |
| 500 | Server Error | An unexpected error occurred on the server. |

**Example Error Response:**
```json
{
  "success": false,
  "error": "Error message explanation"
}
```
