# FastAPI and Backend Development: Core Concepts Guide

**A comprehensive reference document covering API fundamentals, architecture patterns, and backend development best practices**

---

## Table of Contents

1. [API Definition and Importance](#api-definition-and-importance)
2. [Architecture Patterns](#architecture-patterns)
3. [RESTful API Definition and Comparison](#restful-api-definition-and-comparison)
4. [HTTP Methods and Status Codes](#http-methods-and-status-codes)
5. [Authentication and Authorization](#authentication-and-authorization)
6. [Database Design Fundamentals](#database-design-fundamentals)
7. [Scalability and Performance](#scalability-and-performance)
8. [Testing and Quality Assurance](#testing-and-quality-assurance)

---

## API Definition and Importance

### What is an API?

An **Application Programming Interface (API)** is a set of rules, protocols, and tools that specifies how software components should interact. It defines the contract between different applications, allowing them to communicate and exchange data in a standardized way.

**Analogy:** Think of an API as a restaurant menu. You (the client) don't need to know how the kitchen works (the server implementation). You simply order from the menu (API endpoints), and the restaurant delivers your food (response). The menu is the interface between you and the kitchen's internal workings.

### Key Components of an API

1. **Endpoint** - A specific URL where an API service can be accessed
   - Example: `GET /api/v1/tasks/5`
   - Structure: `[Protocol]://[Domain]:[Port]/[Path]/[Resource]`

2. **Request** - Data sent from client to server
   - Contains: Method, Headers, Path/Query Parameters, Body

3. **Response** - Data sent from server back to client
   - Contains: Status Code, Headers, Response Body (usually JSON)

4. **Resource** - An entity that the API manages
   - Examples: Tasks, Users, Products, Orders

### Why APIs Are Important

#### 1. **Separation of Concerns**
- Backend developers focus on business logic and data management
- Frontend developers focus on user interface and user experience
- They communicate through a well-defined interface

#### 2. **Scalability**
- Different components can be scaled independently
- Frontend can be served from CDN
- Backend can be scaled horizontally with load balancers
- Database can be optimized separately

#### 3. **Reusability**
- Same API can serve multiple clients (web, mobile, desktop)
- Reduces code duplication
- Consistent business logic across all platforms

#### 4. **Third-party Integration**
- External developers can build integrations
- Enables ecosystem of complementary services
- Examples: Payment processors, analytics tools, social media platforms

#### 5. **Testing and Maintenance**
- Easier to test isolated components
- Clear contracts make debugging easier
- Versioning allows gradual updates without breaking clients

#### 6. **Security and Access Control**
- Centralized authentication and authorization
- Easier to implement security policies
- Can track and audit API usage

### Example: How APIs Work in TaskFlow Application

```
User (Frontend)
    ↓
[Button Click: "Create Task"]
    ↓
Frontend JavaScript
    ↓
HTTP Request: POST /api/v1/tasks/
    ↓
FastAPI Server
    ↓
Pydantic Validation
    ↓
Business Logic (Service Layer)
    ↓
Database Query
    ↓
PostgreSQL Database
    ↓
Response: {"id": 1, "title": "Learn FastAPI", ...}
    ↓
Frontend React Component
    ↓
[Display: "Task created successfully!"]
```

---

## Architecture Patterns

### What is Software Architecture?

Software architecture is the high-level design of a system that defines:
- How components are organized
- How components interact with each other
- The overall structure and principles guiding the system

Good architecture enables:
- **Scalability** - Easy to handle more users/data
- **Maintainability** - Easy to understand and modify code
- **Reliability** - Systems function correctly and recover from failures
- **Performance** - Systems respond quickly to requests

### Monolithic Architecture

#### Definition

A **monolith** is a single, unified codebase where all components (API, business logic, database access, UI) are tightly coupled and deployed as one unit.

#### Structure

```
Monolithic Application
├── Frontend Code
├── Backend API
├── Business Logic
├── Database Access
├── Authentication
└── All deployed as single unit
```

#### Characteristics

| Aspect | Details |
|--------|---------|
| **Codebase** | Single repository, single programming language |
| **Deployment** | All code deployed together (all-or-nothing) |
| **Scaling** | Entire application scaled as one unit |
| **Database** | Typically one shared database |
| **Technology Stack** | Limited to primary language choice |
| **Team Structure** | Single team managing entire application |

#### Advantages

✅ **Simple to develop initially**
- Single codebase, easier to understand initially
- Straightforward debugging and testing
- All dependencies in one place

✅ **Better performance for small-medium systems**
- No network latency between components
- Shared memory for in-process communication
- Easier to optimize database queries

✅ **Easier deployment setup**
- Single deployment process
- No distributed system complexity
- Simpler configuration management

✅ **ACID transactions**
- Database transactions span multiple operations
- Strong consistency guarantees

#### Disadvantages

❌ **Scaling challenges**
- Must scale entire application, not individual components
- One heavy task slows down the whole system
- Resource waste (scaling API when only database needs it)

❌ **Technology lock-in**
- Difficult to adopt new technologies
- All code must use same language/framework
- Upgrading frameworks affects entire system

❌ **Development bottlenecks**
- Teams step on each other's toes
- Difficult to have independent release cycles
- One team's code change can break everything

❌ **High failure impact**
- One bug can bring down entire system
- No fault isolation
- Recovery requires full system restart

❌ **Maintenance difficulty**
- Large codebase becomes difficult to understand
- Changes have ripple effects
- Difficult to identify responsible team

#### Example: TaskFlow as Monolith

```python
# Single main.py running everything
app = FastAPI()

# All routes in one application
@app.post("/tasks/")
def create_task(...):
    # Business logic here
    # Database access here
    # Authentication here
    # Validation here

# Problems when app grows:
# - Adding new features affects existing code
# - Can't scale task management independently
# - Can't use different database for user profiles
# - One slow endpoint slows entire system
```

#### When to Use Monolith

- **Small projects** with 1-3 developers
- **Early-stage startups** with MVP requirements
- **Simple CRUD applications** with limited complexity
- **High-performance needs** where latency must be minimized
- **Tight ACID transaction requirements**

---

### Microservices Architecture

#### Definition

**Microservices** is an architectural approach where a large application is broken into small, independent services that communicate over the network. Each service handles a specific business capability.

#### Structure

```
Microservices Application
├── API Gateway
│   └── Routes requests to appropriate service
├── User Service
│   ├── Handles authentication, user profiles
│   └── User Database
├── Task Service
│   ├── Handles task management
│   └── Task Database
├── Notification Service
│   ├── Sends emails, notifications
│   └── Notification Queue
└── Analytics Service
    ├── Tracks user behavior
    └── Analytics Database
```

#### Characteristics

| Aspect | Details |
|--------|---------|
| **Codebase** | Multiple repositories, independent codebases |
| **Deployment** | Each service deployed independently |
| **Scaling** | Individual services scaled based on demand |
| **Database** | Each service owns its database (database per service) |
| **Technology Stack** | Different services can use different languages |
| **Team Structure** | Independent teams per service (2-pizza teams) |
| **Communication** | REST APIs, message queues, RPC calls |

#### Advantages

✅ **Independent scalability**
- Scale only the service under load
- Task service receives more traffic? Scale only it
- Efficient resource utilization

✅ **Technology flexibility**
- User service can be Python with FastAPI
- Payment service can be Go for performance
- Frontend can be React or Vue independently

✅ **Independent deployment**
- Deploy task service without affecting user service
- Faster iteration and deployment cycles
- Can rollback individual services

✅ **Organizational alignment**
- Teams own services end-to-end
- Clear responsibility and ownership
- Easier parallel development

✅ **Resilience and fault isolation**
- One failing service doesn't crash entire system
- Can implement circuit breakers and retries
- Graceful degradation possible

✅ **Easier to understand and modify**
- Smaller codebases, easier to comprehend
- Changes have limited scope
- Easier to identify and fix bugs

#### Disadvantages

❌ **Operational complexity**
- Requires sophisticated infrastructure
- Monitoring and logging across services (distributed tracing)
- Need for container orchestration (Kubernetes)
- Configuration management challenges

❌ **Network latency**
- Inter-service communication over network
- Higher latency than in-process calls
- Increased bandwidth usage
- Timeout and retry logic needed

❌ **Data consistency challenges**
- No ACID transactions across services
- Eventual consistency model required
- Distributed transactions are complex
- Data duplication across services

❌ **Testing complexity**
- Integration testing requires multiple services
- End-to-end testing more challenging
- Debugging production issues harder

❌ **Network unreliability**
- Network can fail, partition, or be slow
- Requires defensive programming (circuit breakers, timeouts)
- Handling partial failures is complex

❌ **Increased development overhead**
- Need for service-to-service communication
- Need for API versioning and compatibility
- Logging and monitoring across services

#### Example: TaskFlow as Microservices

```python
# Service 1: User Service (port 8001)
from fastapi import FastAPI
app_user = FastAPI()

@app_user.post("/api/v1/users/register")
def register_user(email: str, password: str):
    # Handles user registration only
    # Has its own database
    pass

# Service 2: Task Service (port 8002)
app_task = FastAPI()

@app_task.post("/api/v1/tasks/")
def create_task(task: TaskCreate, user_id: int):
    # Calls user service to verify user exists
    response = httpx.get("http://user-service:8001/api/v1/users/{user_id}")
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="User not found")
    
    # Creates task in its own database
    pass

# Benefits:
# - Can scale task service if many tasks being created
# - Can use different database for tasks vs users
# - User service team can deploy independently
# - Easier to understand each service
```

---

### Comparison: Monolith vs Microservices

| Aspect | Monolith | Microservices |
|--------|----------|---------------|
| **Initial development time** | Faster ⚡ | Slower 🐢 |
| **Deployment** | Simple, all-or-nothing | Complex, independent |
| **Scaling** | Horizontal (whole app) | Granular (per service) |
| **Database** | Shared, easier ACID | Per-service, eventual consistency |
| **Technology flexibility** | Limited | High |
| **Debugging** | Easier | Harder (distributed) |
| **Team independence** | Low | High |
| **Operational complexity** | Low | High |
| **Network latency** | No network calls | Multiple network hops |
| **Best for** | Startups, MVPs, simple apps | Large, complex systems |

---

## RESTful API Definition and Comparison

### What is REST?

**REST (Representational State Transfer)** is an architectural style for designing networked applications. It uses HTTP as a stateless, client-server protocol where:

- Resources are identified by URLs
- HTTP methods represent actions on resources
- Responses are typically JSON representations of resources
- Each request contains all necessary information

#### Core REST Principles

1. **Client-Server Architecture**
   - Clear separation between client and server
   - Client doesn't need to know server implementation
   - Server doesn't store client context

2. **Statelessness**
   - Each request is independent
   - Server doesn't store client session state (except in database)
   - Client includes all necessary information in request
   - Enables horizontal scaling (any server can handle any request)

3. **Resource-Based**
   - Everything is a resource (users, tasks, comments)
   - Resources identified by URLs (nouns, not verbs)
   - `GET /api/tasks` (correct - noun)
   - `GET /api/getTasks` (wrong - verb)

4. **HTTP Methods (Verbs)**
   - GET - Retrieve resource
   - POST - Create resource
   - PUT - Replace resource
   - PATCH - Partial update
   - DELETE - Remove resource

5. **Representations**
   - Resources can have multiple representations (JSON, XML, CSV)
   - Client specifies desired format (usually JSON)
   - Server returns resource state in that format

### RESTful URL Conventions

#### Correct REST URLs

```
# Collection of tasks
GET    /api/v1/tasks              # List all tasks
POST   /api/v1/tasks              # Create new task

# Specific task resource
GET    /api/v1/tasks/5            # Get task with ID 5
PUT    /api/v1/tasks/5            # Replace task 5 entirely
PATCH  /api/v1/tasks/5            # Partially update task 5
DELETE /api/v1/tasks/5            # Delete task 5

# Nested resources
GET    /api/v1/users/1/tasks      # Get all tasks for user 1
GET    /api/v1/users/1/tasks/5    # Get task 5 for user 1
```

#### Incorrect (RPC-style) URLs

```
# ❌ These use verbs instead of nouns
GET /api/getTasks
GET /api/createTask
GET /api/updateTask?id=5
GET /api/deleteTask?id=5

# These are function calls, not resource operations
# Not REST compliant
```

### REST Request/Response Format

#### Example Request

```http
POST /api/v1/tasks HTTP/1.1
Host: localhost:8000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "title": "Learn FastAPI",
  "description": "Complete the 14-day roadmap",
  "priority": 1
}
```

#### Example Response

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/v1/tasks/42

{
  "id": 42,
  "title": "Learn FastAPI",
  "description": "Complete the 14-day roadmap",
  "priority": 1,
  "is_completed": false,
  "created_at": "2026-01-30T16:18:00Z",
  "updated_at": "2026-01-30T16:18:00Z"
}
```

### Comparison: REST vs Other API Styles

#### 1. REST vs RPC (Remote Procedure Call)

**RPC Style (❌ Old approach)**
```
GET /api/getTask?id=5
GET /api/updateTask?id=5&title=New+Title
POST /api/deleteTask
```
- Treats API like function calls
- Actions in URL (verbs)
- Not scalable, not web-friendly

**REST Style (✅ Modern approach)**
```
GET /api/tasks/5
PUT /api/tasks/5
DELETE /api/tasks/5
```
- Treats API like resource management
- Resources in URL (nouns)
- Scalable, web-friendly, cacheable

#### 2. REST vs GraphQL

| Aspect | REST | GraphQL |
|--------|------|---------|
| **Query language** | HTTP methods | Query language |
| **Over-fetching** | Common (get extra fields) | Eliminated (request exact fields) |
| **Under-fetching** | Common (need multiple requests) | Eliminated (single request gets related data) |
| **Caching** | Easy (HTTP cache) | Harder (POST requests) |
| **Learning curve** | Lower | Steeper |
| **URL structure** | Semantic URLs | Single endpoint usually |
| **Complexity** | Simple | More complex |
| **Best for** | Simple CRUD apps | Complex data relationships |

**Example:**

```javascript
// REST - Over-fetching (get all fields you don't need)
GET /api/tasks/5
Response: {
  "id": 5,
  "title": "Learn FastAPI",
  "description": "...",
  "priority": 1,
  "is_completed": false,
  "created_at": "...",
  "updated_at": "...",
  "user_id": 1,
  "team_id": 3,
  // ... many more fields
}

// REST - Under-fetching (need multiple requests)
GET /api/tasks/5
GET /api/users/1
GET /api/teams/3

// GraphQL - Get exactly what you need
POST /api/graphql
Query: {
  task(id: 5) {
    title
    priority
    user { name }
    team { name }
  }
}
```

#### 3. REST vs SOAP

| Aspect | REST | SOAP |
|--------|------|------|
| **Protocol** | HTTP (GET, POST, etc.) | HTTP with XML envelopes |
| **Message format** | JSON, XML, plain text | XML (strict) |
| **Complexity** | Simple | Complex |
| **Caching** | Supports HTTP caching | Limited caching |
| **Learning curve** | Easy | Steep |
| **Security** | HTTPS + tokens | WS-Security (built-in) |
| **Best for** | Web APIs, modern apps | Enterprise systems |

#### 4. REST vs WebSockets

| Aspect | REST | WebSockets |
|--------|------|-----------|
| **Communication** | Request-response (one-way) | Bidirectional (two-way) |
| **Persistence** | Stateless | Persistent connection |
| **Real-time** | Polling needed | Native real-time |
| **Use case** | CRUD operations | Chat, notifications, live updates |
| **Overhead** | HTTP headers each request | Low per-message overhead |

### REST Best Practices

#### 1. **Use Appropriate HTTP Status Codes**

```python
# Success
200 OK - Request succeeded, returning data
201 Created - Resource created successfully
204 No Content - Request succeeded, no body to return

# Client errors
400 Bad Request - Invalid request format
401 Unauthorized - Missing/invalid authentication
403 Forbidden - Authenticated but not authorized
404 Not Found - Resource doesn't exist
409 Conflict - Request conflicts with current state

# Server errors
500 Internal Server Error - Unexpected server error
503 Service Unavailable - Server temporarily down
```

#### 2. **Use Consistent Naming**

```python
# ✅ Good - Consistent, predictable
GET /api/v1/tasks
GET /api/v1/tasks/5
GET /api/v1/users/1/tasks

# ❌ Bad - Inconsistent
GET /api/v1/task-list
GET /api/v1/singleTask/5
GET /api/users/{userId}/task-items
```

#### 3. **Use Pagination for Large Datasets**

```python
# ✅ Good - Efficient
GET /api/v1/tasks?skip=0&limit=10
GET /api/v1/tasks?page=1&per_page=10

# ❌ Bad - Returns everything, slow
GET /api/v1/tasks
```

#### 4. **Use Versioning**

```python
# ✅ Good - Allows updates without breaking clients
GET /api/v1/tasks
GET /api/v2/tasks  # New version with different structure

# ❌ Bad - No way to update API
GET /api/tasks
```

#### 5. **Use Filtering and Sorting**

```python
# ✅ Good - Efficient filtering
GET /api/v1/tasks?priority=1&is_completed=false&sort_by=created_at

# ❌ Bad - Gets everything, client filters
GET /api/v1/tasks
```

---

## HTTP Methods and Status Codes

### HTTP Methods (Verbs)

#### GET - Retrieve Data

**Purpose:** Fetch resource(s) from server

```python
@app.get("/api/v1/tasks")
def list_tasks(skip: int = 0, limit: int = 10):
    """Retrieve list of tasks with pagination"""
    pass

@app.get("/api/v1/tasks/{task_id}")
def get_task(task_id: int):
    """Retrieve specific task by ID"""
    pass
```

**Characteristics:**
- Safe (doesn't modify data)
- Idempotent (multiple calls return same result)
- Cacheable
- No request body (typically)

#### POST - Create Resource

**Purpose:** Create new resource on server

```python
@app.post("/api/v1/tasks", status_code=201)
def create_task(task: TaskCreate):
    """Create new task"""
    pass
```

**Characteristics:**
- Not safe (modifies data)
- Not idempotent (multiple calls create multiple resources)
- Not cacheable
- Has request body

#### PUT - Replace Resource

**Purpose:** Replace entire resource

```python
@app.put("/api/v1/tasks/{task_id}")
def update_task(task_id: int, task_update: TaskUpdate):
    """Replace entire task"""
    pass
```

**Characteristics:**
- Not safe (modifies data)
- Idempotent (multiple calls have same effect)
- Request body required
- Replaces all fields

#### PATCH - Partial Update

**Purpose:** Partially update resource

```python
@app.patch("/api/v1/tasks/{task_id}")
def patch_task(task_id: int, task_update: TaskPartialUpdate):
    """Update specific fields of task"""
    pass
```

**Characteristics:**
- Not safe (modifies data)
- Not idempotent (multiple calls might have different effects)
- Request body required
- Updates only provided fields

#### DELETE - Remove Resource

**Purpose:** Delete resource from server

```python
@app.delete("/api/v1/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    """Delete task"""
    pass
```

**Characteristics:**
- Not safe (modifies data)
- Idempotent (multiple calls have same effect)
- No request body
- Returns 204 No Content

### HTTP Status Codes

#### 2xx Success Codes

| Code | Name | When to use |
|------|------|------------|
| 200 | OK | Request succeeded, returning data |
| 201 | Created | Resource created successfully |
| 202 | Accepted | Request accepted, processing async |
| 204 | No Content | Request succeeded, no data to return |
| 206 | Partial Content | Returning partial content (for ranges) |

#### 3xx Redirection Codes

| Code | Name | When to use |
|------|------|------------|
| 301 | Moved Permanently | Resource moved permanently |
| 302 | Found | Resource temporarily at different URL |
| 304 | Not Modified | Cached response still valid |

#### 4xx Client Error Codes

| Code | Name | When to use |
|------|------|------------|
| 400 | Bad Request | Invalid request format/parameters |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 405 | Method Not Allowed | HTTP method not supported |
| 409 | Conflict | Request conflicts with current state |
| 422 | Unprocessable Entity | Request format valid but validation failed |
| 429 | Too Many Requests | Rate limit exceeded |

#### 5xx Server Error Codes

| Code | Name | When to use |
|------|------|------------|
| 500 | Internal Server Error | Unexpected server error |
| 501 | Not Implemented | Feature not implemented |
| 503 | Service Unavailable | Server temporarily down |

### Example: Proper Status Code Usage

```python
from fastapi import HTTPException

@app.post("/api/v1/tasks", status_code=201)
def create_task(task: TaskCreate):
    # 201 Created - new resource created
    db_task = Task(**task.dict())
    db.add(db_task)
    db.commit()
    return db_task

@app.get("/api/v1/tasks/{task_id}")
def get_task(task_id: int):
    task = db.get(Task, task_id)
    if not task:
        # 404 Not Found
        raise HTTPException(status_code=404, detail="Task not found")
    # 200 OK (implicit)
    return task

@app.delete("/api/v1/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    task = db.get(Task, task_id)
    if not task:
        # 404 Not Found
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(task)
    db.commit()
    # 204 No Content - deletion successful, no body returned

@app.post("/api/v1/auth/register")
def register_user(user: UserCreate):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        # 409 Conflict - resource already exists
        raise HTTPException(status_code=409, detail="Email already registered")
    
    # ... create user ...
    return user
```

---

## Authentication and Authorization

### Authentication vs Authorization

**Authentication:** Verifying WHO the user is
- "Are you who you claim to be?"
- Username and password verification
- Multi-factor authentication

**Authorization:** Verifying WHAT the user can do
- "Are you allowed to do this?"
- Access control lists
- Role-based permissions

### Authentication Methods

#### 1. **Session-Based Authentication**

**How it works:**
1. User sends credentials to server
2. Server verifies credentials
3. Server creates session and stores in memory/database
4. Server sends back session ID (in cookie)
5. Client includes session ID with each request
6. Server looks up session for each request

```python
# Example (simplified)
@app.post("/login")
def login(email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create session
    session_id = str(uuid.uuid4())
    sessions[session_id] = {"user_id": user.id, "created_at": time.time()}
    
    # Send session ID in cookie
    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie("session_id", session_id)
    return response

@app.get("/tasks")
def get_tasks(session_id: str = Cookie(None)):
    if session_id not in sessions:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    user_id = sessions[session_id]["user_id"]
    tasks = db.query(Task).filter(Task.user_id == user_id).all()
    return tasks
```

**Advantages:**
- Server maintains control
- Can revoke access immediately
- Can update user permissions immediately

**Disadvantages:**
- Server-side storage required
- Difficult to scale across servers
- Not suitable for microservices

#### 2. **Token-Based Authentication (JWT)**

**How it works:**
1. User sends credentials to server
2. Server verifies credentials
3. Server creates JWT token (signed with secret key)
4. Token contains user information and expiration
5. Client includes token with each request
6. Server verifies token signature (no database lookup needed)

```python
from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/login")
def login(email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create JWT token
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(hours=24)
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/tasks")
def get_tasks(token: str = Depends(get_current_user)):
    # get_current_user dependency verifies token
    tasks = db.query(Task).filter(Task.user_id == token.user_id).all()
    return tasks
```

**Token Structure:**
```
Header.Payload.Signature

Header:    {"alg": "HS256", "typ": "JWT"}
Payload:   {"sub": "1", "user_id": 1, "exp": 1234567890, "iat": 1234567000}
Signature: HMACSHA256(header.payload, "your-secret-key")
```

**Advantages:**
- Stateless (no server-side storage)
- Scalable across servers/microservices
- Mobile-friendly
- Can be self-contained

**Disadvantages:**
- Can't revoke tokens before expiration
- Token size is larger than session ID
- Security depends on secret key

### Authorization Patterns

#### 1. **Role-Based Access Control (RBAC)**

Users have roles, roles have permissions

```python
class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"
    VIEWER = "viewer"

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str
    role: UserRole = UserRole.USER  # Default role

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@app.delete("/api/v1/users/{user_id}")
def delete_user(user_id: int, admin: User = Depends(require_admin)):
    # Only admins can delete users
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}
```

#### 2. **Resource-Based Access Control (RBAC)**

Users have ownership or permissions on specific resources

```python
def check_task_ownership(task_id: int, current_user: User = Depends(get_current_user)):
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if task.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this task")
    
    return task

@app.put("/api/v1/tasks/{task_id}")
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    task: Task = Depends(check_task_ownership)
):
    # Only task owner can update
    for key, value in task_update.dict(exclude_unset=True).items():
        setattr(task, key, value)
    
    db.add(task)
    db.commit()
    return task
```

---

## Database Design Fundamentals

### Relational Databases

Databases that organize data into tables with relationships between them.

### Normalization

Process of organizing database to minimize redundancy and improve data integrity.

#### 1st Normal Form (1NF)
- All values atomic (no repeating groups)
- No repeating columns

#### 2nd Normal Form (2NF)
- Meets 1NF
- Non-key attributes depend on entire primary key

#### 3rd Normal Form (3NF)
- Meets 2NF
- No transitive dependencies

### Example: TaskFlow Database Design

```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    username: str = Field(unique=True, index=True)
    hashed_password: str
    created_at: datetime
    
    # Relationship
    tasks: List["Task"] = Relationship(back_populates="user")

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    priority: int = 1
    is_completed: bool = False
    
    # Foreign key
    user_id: int = Field(foreign_key="user.id")
    created_at: datetime
    updated_at: datetime
    
    # Relationship
    user: User = Relationship(back_populates="tasks")
```

### Database Relationships

#### One-to-Many
- One user has many tasks
- Most common relationship

#### Many-to-Many
- Many tasks can have many assignees
- Requires junction table

```python
class TaskAssignee(SQLModel, table=True):
    task_id: int = Field(foreign_key="task.id", primary_key=True)
    user_id: int = Field(foreign_key="user.id", primary_key=True)
```

#### One-to-One
- One user has one profile
- Less common

### Indexes

Database structures that speed up queries

```python
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)  # Index for fast lookup
    username: str = Field(unique=True, index=True)
```

**When to index:**
- Primary keys (automatic)
- Foreign keys
- Frequently filtered columns
- Frequently sorted columns

---

## Scalability and Performance

### Caching

Storing frequently accessed data in fast memory

#### 1. **Database Query Caching**

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_user_tasks(user_id: int):
    # Results cached, won't hit database multiple times
    return db.query(Task).filter(Task.user_id == user_id).all()
```

#### 2. **HTTP Caching**

```python
from fastapi import Header

@app.get("/api/v1/tasks/{task_id}")
def get_task(
    task_id: int,
    response: Response,
    if_none_match: Optional[str] = Header(None)
):
    task = db.get(Task, task_id)
    
    # Set cache headers
    response.headers["Cache-Control"] = "public, max-age=300"  # 5 minutes
    response.headers["ETag"] = f'"{hash(task)}"'
    
    return task
```

#### 3. **Redis Caching**

```python
import redis

redis_client = redis.Redis(host='localhost', port=6379, db=0)

@app.get("/api/v1/tasks/{task_id}")
def get_task(task_id: int):
    # Check cache
    cached = redis_client.get(f"task:{task_id}")
    if cached:
        return json.loads(cached)
    
    # Cache miss, fetch from database
    task = db.get(Task, task_id)
    
    # Store in cache for 5 minutes
    redis_client.setex(f"task:{task_id}", 300, json.dumps(task))
    
    return task
```

### Load Balancing

Distributing requests across multiple servers

```
Client Requests
    ↓
Load Balancer (Nginx)
    ↓
    ├─ Server 1 (port 8001)
    ├─ Server 2 (port 8002)
    └─ Server 3 (port 8003)

Each server runs same FastAPI application
Load balancer distributes requests based on:
- Round robin
- Least connections
- IP hash
```

### Rate Limiting

Controlling number of requests

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/api/v1/auth/login")
@limiter.limit("5/minute")  # Max 5 login attempts per minute
def login(email: str, password: str):
    # Prevent brute force attacks
    pass
```

### Connection Pooling

Reusing database connections

```python
from sqlmodel import create_engine

engine = create_engine(
    DATABASE_URL,
    pool_size=20,  # Max 20 connections
    max_overflow=10,  # Max 10 additional overflow connections
    pool_pre_ping=True,  # Check connections before using
    pool_recycle=3600,  # Recycle connections every hour
)
```

---

## Testing and Quality Assurance

### Unit Testing

Testing individual functions

```python
def test_hash_password():
    password = "mypassword123"
    hashed = hash_password(password)
    
    assert hashed != password  # Should be hashed
    assert verify_password(password, hashed)  # Should verify

def test_create_task():
    task = TaskCreate(
        title="Test task",
        description="Test description",
        priority=1
    )
    
    assert task.title == "Test task"
    assert task.priority == 1
```

### Integration Testing

Testing components working together

```python
def test_create_and_retrieve_task(client, session):
    # Register user
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "password123"
        }
    )
    
    # Login and get token
    login_response = client.post(
        "/api/v1/auth/login",
        data={
            "email": "test@example.com",
            "password": "password123"
        }
    )
    token = login_response.json()["access_token"]
    
    # Create task with token
    create_response = client.post(
        "/api/v1/tasks/",
        json={"title": "Test task", "priority": 1},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]
    
    # Retrieve task
    get_response = client.get(
        f"/api/v1/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert get_response.status_code == 200
    assert get_response.json()["title"] == "Test task"
```

### End-to-End Testing

Testing entire application flow

```python
def test_complete_task_workflow(client):
    # 1. Register user
    register_response = client.post("/api/v1/auth/register", json={...})
    assert register_response.status_code == 201
    
    # 2. Login
    login_response = client.post("/api/v1/auth/login", data={...})
    assert login_response.status_code == 200
    
    # 3. Create task
    create_response = client.post("/api/v1/tasks/", json={...})
    assert create_response.status_code == 201
    
    # 4. List tasks
    list_response = client.get("/api/v1/tasks/")
    assert list_response.status_code == 200
    
    # 5. Update task
    update_response = client.patch("/api/v1/tasks/1", json={...})
    assert update_response.status_code == 200
    
    # 6. Delete task
    delete_response = client.delete("/api/v1/tasks/1")
    assert delete_response.status_code == 204
```

### Test Coverage

Measuring what percentage of code is tested

```bash
# Run tests with coverage report
pytest --cov=app tests/

# Generate HTML report
pytest --cov=app --cov-report=html tests/
```

---

## Summary: Key Takeaways

### API Development Essentials

1. **APIs enable** - Separation of concerns, scalability, reusability, third-party integration
2. **REST** - Standard, simple, stateless, cacheable, suitable for most web applications
3. **Monolith first** - Start with monolith, migrate to microservices when needed
4. **Authentication** - Use JWT for stateless authentication (suitable for REST)
5. **Authorization** - Implement proper access control (RBAC, resource-based)
6. **Database** - Design normalized, indexed schemas with proper relationships
7. **Performance** - Use caching, load balancing, rate limiting, connection pooling
8. **Testing** - Write unit, integration, and E2E tests for reliability

### When to Use Each Architecture

**Monolith:**
- Startup with <10 people
- MVP with simple requirements
- Performance-critical application
- ACID transaction requirements

**Microservices:**
- Large team with specialized services
- Different scaling needs per component
- Polyglot (multiple languages) needed
- Independent deployment cycles required

---

## Further Learning

- **FastAPI Documentation** - https://fastapi.tiangolo.com
- **REST API Best Practices** - https://restfulapi.net
- **HTTP Standards** - https://tools.ietf.org/html/rfc7231
- **Database Design** - https://www.postgresql.org/docs
- **Authentication** - https://tools.ietf.org/html/rfc7519 (JWT)

