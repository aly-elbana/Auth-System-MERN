# Auth and Authorization App

A full-stack authentication and authorization application built with React, Node.js, Express, and MongoDB. This application provides secure user registration, login, email verification, and password reset functionality.

## Features

- **User Authentication**: Secure user registration and login
- **Email Verification**: Email-based account verification system
- **Password Reset**: Forgot password functionality with email reset links
- **Protected Routes**: Route protection based on authentication status
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Real-time Feedback**: Toast notifications for user actions
- **Security**: Rate limiting, JWT tokens, and secure password hashing
- **Database**: MongoDB integration with Mongoose ODM

## Tech Stack

### Frontend

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router DOM** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Mailtrap** - Email service
- **Express Rate Limit** - Rate limiting middleware
- **Morgan** - HTTP request logger

## 📁 Project Structure

```
auth-and-aus-app/
├── backend/
│   ├── server.js                 # Main server file
│   └── src/
│       ├── app.js               # Express app configuration
│       ├── controllers/         # Route controllers
│       ├── middlewares/         # Custom middlewares
│       ├── models/             # Database models
│       ├── routes/              # API routes
│       ├── utils/               # Utility functions
│       └── mailtrap/           # Email configuration
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── store/              # State management
│   │   └── utils/              # Utility functions
├── package.json                   # Root package.json
└── README.md                   # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/auth-and-aus-app.git
   cd auth-and-aus-app
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/auth-app

   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d

   # Server
   PORT=1502
   NODE_ENV=development

   # Email (Mailtrap)
   MAILTRAP_API_TOKEN=your-mailtrap-api-token
   MAILTRAP_INBOX_ID=your-mailtrap-inbox-id

   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the development servers**

   **Backend (Terminal 1):**

   ```bash
   npm run dev
   ```

   **Frontend (Terminal 2):**

   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:1502

## API Endpoints

### Authentication Routes

| Method | Endpoint                          | Description               |
| ------ | --------------------------------- | ------------------------- |
| POST   | `/api/auth/register`              | User registration         |
| POST   | `/api/auth/login`                 | User login                |
| POST   | `/api/auth/verify-email`          | Email verification        |
| POST   | `/api/auth/resend-verification`   | Resend verification email |
| POST   | `/api/auth/forgot-password`       | Request password reset    |
| POST   | `/api/auth/reset-password/:token` | Reset password            |
| POST   | `/api/auth/logout`                | User logout               |
| GET    | `/api/auth/me`                    | Get current user          |

## Configuration

### Database Configuration

The application uses MongoDB. Make sure you have MongoDB running locally or provide a cloud MongoDB connection string in your `.env` file.

### Email Configuration

The app uses Mailtrap for email services. You'll need to:

1. Sign up for a Mailtrap account
2. Get your API token and inbox ID
3. Add them to your `.env` file

### Security Features

- **Rate Limiting**: Prevents brute force attacks
- **JWT Tokens**: Secure authentication
- **Password Hashing**: bcrypt for secure password storage
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Request validation and sanitization

## Frontend Features

### Components

- **Input**: Reusable input component with validation
- **LoadingSpinner**: Loading state component
- **PasswordStrengthMeter**: Password strength indicator
- **FloatingShape**: Animated background elements

### Pages

- **HomePage**: Protected dashboard
- **SignUpPage**: User registration
- **LoginPage**: User authentication
- **EmailVerificationPage**: Email verification
- **ForgotPasswordPage**: Password reset request
- **ResetPasswordPage**: Password reset form

### State Management

The app uses Zustand for state management with the following features:

- Authentication state
- User data management
- Loading states
- Error handling

### Environment Variables for Production

```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRE=7d
PORT=process.env.PORT
NODE_ENV=production
MAILTRAP_API_TOKEN=your-production-mailtrap-token
MAILTRAP_INBOX_ID=your-production-mailtrap-inbox
FRONTEND_URL=your-production-frontend-url
```

### Setup Instructions

1. **MongoDB Atlas**: Create free cluster and get connection string
2. **Mailtrap**: Sign up and get API token + inbox ID
3. **Deploy Backend**: Set environment variables and deploy
4. **Deploy Frontend**: Set build command to `cd frontend && npm run build`
5. **Update URLs**: Update FRONTEND_URL in backend environment variables

⭐ Star this repository if you found it helpful!
