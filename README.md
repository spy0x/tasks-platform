# Tasks Platform

Plataforma fullstack con arquitectura MVC para gestionar proyectos y tareas.

## Stack

- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **Frontend:** Next.js
- **Vistas de tareas:** Kanban (drag & drop por categoría) + Matriz Eisenhower

## Funcionalidades

- CRUD de proyectos
- CRUD de tareas dentro de proyectos
- Mover tareas de categoría por **drag and drop**
- Cambiar categoría manualmente por selector
- Asignar tag Eisenhower manualmente
- Eliminar proyecto y sus tareas relacionadas

## Estructura

```txt
backend/
  src/
    models/        # Modelos Mongoose
    controllers/   # Lógica de negocio (MVC)
    routes/        # Endpoints REST
    middlewares/
frontend/
  app/
  components/
  lib/
```

## Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Variables backend (`backend/.env`):

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/tasks_platform
CLIENT_ORIGIN=http://localhost:3000
```

## Frontend setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Variables frontend (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## API principal

### Projects

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

### Tasks

- `GET /api/projects/:projectId/tasks`
- `POST /api/projects/:projectId/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `PATCH /api/tasks/:id/category`
- `DELETE /api/tasks/:id`

## Notas

- Diseño orientado a claridad MVC en backend.
- Frontend desacoplado vía REST.
