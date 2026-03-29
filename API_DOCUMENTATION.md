# Miss Fit API Documentation

Complete API documentation for the Miss Fit Quiz Application. The API follows RESTful conventions with JSON request/response format.

## Base Configuration

- **Base URL:** `http://localhost:3001/api` (development)
- **Content-Type:** `application/json`
- **Authentication:** JWT Bearer Token in Authorization header
- **Timeout:** 30 seconds

## Response Structure

### Success Response (200-201)
```json
{
  "status": "success",
  "data": {}
}
```

### Error Response (4xx-5xx)
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Authentication Endpoints

### 1. Login
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user-1",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": "https://i.pravatar.cc/150?img=1",
      "points": 2450,
      "totalQuizzesTaken": 12,
      "createdAt": "2024-01-15"
    }
  }
}
```

**Error Response (401):**
```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

---

### 2. Register
**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user-2",
      "email": "jane@example.com",
      "name": "Jane Smith",
      "avatar": "https://i.pravatar.cc/150?img=2",
      "points": 0,
      "totalQuizzesTaken": 0,
      "createdAt": "2024-01-28"
    }
  }
}
```

**Error Response (409):**
```json
{
  "status": "error",
  "message": "Email already registered"
}
```

---

### 3. Get Current User
**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "user-1",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://i.pravatar.cc/150?img=1",
    "points": 2450,
    "totalQuizzesTaken": 12,
    "createdAt": "2024-01-15"
  }
}
```

---

### 4. Update Profile
**Endpoint:** `PUT /auth/profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "avatar": "https://new-avatar-url.com/image.jpg"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "user-1",
    "email": "user@example.com",
    "name": "John Doe Updated",
    "avatar": "https://new-avatar-url.com/image.jpg",
    "points": 2450,
    "totalQuizzesTaken": 12,
    "createdAt": "2024-01-15"
  }
}
```

---

## Quiz Endpoints

### 1. Get All Quiz Packages
**Endpoint:** `GET /quizzes`

**Query Parameters:**
- `category` (optional): Filter by category
- `difficulty` (optional): Filter by difficulty (easy, medium, hard)
- `page` (optional): Page number for pagination

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "quiz-1",
      "title": "JavaScript Fundamentals",
      "description": "Learn the basics of JavaScript programming",
      "category": "Programming",
      "difficulty": "easy",
      "price": 0,
      "isFree": true,
      "questionCount": 10,
      "duration": 20,
      "rating": 4.8,
      "maxAttempts": 5,
      "image": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
      "createdAt": "2024-01-20"
    }
  ]
}
```

---

### 2. Get Single Quiz Package
**Endpoint:** `GET /quizzes/{packageId}`

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "quiz-1",
    "title": "JavaScript Fundamentals",
    "description": "Learn the basics of JavaScript programming",
    "category": "Programming",
    "difficulty": "easy",
    "price": 0,
    "isFree": true,
    "questionCount": 10,
    "duration": 20,
    "rating": 4.8,
    "maxAttempts": 5,
    "image": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
    "createdAt": "2024-01-20"
  }
}
```

---

### 3. Get Quiz Questions
**Endpoint:** `GET /quizzes/{packageId}/questions`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "q1-1",
      "text": "What is a variable in JavaScript?",
      "image": null,
      "answers": [
        {
          "id": "a1",
          "text": "A named storage location for data",
          "image": null
        },
        {
          "id": "a2",
          "text": "A function parameter",
          "image": null
        },
        {
          "id": "a3",
          "text": "A CSS property",
          "image": null
        },
        {
          "id": "a4",
          "text": "An HTML tag",
          "image": null
        }
      ],
      "correctAnswerId": "a1",
      "explanation": "A variable is a named container for storing data values..."
    }
  ]
}
```

---

### 4. Get User's Purchased Packages
**Endpoint:** `GET /quizzes/my-packages`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "quiz-1",
      "title": "JavaScript Fundamentals",
      "description": "Learn the basics of JavaScript programming",
      "category": "Programming",
      "difficulty": "easy",
      "price": 0,
      "isFree": true,
      "questionCount": 10,
      "duration": 20,
      "rating": 4.8,
      "maxAttempts": 5,
      "isPurchased": true,
      "totalAttempts": 2,
      "image": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
      "createdAt": "2024-01-20"
    }
  ]
}
```

