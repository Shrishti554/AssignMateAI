# AI Ticket Assistant

A full-stack application for AI-powered ticket management system.

## Project Structure

This is a monorepo containing both the backend and frontend applications:

```
ai-ticket-assistant/
├── ai-ticket-assistant/     # Backend (Node.js/Express)
│   ├── controllers/         # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── utils/              # Utility functions
│   ├── inngest/            # Inngest functions
│   └── package.json        # Backend dependencies
└── ai-ticket-frontend/     # Frontend (React/Vite)
    ├── src/                # Source code
    ├── public/             # Static assets
    └── package.json        # Frontend dependencies
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd ai-ticket-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.sample`

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ai-ticket-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- User authentication and authorization
- Ticket creation and management
- AI-powered ticket processing
- Email notifications
- Real-time updates

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Inngest for background jobs
- Nodemailer for emails

### Frontend
- React
- Vite
- Modern JavaScript/JSX

## Development

Both applications can be run simultaneously during development. The backend typically runs on port 3000 and the frontend on port 5173 (Vite default).
