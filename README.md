# Code Editor

A full-stack web application that allows users to write, edit, save, and execute code directly from their browser. The application includes user authentication, code management, an interactive code editor, and execution history.

## Live Demo

- **Frontend:** [Open the Online Code Editor](https://code-edit-app-six.vercel.app/)
- **Backend:** Deployed on Render
- **Database:** MongoDB Atlas

## Features

- **User Authentication:** Register and log in securely using password-based authentication and token-based sessions.
- **Online Code Editor:** Write and edit code in an interactive browser-based editor powered by CodeMirror.
- **Code Management:** Create, save, update, and delete code files.
- **Code Execution:** Execute code through the Judge0 API and view the resulting output or errors.
- **Execution History:** Review previous execution results associated with code files.
- **Input and Output Panels:** Provide program input and inspect execution results.
- **Protected Routes:** Restrict access to authenticated areas of the application.
- **Cloud Deployment:** Frontend, backend, and database are hosted using separate services.

## Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, HTML, CSS |
| Code Editor | CodeMirror |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcrypt |
| Code Execution | Judge0 API |
| HTTP Requests | Axios |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

## Architecture

The application follows a client-server architecture.

1. The React frontend provides the user interface and code editor.
2. Axios sends authentication, code management, and execution requests to the Express backend.
3. The backend validates requests and interacts with MongoDB Atlas to store application data.
4. Code execution requests are sent to Judge0, and execution results are returned to the frontend.
5. The frontend displays saved files, program output, errors, and execution history.

## Project Structure

```text
Code_Editor-App/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

*Note: Adjust the directory names above to match the actual files in your repository.*

## Getting Started

### Prerequisites

Install or configure the following:

- Node.js and npm
- A MongoDB Atlas account or another accessible MongoDB instance
- A Judge0 API endpoint and credentials, if required by your configuration

### 1. Clone the repository

```bash
git clone https://github.com/AjayKumar366/Code_Edit.git
cd Code_Edit
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and configure the required environment variables.

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
```

Add any Judge0-related environment variables required by your implementation. Use the actual variable names expected by your backend code.

### 3. Start the backend

```bash
npm run dev
```

The backend should start on the configured port, typically `3000` for local development.

### 4. Configure the frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

If your project uses a different environment variable name, use the name configured in `client/src/services/api.js` and your Vite configuration.

### 5. Start the frontend

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal, commonly `http://localhost:5173`.

## Security Considerations

- Passwords should be hashed before storage.
- Protected API endpoints should verify authentication tokens.
- Code-related database operations should verify that the authenticated user owns the requested resource.
- Secrets and database credentials must remain in environment variables and must never be committed to the repository.
- MongoDB access should be restricted to the application's database user and required network access.
- Code execution should be handled by a dedicated execution service rather than directly evaluating untrusted code inside the application server.

## Deployment

The application uses separate services for the frontend, backend, and database.

- **Vercel:** Hosts the React/Vite frontend.
- **Render:** Runs the Node.js/Express backend.
- **MongoDB Atlas:** Stores application data.
- **Judge0:** Handles code execution requests.

Configure the frontend API URL to point to the deployed backend's `/api` endpoint. Set backend environment variables through Render's environment settings, and configure the database network access rules appropriately.

## Future Improvements

Potential enhancements include:

- Automated testing for API endpoints and frontend components.
- Improved execution error reporting and loading states.
- More advanced editor customization and keyboard shortcuts.
- Pagination and filtering for saved files and execution history.
- Rate limiting and additional API security controls.
- Enhanced responsive design and accessibility.

## Author

**Ajay Kumar Kosuru**

GitHub: [AjayKumar366](https://github.com/AjayKumar366)

LinkedIn: [Ajay Kumar Kosuru](https://www.linkedin.com/in/ajay-kumar-kosuru-88862b232/)

---

This project demonstrates full-stack web development concepts, including REST APIs, authentication, database integration, third-party API integration, and cloud deployment.
