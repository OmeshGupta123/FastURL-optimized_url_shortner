# FastURL — Frontend Integration Guide

This guide outlines the backend API specifications, request/response formats, authentication lifecycle, and features available for frontend development.

---

## 1. Base Configuration

- **Base URL:** `http://localhost:8000`
- **Interactive Swagger Docs:** `http://localhost:8000/docs`
- **OpenAPI JSON:** `http://localhost:8000/openapi.json`
- **CORS:** Enabled (`allow_origins=["*"]`, `allow_methods=["*"]`, `allow_headers=["*"]`). Any local dev server (`http://localhost:3000`, `http://localhost:5173`, etc.) can call the API directly.

---

## 2. Authentication Flow

FastURL uses **OAuth2 Password Bearer with JWT** (`HS256`).

```
[ User Register ]  ──> POST /users/ (JSON)
                             │
[ User Login ]     ──> POST /login (URL-encoded form) ──> Returns { access_token, token_type: "bearer" }
                             │
[ Authenticated ]  ──> Attach Header to protected endpoints:
                       Authorization: Bearer <access_token>
```

1. **Sign Up:** Submit `email` and `password` to `POST /users/`.
2. **Log In:** Submit credentials to `POST /login` as `application/x-www-form-urlencoded`.
3. **Token Storage:** Store `access_token` in memory, `localStorage`, or `sessionStorage`.
4. **Attach Token:** For all protected endpoints, attach the header:
   ```http
   Authorization: Bearer <access_token>
   ```
5. **Token Expiration / Errors:** When a token expires or is invalid, the backend returns `401 Unauthorized` (`{"detail": "Could not validate credentials"}`). The frontend should intercept `401` responses and redirect the user to `/login`.

---

## 3. API Endpoints

### 3.1 Health Check

#### `GET /health`
Verify backend service availability.

- **Auth Required:** No
- **Response (200 OK):**
  ```json
  {
    "status": "healthy"
  }
  ```

---

### 3.2 Authentication & Users

#### `POST /users/`
Register a new user account.

- **Auth Required:** No
- **Rate Limit:** 20 requests/minute
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "strongpassword123"
  }
  ```
  *Validation:* `email` must be a valid email string; `password` must be between 6 and 128 characters.
- **Response (201 Created):**
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2026-11-06T10:00:00Z"
  }
  ```
- **Errors:**
  - `400 Bad Request`: `{"detail": "Email already registered"}`
  - `422 Unprocessable Entity`: Field validation failed (e.g. password < 6 chars).
  - `429 Too Many Requests`: Rate limit exceeded.

---

#### `POST /login`
Authenticate existing user and obtain JWT access token.

- **Auth Required:** No
- **Headers:** `Content-Type: application/x-www-form-urlencoded`
- **Request Body (Form URL-Encoded):**
  ```
  username=user@example.com&password=strongpassword123
  ```
  *(Note: OAuth2 standard specifies the field name `username`, which accepts the user's email).*
- **Response (200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
    "token_type": "bearer"
  }
  ```
- **Errors:**
  - `401 Unauthorized`: `{"detail": "Invalid credentials"}`
  - `422 Unprocessable Entity`: Missing `username` or `password` in form data.

---

#### `GET /users/{id}`
Fetch user profile details.

- **Auth Required:** Yes (`Bearer <token>`)
- **Rate Limit:** 60 requests/minute
- **Path Parameter:** `id` (integer)
- **Response (200 OK):**
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2026-11-06T10:00:00Z"
  }
  ```
- **Errors:**
  - `401 Unauthorized`: Missing or invalid Bearer token.
  - `403 Forbidden`: `{"detail": "Not authorized to access this user"}` (users can only access their own profile).

---

### 3.3 URL Management

#### `POST /urls/`
Shorten a long URL for the authenticated user.

- **Auth Required:** Yes (`Bearer <token>`)
- **Rate Limit:** 120 requests/minute
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "original_url": "https://www.example.com/very/long/path?param=123"
  }
  ```
  *Validation:* `original_url` must start with `http://` or `https://` (max 2048 chars).
- **Response (201 Created):**
  ```json
  {
    "id": 42,
    "original_url": "https://www.example.com/very/long/path?param=123",
    "short_code": "x7K9pQ",
    "created_at": "2026-11-06T10:15:30Z",
    "clicks": 0
  }
  ```
- **Full Shortened URL Format:** `${BASE_URL}/urls/r/${short_code}` (e.g. `http://localhost:8000/urls/r/x7K9pQ`).
- **Errors:**
  - `401 Unauthorized`: Not logged in.
  - `422 Unprocessable Entity`: Invalid URL format (e.g. missing `http://` or `https://`).
  - `429 Too Many Requests`: Rate limit exceeded.

---

#### `GET /urls/`
List all URLs created by the currently logged-in user.

- **Auth Required:** Yes (`Bearer <token>`)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  [
    {
      "id": 42,
      "original_url": "https://www.example.com/very/long/path?param=123",
      "short_code": "x7K9pQ",
      "created_at": "2026-11-06T10:15:30Z",
      "clicks": 14
    },
    {
      "id": 41,
      "original_url": "https://github.com",
      "short_code": "gH90ab",
      "created_at": "2026-11-05T08:00:00Z",
      "clicks": 3
    }
  ]
  ```
  *(Sorted newest to oldest).*
- **Errors:**
  - `401 Unauthorized`: Not logged in.

---

#### `GET /urls/r/{short_code}`
Public redirection endpoint.

- **Auth Required:** No
- **Path Parameter:** `short_code` (e.g. `x7K9pQ`)
- **Behavior:**
  - Performs an **HTTP 307 Temporary Redirect** to `original_url`.
  - Increments click counters instantly in Redis and queues an asynchronous background task to sync clicks to PostgreSQL.
- **Response:**
  - `307 Temporary Redirect` with `Location: <original_url>`
- **Errors:**
  - `404 Not Found`: `{"detail": "Short URL not found"}`

---

## 4. Backend Features Available for Frontend Integration

| Feature | Backend Implementation | Frontend UI Opportunity |
| :--- | :--- | :--- |
| **Real-time Click Tracking** | Cached in Redis, synced in background | Display live click counts next to each short link in a dashboard. |
| **Instant Cache Invalidation** | Creating a URL automatically evicts `user_urls:{id}` cache | Calling `GET /urls/` right after `POST /urls/` immediately returns the fresh list. |
| **Validation Rules** | Passwords: 6–128 chars. URLs: Must start with `http://` or `https://`, max 2048 chars | Mirror these rules in client-side form validation before submitting. |
| **Copyable Short Links** | Clean 6-character alphanumeric codes (`[a-zA-Z0-9]`) | Provide a "Copy to Clipboard" button constructing `${API_BASE}/urls/r/${short_code}`. |
| **Rate Limit Protection** | Handled via `slowapi` returning HTTP 429 | Display user-friendly cooldown toast/alert on HTTP 429 response. |
| **Full URL Redirection** | HTTP 307 preserves destination parameters | Safe to test redirect links directly in new browser tabs (`target="_blank"`). |
