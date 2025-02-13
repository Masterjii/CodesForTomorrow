# Robust REST API with Real-Time Updates

This project demonstrates a robust REST API built with Node.js, Express, and TypeScript (or JavaScript) with an emphasis on clean and maintainable code. It includes:

- **JWT-based Authentication & Authorization** with HTTP‑only cookies.
- **Input Validation & Error Handling** for secure data integrity.
- **Database Integration** (using MongoDB with Mongoose in this example; you can adapt it to MySQL/PostgreSQL with Prisma or TypeORM).
- **Caching** for frequently accessed resources.
- **Real-Time Communication** using Socket.IO (with JWT authentication and room-based broadcasting).
- **Single-Session Enforcement** (only one active session per user at a time).

## Features

- **User Registration & Login:** Secure endpoints for creating new users and authenticating.
- **JWT Authentication:** Protect your endpoints and enforce single-session logins.
- **Resource Endpoints:** Create, list, and update resources.
- **Real-Time Updates:** When a resource is updated, connected clients are notified via Socket.IO.
- **Role-Based Authorization:** (Optional) Restrict certain endpoints based on user roles.
- **Caching:** Improve performance by caching frequently accessed resources.

## Tech Stack

- Node.js, Express, TypeScript (or JavaScript)
- MongoDB with Mongoose (or other databases using Prisma/TypeORM)
- Socket.IO for real-time communication
- Redis (optional, for caching)

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Masterjii/CodesForTomorrow.git
   cd CodesForTomorrow
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the project root with the following (adjust values as needed):

   ```ini
   PORT=8080
   MONGO_URI="mongodb://127.0.0.1:27017/CodesForTommorrow"
   JWT_SECRET="d44a1e436c45b90ecd05abff00421bdf97feac78ff6f51b13454eaa777103ad6c2307769b02b03d3c2b1011bf9e7e64e9acee0ce96981cba19c08a96c77f526b1ece80a0537a196be5e549488f631e8d33d38185b5ec1a2b68fba9c23fd21b0b201d043bc3d75d24de409022f426b1124aa705dc826c743ff6672404143be7f7e7dfe7fa14b9ded2580c2584993309655d81ba85cbde7eb8a245712a686f625a0dd728a41638b3ecdc9f97213f1212444509f4858bb9b626a293ad2508702526b90937a320430756d0d08852f443aa0e5ae34a616b0d31dd9059936f839349d03026317e03ee77e7c7edc106f9ed6e85a0ca57cd4f23dd9695c7e0d661c19f6e"
   JWT_EXPIRES_IN="1h"
   REDIS_URL=redis://localhost:6379
   NODE_ENV=development
   ```

4. **Start Your Database Services**

   Make sure MongoDB (and Redis, if used) is running on your system.

5. **Run the Application**

   For development, you can run:

   ```bash
   npm run dev
   ```

   Or in production:

   ```bash
   npm start
   ```

## Project Structure

```
CodesForTomorrow/
├── .env
├── package.json
├── tsconfig.json            // (if using TypeScript)
├── README.md
└── src
    ├── app.js               // Express app setup
    ├── index.js             // Main server file (HTTP + Socket.IO)
    ├── config
    │   └── config.js
    ├── controllers
    │   ├── auth.controller.js
    │   └── resource.controller.js
    ├── db
    │   └── mongoose.js
    ├── middleware
    │   ├── auth.middleware.js
    │   ├── error.middleware.js
    │   └── validateRequest.js
    ├── models
    │   ├── User.js
    │   └── Resource.js
    ├── routes
    │   ├── auth.routes.js
    │   └── resource.routes.js
    └── sockets
        └── socket.js
```

## API Endpoints

### Authentication

- **Register a New User**

  ```
  POST /register
  ```

  **Body:**

  ```json
  {
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "password123",
    "role": "admin"   // optional by default It is a user
  }
  ```

- **User Login**

  ```
  POST /login
  ```

  **Body:**

  ```json
  {
    "email": "testuser@example.com",
    "password": "password123"
  }
  ```

- **User Profile (Protected)**

  ```
  GET /profile
  ```

- **Logout**

  ```
  POST /logout
  ```

### Resource Endpoints

- **Create a Resource**

  ```
  POST /createResources
  ```

  **Body:**

  ```json
  {
    "name": "Sample Resource",
    "description": "This is a sample resource for testing."
  }
  ```

- **List All Resources**

  ```
  GET /getResources
  ```

