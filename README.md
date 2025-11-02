# Social Media Application

A full-stack social media application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- **User Authentication**
  - Sign up with name, email, and password
  - Login with email and password
  - Protected routes for authenticated users
  - JWT-based authentication

- **Post Management**
  - Create posts with text content and optional image URLs
  - View all posts in the feed
  - Filter between all posts and user's own posts
  - Like/unlike posts
  - Add comments to posts
  - Edit and delete your own posts
  - Real-time error handling and success notifications

- **User Interface**
  - Clean and modern design
  - Responsive layout
  - Loading states and error handling
  - Image preview for post creation
  - User-friendly notifications using toast messages

## Project Structure

```
client/                 # Frontend React application
├── src/
│   ├── components/    # React components
│   ├── context/       # Context providers
│   ├── services/      # API service functions
│   └── assets/        # Static assets
└── public/            # Public assets

server/                 # Backend Node.js application
├── config/            # Configuration files
├── controllers/       # Route controllers
├── middleware/        # Custom middleware
├── models/           # Database models
└── routes/           # API routes
```

## Technologies Used

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Axios for API requests
- React Hot Toast for notifications
- CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

4. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=4000
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd server
   npm start
   ```

2. In a new terminal, start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```

3. Visit `http://localhost:5173` in your browser to use the application.

## API Endpoints

### Authentication
- `POST /api/v1/signup` - Register a new user
- `POST /api/v1/login` - Login user

### Posts
- `GET /api/v1/post` - Get all posts
- `GET /api/v1/post/user/:userId` - Get posts by user ID
- `POST /api/v1/post` - Create a new post
- `POST /api/v1/post/:postId/like` - Like/unlike a post
- `POST /api/v1/post/:postId/comment` - Add a comment to a post
- `PUT /api/v1/post/:postId` - Update a post
- `DELETE /api/v1/post/:postId` - Delete a post

## License

[MIT License](LICENSE)