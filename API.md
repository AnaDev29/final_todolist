# API Endpoints - TodoList

**Base URL:** `https://todolist-backend-production-79bd.up.railway.app/api/health`

> Todos los endpoints (excepto auth) requieren: `Authorization: Bearer <token>`

---

## 🔐 Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-----------|
| POST | `/auth/register` | Registrar usuario |
| POST | `/auth/login` | Iniciar sesión |
| POST | `/auth/refresh` | Refrescar token |
| POST | `/auth/logout` | Cerrar sesión |

### Login
```bash
POST /auth/login
Body: { "alias": "user", "contraseña": "pass123" }
Response: { "accessToken": "...", "refreshToken": "..." }
```

---

## ✅ Tareas

| Método | Endpoint | Descripción |
|--------|----------|-----------|
| GET | `/tasks` | Obtener todas |
| POST | `/tasks` | Crear tarea |
| PUT | `/tasks/:id` | Actualizar |
| DELETE | `/tasks/:id` | Eliminar |
| DELETE | `/tasks/completed/all` | Eliminar completadas |

### Crear Tarea
```bash
POST /tasks
Body: { "text": "Mi tarea" }
Response: { "id": 1, "text": "Mi tarea", "completed": false }
```

### Obtener Tareas
```bash
GET /tasks
Response: { "count": 5, "data": [...] }
```

### Actualizar Tarea
```bash
PUT /tasks/1
Body: { "text": "Tarea editada", "completed": true }
```

### Eliminar Tarea
```bash
DELETE /tasks/1
Response: { "success": true }
```

---

## 👤 Usuario

| Método | Endpoint | Descripción |
|--------|----------|-----------|
| GET | `/users/profile` | Obtener perfil |
| PUT | `/users/profile` | Actualizar perfil |
| POST | `/users/upload-photo` | Subir foto |
| DELETE | `/users/photo` | Eliminar foto |

### Obtener Perfil
```bash
GET /users/profile
Response: { "id": 1, "nombre": "Juan", "email": "juan@ex.com" }
```

### Actualizar Perfil
```bash
PUT /users/profile
Body: { "nombre": "Juan P.", "email": "new@ex.com" }
```

---

## 📊 Códigos HTTP

| Código | Significado |
|--------|-----------|
| 200 | OK |
| 201 | Creado |
| 400 | Error de datos |
| 401 | No autenticado |
| 404 | No encontrado |
| 500 | Error servidor |

---

## 🧪 Ejemplo Rápido

```bash
# 1. Registrar
curl -X POST https://final-todolist-olive.vercel.app/ \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana","alias":"ana","email":"ana@ex.com","contraseña":"Ana123"}'

# 2. Login
curl -X POST https://final-todolist-olive.vercel.app/ \
  -H "Content-Type: application/json" \
  -d '{"alias":"ana","contraseña":"Ana123"}'

# 3. Crear tarea (usar token del login)
curl -X POST https://final-todolist-olive.vercel.app/tasks \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"text":"Aprender Node.js"}'

# 4. Obtener tareas
curl -X GET https://final-todolist-olive.vercel.app/tasks \
  -H "Authorization: Bearer <accessToken>"
```
