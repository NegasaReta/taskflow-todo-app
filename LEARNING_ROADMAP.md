# 🗺️ FastAPI Learning Roadmap: Building TaskFlow

This roadmap is designed to guide you from a complete beginner to building a production-ready backend for the TaskFlow application. Each step builds upon the previous one.

## Phase 1: The Basics (Your First API)
**Goal:** Understand how FastAPI handles requests and responses.

- [ ] **Step 1.1: Setup & Hello World**
    - Install FastAPI and Uvicorn.
    - Create a simple `main.py` with a root endpoint `/` returning `{"message": "Hello World"}`.
    - Run the server using `uvicorn main:app --reload`.
- [ ] **Step 1.2: Path & Query Parameters**
    - Create an endpoint `GET /tasks/{task_id}` to learn Path Parameters.
    - Create an endpoint `GET /tasks/` that accepts `skip` and `limit` as Query Parameters.

## Phase 2: Data Validation with Pydantic
**Goal:** Ensure data integrity using Python type hints.

- [ ] **Step 2.1: Define Schemas**
    - Create a `schemas` folder (or file).
    - Define a `TaskCreate` model using Pydantic (title, description, etc.).
    - Define a `TaskResponse` model (including `id` and `created_at`).
- [ ] **Step 2.2: Request Body & Response Model**
    - Create a `POST /tasks/` endpoint that accepts `TaskCreate` and returns `TaskResponse`.
    - FastAPI will automatically validate the JSON body against your Pydantic model.

## Phase 3: Database Integration (SQLModel + PostgreSQL)
**Goal:** Persist data using a real database (PostgreSQL).

- [ ] **Step 3.1: Database Setup**
    - Install `psycopg2-binary` and `sqlmodel`.
    - Set up a local PostgreSQL database (or use Docker).
    - Create `database.py` to handle the `engine` and `Session` connecting to Postgres.
- [ ] **Step 3.2: Create Database Models**
    - Create `models.py`.
    - Define a `Task` class inheriting from `SQLModel, table=True`.
- [ ] **Step 3.3: Dependencies**
    - Learn about **Dependency Injection** (`Depends`).
    - Create a `get_session` dependency to manage database sessions per request.

## Phase 4: CRUD Operations (The Core Logic)
**Goal:** Connect your API endpoints to the database.

- [ ] **Step 4.1: Create (POST)**
    - Update `POST /tasks/` to save the Pydantic data into the SQLModel database.
- [ ] **Step 4.2: Read (GET)**
    - Update `GET /tasks/` to fetch a list of tasks from the DB.
    - Update `GET /tasks/{id}` to fetch a single task.
- [ ] **Step 4.3: Update (PUT/PATCH)**
    - Implement `PUT /tasks/{id}` to modify existing tasks.
- [ ] **Step 4.4: Delete (DELETE)**
    - Implement `DELETE /tasks/{id}` to remove tasks.

## Phase 5: Structure & Architecture
**Goal:** Refactor into the "Layered Monolith" structure.

- [ ] **Step 5.1: APIRouter**
    - Move task endpoints to `app/api/endpoints/tasks.py`.
    - Use `APIRouter` to organize routes.
- [ ] **Step 5.2: Service Layer**
    - Move logic from the router to `app/services/task_service.py`.
    - Keep the router focused on validation and HTTP status codes.

## Phase 6: Authentication & Security
**Goal:** Secure your API so only registered users can access tasks.

- [ ] **Step 6.1: User Model & Registration**
    - Create a `User` model.
    - Implement password hashing (using `bcrypt` / `passlib`).
    - Create a `POST /auth/register` endpoint.
- [ ] **Step 6.2: JWT Tokens**
    - Implement `POST /auth/login` to generate an OAuth2 Access Token.
- [ ] **Step 6.3: Protect Endpoints**
    - Create a `get_current_user` dependency.
    - Require this dependency on all Task endpoints so users only see *their* tasks.

## Phase 7: Connecting to React
**Goal:** Make the frontend talk to your backend.

- [ ] **Step 7.1: CORS (Cross-Origin Resource Sharing)**
    - Configure `CORSMiddleware` in `main.py` to allow requests from `localhost:5173`.
- [ ] **Step 7.2: Integration Testing**
    - Run both servers.
    - Verify that the React app shows the tasks from your PostgreSQL database.

## Recommended Resources
- [FastAPI Official Tutorial](https://fastapi.tiangolo.com/tutorial/) (The best source!)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
