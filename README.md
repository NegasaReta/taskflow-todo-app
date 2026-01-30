# TaskFlow - To-Do App

TaskFlow is a modern, full-stack Task Management application designed to help users organize their daily activities efficiently. This project serves as a practical implementation for learning **FastAPI** backend integration with a **React** frontend.

## 🚀 Features

- **User Authentication**: Secure Login and Registration (JWT-based).
- **Task Management**:
  - Create, Read, Update, and Delete (CRUD) tasks.
  - Mark tasks as granularly completed or pending.
- **Filtering & Search**:
  - Filter tasks by status (Completed/Pending).
  - Search tasks by title or description.
  - Sort by priority or due date.
- **Modern UI**: Built with Shadcn UI and Tailwind CSS for a sleek, responsive design.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Forms**: React Hook Form + Zod
- **Routing**: React Router DOM

### Backend (Intended Architecture)
- **Architecture Style**: Layered (Clean-ish) Monolith
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database**: PostgreSQL (via SQLModel / SQLAlchemy)
- **Authentication**: OAuth2 with Password + Bearer (JWT)

### 📚 Recommended Learning Resources
- [Microservices vs Monolith Architecture](https://youtu.be/rv4LlmLmVWk?si=NiRKipzJMMEtxHYU)
- [Monolithic vs Microservices Architecture Explained](https://youtu.be/NdeTGlZ__Do?si=-OsdD60Z53Y08aKB)

This project follows a **Layered Architecture** to maintain a clean separation of concerns while keeping the codebase simple and manageable.

1.  **Presentation Layer (`api/`)**: Handles HTTP requests and responses (Routers).
2.  **Business Logic Layer (`services/`)**: Contains the core business logic, decoupled from the API and DB calls.
3.  **Data Access Layer (`crud/` or repositories)**: Direct database interactions.
4.  **Domain Layer (`models/` & `schemas/`)**: Defines the data structures (SQLModel entities and Pydantic schemas).

## 📂 Project Structure

```bash
taskflow-todo-app/
├── src/                 # Frontend (React)
│   ├── ...
│
└── backend/             # Backend (FastAPI) [Intended Structure]
    ├── app/
    │   ├── api/         # API Routes (v1/endpoints)
    │   ├── core/        # Config, Security, middleware
    │   ├── crud/        # Database CRUD operations
    │   ├── models/      # SQLModel database tables
    │   ├── schemas/     # Pydantic models for Req/Res
    │   ├── services/    # Complex business logic
    │   ├── db/          # Database connection/session
    │   └── main.py      # Application entry point
    └── requirements.txt
```

## 🚦 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **Python**: 3.10 or higher (for the backend)

### Frontend Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd taskflow-todo-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

### Backend Configuration

The frontend is configured to communicate with a backend API at `http://localhost:8000/api/v1` by default. You can customize this by setting the `VITE_API_URL` environment variable.

#### Expected API Endpoints

The backend should implement the following endpoints to work with the frontend:

- **Auth**:
  - `POST /auth/register`: Register a new user
  - `POST /auth/login`: Login and retrieve token
  - `GET /auth/me`: Get current user profile

- **Tasks**:
  - `GET /tasks`: List all tasks (supports filters: status, priority, search)
  - `POST /tasks`: Create a new task
  - `GET /tasks/{id}`: Get a specific task
  - `PUT /tasks/{id}`: Update a task
  - `DELETE /tasks/{id}`: Delete a task

## 🤝 Contributing

This project is for educational purposes. Feel free to fork it and experiment with adding new features!