- **Update a Resource**

  ```
  PUT /updateResources/:id
  ```

  **Body:**

  ```json
  {
    "name": "Updated Resource Name",
    "description": "Updated description for the resource."
  }
  ```

  > **Note:** Use the `_id` from the resource creation or listing endpoint as `:id`.

## Real-Time Communication with Socket.IO

- **Socket.IO Endpoint:**

  The server listens on the same port as the REST API (e.g., `http://localhost:5000`).

- **Connecting to Socket.IO:**

  You can test via Postman’s WebSocket client or a Socket.IO client. Use a URL similar to:

  ```
  ws://localhost:5000/socket.io/?EIO=4&transport=websocket&token=YOUR_JWT_TOKEN&room=resource_<resourceId>
  ```

  Replace:
  - `YOUR_JWT_TOKEN` with a valid JWT from login.
  - `<resourceId>` with the actual resource ID (e.g., `_id` from the resource created).

- **Expected Behavior:**

  - Clients connecting with a valid JWT will be authenticated.
  - When a resource is updated via the REST API, a `resourceUpdated` event is broadcast to the room `resource_<resourceId>`.

## Testing with Postman

Below are sample test cases to verify each functionality:

### Test Case 1: User Registration

- **Endpoint:** `POST /register`
- **Headers:** `Content-Type: application/json`
- **Body:**

  ```json
  {
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "password123"
  }
  ```

- **Expected Outcome:**  
  - HTTP 201 Created  
  - Response message indicating successful registration.

### Test Case 2: User Login & Single-Session Enforcement

- **Endpoint:** `POST /login`
- **Headers:** `Content-Type: application/json`
- **Body:**

  ```json
  {
    "email": "testuser@example.com",
    "password": "password123"
  }
  ```

- **Expected Outcome:**  
  - HTTP 200 OK with a JWT token.  
  - The token is also set as an HTTP‑only cookie.  
  - Test single-session by logging in from two separate clients and confirming that the first token becomes invalid.

### Test Case 3: Protected Endpoint (User Profile)

- **Endpoint:** `GET /profile`
- **Expected Outcome:**  
  - HTTP 200 OK with user profile data when accessed with a valid token.
  - HTTP 401 Unauthorized if the token is missing or invalid.

### Test Case 4: Resource Creation & Listing

- **Create Resource:**

  ```
  POST /createResources
  ```

  **Body:**

  ```json
  {
    "name": "Sample Resource",
    "description": "This is a sample resource for testing."
  }
  ```

  **Expected Outcome:**  
  - HTTP 201 Created  
  - Response includes the created resource object (note the `_id` field).

- **List Resources:**

  ```
  GET /getResources
  ```

  **Expected Outcome:**  
  - HTTP 200 OK with an array of resources (each including their `_id`).

### Test Case 5: Resource Update & Real-Time Broadcast

- **Update Resource:**

  ```
  PUT /updateResources/:id
  ```

  **Body:**

  ```json
  {
    "name": "Updated Resource Name",
    "description": "Updated description for the resource."
  }
  ```

  **Expected Outcome:**  
  - HTTP 200 OK with the updated resource data.
  - Connected Socket.IO clients in room `resource_<id>` should receive a `resourceUpdated` event with the updated data.

### Test Case 6: Real-Time Communication via WebSocket

1. **Open Postman’s WebSocket Client:**
   - Click **New** > **WebSocket Request**.
2. **Connect using the URL:**

   ```
   ws://localhost:5000/socket.io/?EIO=4&transport=websocket&token=YOUR_JWT_TOKEN&room=resource_<resourceId>
   ```

3. **Send a Test Message:**

   ```json
   {
     "event": "clientMessage",
     "data": "Hello from Postman WebSocket!"
   }
   ```

4. **Expected Outcome:**
   - The server logs the message and broadcasts it as a `serverMessage` event.
   - You should see the broadcasted message in the WebSocket client console.

## Additional Notes

- **Environment Variables:** Ensure the `.env` file is correctly set before starting the server.
- **Caching:** If caching is implemented, repeated requests to certain endpoints should show improved performance.
- **Role-Based Authorization:** If you have role-based endpoints, update the user role in the database and test access restrictions accordingly.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Contact

For questions or support, please open an issue on GitHub or contact balramkushram120@gmail.com.
```

---

This `README.md` file provides a complete overview of how to set up the project, describes the endpoints and real-time features, and includes detailed test cases to verify all functionalities using Postman (and WebSocket testing in Postman).

Feel free to modify or expand this document based on your project’s specifics and requirements.