---

### 5. Submit Quiz Answer (Individual)
**Endpoint:** `POST /quizzes/submit-answer`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "packageId": "quiz-1",
  "questionId": "q1-1",
  "answerId": "a1"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "questionId": "q1-1",
    "answerId": "a1",
    "isCorrect": true,
    "timestamp": "2024-01-28T10:30:00Z"
  }
}
```

---

### 6. Submit Quiz Result (Complete)
**Endpoint:** `POST /quizzes/submit-result`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "packageId": "quiz-1",
  "score": 85,
  "totalQuestions": 10,
  "timeSpent": 1200,
  "answers": [
    {
      "questionId": "q1-1",
      "answerId": "a1"
    },
    {
      "questionId": "q1-2",
      "answerId": "a3"
    }
  ]
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "result-1",
    "packageId": "quiz-1",
    "score": 85,
    "totalQuestions": 10,
    "timeSpent": 1200,
    "answers": [...],
    "completedAt": "2024-01-28T10:45:00Z"
  }
}
```

---

### 7. Get User's Quiz Results
**Endpoint:** `GET /quizzes/my-results`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `packageId` (optional): Filter by package
- `limit` (optional): Number of results to return
- `offset` (optional): Pagination offset

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "result-1",
      "packageId": "quiz-1",
      "score": 85,
      "totalQuestions": 10,
      "timeSpent": 1200,
      "answers": [...],
      "completedAt": "2024-01-28T10:45:00Z"
    }
  ]
}
```

---

## Ranking Endpoints

### 1. Get Global Rankings
**Endpoint:** `GET /rankings/global`

**Query Parameters:**
- `limit` (optional): Number of results (default: 10, max: 50)
- `offset` (optional): Pagination offset

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "rank": 1,
      "userId": "user-1",
      "userName": "John Doe",
      "userAvatar": "https://i.pravatar.cc/150?img=1",
      "points": 2450,
      "quizzesTaken": 12
    },
    {
      "rank": 2,
      "userId": "user-2",
      "userName": "Jane Smith",
      "userAvatar": "https://i.pravatar.cc/150?img=2",
      "points": 2200,
      "quizzesTaken": 10
    }
  ]
}
```

---

### 2. Get Package-Specific Rankings
**Endpoint:** `GET /rankings/package/{packageId}`

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "rank": 1,
      "userId": "user-1",
      "userName": "John Doe",
      "userAvatar": "https://i.pravatar.cc/150?img=1",
      "points": 950,
      "quizzesTaken": 3
    }
  ]
}
```

---

### 3. Get Current User's Rank
**Endpoint:** `GET /rankings/my-rank`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "rank": 5,
    "userId": "user-1",
    "userName": "John Doe",
    "userAvatar": "https://i.pravatar.cc/150?img=1",
    "points": 2450,
    "quizzesTaken": 12
  }
}
```

---

## Payment Endpoints

### 1. Initiate Payment
**Endpoint:** `POST /payments/initiate`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "packageId": "quiz-2",
  "method": "dana"
}
```

**Supported Methods:**
- `dana`
- `gopay`
- `ovo`
- `linkaja`
- `card`

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "payment-1",
    "packageId": "quiz-2",
    "userId": "user-1",
    "amount": 9.99,
    "method": "dana",
    "status": "pending",
    "transactionId": "txn_1234567890",
    "createdAt": "2024-01-28T10:30:00Z"
  }
}
```

---

