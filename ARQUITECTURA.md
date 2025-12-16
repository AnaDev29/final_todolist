# Arquitectura - TodoList Full Stack

##  Stack Tecnológico

| Componente | Tecnología | Plataforma |
|-----------|-----------|-----------|
| Frontend | React 19 + Vite + TailwindCSS | Vercel |
| Backend | Express + Node.js | Render |
| Database | MySQL 8.0 | Railway |
| Auth | JWT + Bcrypt | - |

## Diagrama

```
Usuario → Frontend (Vercel) → Backend (Render) → MySQL (Railway)
```

## Estructura Principal

**Frontend** (`src/`):
- `components/` - Componentes React
- `pages/` - Páginas (Login, Tasks, Profile)
- `api/` - Cliente Axios
- `context/` - AuthContext

**Backend** (`src/`):
- `routes/` - Endpoints API
- `controllers/` - Lógica de negocio
- `models/` - Sequelize models
- `middlewares/` - Auth, errores

**Database**:
- `Users` - Usuarios registrados
- `Tasks` - Tareas por usuario

## Flujos Principales

**Login:**
1. Usuario envía credenciales → Backend valida → Retorna JWT

**Crear Tarea:**
1. POST /api/tasks + JWT → Backend valida → Guarda en BD → Retorna tarea

**Listar Tareas:**
1. GET /api/tasks + JWT → Backend consulta BD → Retorna tareas del usuario

## Seguridad

- JWT tokens con expiración
- Contraseñas encriptadas (bcrypt)
- CORS configurado
- Validación backend

##  CI/CD

```
Push → GitHub Actions → Build frontend → Deploy a Vercel
```

- **Workflow**: `.github/workflows/ci.yml`
- **Ejecuta**: npm install + npm run build
- **Falla si**: Build falla
