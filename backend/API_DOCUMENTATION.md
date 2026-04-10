# 🚀 Badawy Backend API Documentation

This document describes all the available endpoints for the Badawy backend system.

## 🔑 Authentication
Base URL: `/api/auth`

### Login
Authenticates the admin user and returns a JWT token.

- **URL**: `/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "admin",
    "password": "adminpassword123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "_id": "...",
    "username": "admin",
    "token": "JWT_TOKEN_HERE"
  }
  ```

---

## 📦 Items (Images)
Base URL: `/api/items`

### Get All Items
Public endpoint to retrieve all items.

- **URL**: `/`
- **Method**: `GET`
- **Success Response**: `200 OK` (Array of Items)

### Create Item
Admin only. Requires JWT in Authorization header.

- **URL**: `/`
- **Method**: `POST`
- **Auth**: `Bearer <token>`
- **Body** (Multipart/Form-Data):
  - `title`: String
  - `description`: String
  - `image`: File (The image file to upload)
- **Success Response**: `201 Created`

### Update Item
Admin only.

- **URL**: `/:id`
- **Method**: `PUT`
- **Auth**: `Bearer <token>`
- **Body** (Multipart/Form-Data):
  - `title`: String (Optional)
  - `description`: String (Optional)
  - `image`: File (Optional)

### Delete Item
Admin only.

- **URL**: `/:id`
- **Method**: `DELETE`
- **Auth**: `Bearer <token>`

---

## 💬 Comments (Fake Testimonials)
Base URL: `/api/comments`

### Get All Comments
Public endpoint to retrieve all fake comments/testimonials for the UI.

- **URL**: `/`
- **Method**: `GET`
- **Success Response**: `200 OK` (Array of Comments)

### Add Comment
Admin only.

- **URL**: `/`
- **Method**: `POST`
- **Auth**: `Bearer <token>`
- **Body**:
  ```json
  {
    "username": "Joe Doe",
    "description": "This is a great service!",
    "profilePhoto": "https://api.dicebear.com/7.x/avataaars/svg?seed=Joe"
  }
  ```
- **Success Response**: `201 Created`

### Delete Comment
Admin only.

- **URL**: `/:id`
- **Method**: `DELETE`
- **Auth**: `Bearer <token>`

---

## 🛠 Setup & Running
1. **Install Dependencies**: `npm install`
2. **Environment**: Create a `.env` file based on the provided URI and Secret.
3. **Admin Setup**: Run `node scripts/setupAdmin.js` to create the initial admin account.
4. **Start Server**: `npm run dev`