### 2. Verify Payment
**Endpoint:** `POST /payments/verify`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "transactionId": "txn_1234567890"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "payment-1",
    "packageId": "quiz-2",
    "userId": "user-1",
    "amount": 9.99,
    "method": "dana",
    "status": "success",
    "transactionId": "txn_1234567890",
    "createdAt": "2024-01-28T10:30:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "status": "error",
  "message": "Payment verification failed"
}
```

---

### 3. Get Payment History
**Endpoint:** `GET /payments/history`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `limit` (optional): Number of results
- `offset` (optional): Pagination offset
- `status` (optional): Filter by status (pending, success, failed)

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "payment-1",
      "packageId": "quiz-2",
      "userId": "user-1",
      "amount": 9.99,
      "method": "dana",
      "status": "success",
      "transactionId": "txn_1234567890",
      "createdAt": "2024-01-28T10:30:00Z"
    }
  ]
}
```

---

### 4. Cancel Payment
**Endpoint:** `POST /payments/cancel`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "transactionId": "txn_1234567890"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "payment-1",
    "packageId": "quiz-2",
    "userId": "user-1",
    "amount": 9.99,
    "method": "dana",
    "status": "cancelled",
    "transactionId": "txn_1234567890",
    "createdAt": "2024-01-28T10:30:00Z"
  }
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication token |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists (e.g., email) |
| 422 | Unprocessable Entity | Validation error in request body |
| 500 | Internal Server Error | Server error |

---

## Rate Limiting

Currently, the mock API has no rate limiting. In production, implement rate limiting to prevent abuse:
- Authentication endpoints: 5 requests per minute
- Quiz endpoints: 100 requests per minute
- General endpoints: 50 requests per minute

---

## Data Models

### User Object
```typescript
{
  id: string;
  email: string;
  name: string;
  avatar?: string;
  points: number;
  totalQuizzesTaken: number;
  createdAt: string; // ISO 8601 format
}
```

### QuizPackage Object
```typescript
{
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  price: number;
  isFree: boolean;
  questionCount: number;
  duration: number; // in minutes
  rating: number; // 0-5
  maxAttempts: number;
  totalAttempts?: number; // Only when purchased
  isPurchased?: boolean; // Only in my-packages
  image?: string; // URL
  createdAt: string; // ISO 8601 format
}
```

### Question Object
```typescript
{
  id: string;
  text: string;
  image?: string; // URL
  answers: Answer[];
  correctAnswerId: string;
  explanation: string;
}
```

### Answer Object
```typescript
{
  id: string;
  text: string;
  image?: string; // URL
}
```

### RankingUser Object
```typescript
{
  rank: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  points: number;
  quizzesTaken: number;
}
```

### Payment Object
```typescript
{
  id: string;
  packageId: string;
  userId: string;
  amount: number;
  method: 'dana' | 'gopay' | 'ovo' | 'linkaja' | 'card';
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  transactionId: string;
  createdAt: string; // ISO 8601 format
}
```

---

## Implementation Notes

1. **Authentication:** All endpoints except `/auth/login` and `/auth/register` require a valid JWT token in the `Authorization` header.

2. **Quiz Attempts:** Track user attempts using the `maxAttempts` field. Prevent quiz access when attempts are exhausted.

3. **Points Calculation:** Points are awarded based on quiz performance. Consider implementing bonus points for perfect scores or fast completion.

4. **Images:** All image URLs should be valid and accessible. Consider implementing CDN for production.

5. **Timestamps:** All timestamps use ISO 8601 format (e.g., `2024-01-28T10:30:00Z`).

6. **Pagination:** Implement cursor-based or offset-based pagination for large datasets.

---

## Testing the API

### Using cURL

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get quizzes
curl http://localhost:3001/api/quizzes

# Get global rankings
curl http://localhost:3001/api/rankings/global?limit=10
```

### Using Postman

Import the API endpoints into Postman for easier testing. Create a collection with all endpoints and use environment variables for `{{BASE_URL}}` and `{{TOKEN}}`.

---

## Version History

- **v1.0.0** (2024-01-28): Initial release with core features
  - Authentication (login, register, profile management)
  - Quiz packages and questions
  - Quiz submissions and results
  - Rankings system
  - Payment processing
