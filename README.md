# Limbic Fullstack Code Challenge

This is Limbic's FullStack Challenge that combines bits from the frontend and backend challenges in one.

Jane is a clinical therapist and wants her clients to answer simple questionnaires in order to better understand them. She needs a way to add/delete/edit questions and also see the answers of each client.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)

## Setup Instructions

### Prerequisites

- Node.js
- pnpm (preferred package manager)

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```sh
   pnpm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `backend` directory and add the following environment variables:
     ```env
     PORT=<your-backend-port>
     MONGODB_URI=<your-mongodb-uri>
     ```
   - Create a `.env` file in the `frontend` directory and add the following environment variables:
     ```env
     PORT=<your-frontend-port>
     REACT_APP_API_URL=<your-backend-api-url>
     ```

### Running the Application

1. Start the backend server:
   ```sh
   pnpm start-backend
   ```

2. Start the frontend application:
   ```sh
   pnpm start-client
   ```

## Scripts

- `pnpm start-backend`: Starts the backend server.
- `pnpm start-frontend`: Starts the frontend application.
- `pnpm start`: Starts both the backend and frontend concurrently.
- `pnpm test-backend`: Runs tests for the backend.
- `pnpm test-frontend`: Runs tests for the frontend.
- `pnpm test`: Runs tests for both backend and frontend.

## Project Structure

### Backend

```plaintext
backend/
├── api/
│   ├── trpc.ts
│   ├── questions.ts
│   ├── users.ts
│   ├── answers.ts
│   ├── questions.test.ts
│   ├── users.test.ts
│   ├── answers.test.ts
├── config/
│   └── index.ts
├── db/
│   ├── index.ts
│   ├── queries/
│   │   ├── questions.ts
│   │   ├── users.ts
│   │   ├── answers.ts
├── models/
│   ├── questions.ts
│   ├── users.ts
│   ├── answers.ts
├── server.ts
├── jest.config.ts
├── package.json
└── tsconfig.json
```

### Frontend

```plaintext
frontend/
├── src/
│   ├── @/
│   │   ├── components/
│   │   │   ├── App/
│   |   │   │   ├── App.tsx
│   │   │   │   ├── App.test.tsx
│   │   │   ├── Home/
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Home.test.tsx
│   │   │   ├── Questions/
│   │   │   │   ├── Questions.tsx
│   │   │   │   ├── Questions.test.tsx
│   │   │   ├── User/
│   │   │   │   ├── User.tsx
│   │   │   │   ├── User.test.tsx
│   │   │   ├── Users/
│   │   │   │   ├── Users.tsx
│   │   │   │   ├── Users.test.tsx
│   │   │   ├── ui/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── textarea.tsx
│   ├── api/
│   │   ├── trpcClient.ts
│   ├── index.tsx
│   ├── index.css
│   ├── setupTests.ts
│   ├── types.ts
├── public/
│   ├── index.html
├── package.json
├── tsconfig.json
├── craco.config.ts
├── tailwind.config.js
└── components.json
```

## Technologies Used

- **Backend:**
  - Node.js
  - Express.js
  - TypeScript
  - tRPC
  - Mongoose
  - Jest

- **Frontend:**
  - React
  - TypeScript
  - React Query
  - React Router
  - Tailwind CSS
  - shadcn
  - CRACO
