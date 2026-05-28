# TODO List

Aplicación de lista de tareas con backend REST (FastAPI + SQLAlchemy) y frontend (React + Vite).

Los datos se almacenan en una base de datos SQLite en memoria, por lo que se reinician al detener el servidor.

---

## Backend (FastAPI)

### Requisitos

- Python 3.12+

### Instalación

```bash
pip install -r requirements.txt
```

### Ejecución

```bash
python -m uvicorn app.main:app --reload
```

El servidor se levanta en `http://localhost:8000`.

---

## Frontend (React + Vite)

### Requisitos

- Node.js 18+

### Instalación

```bash
cd frontend
npm install
```

### Configuración (opcional)

Copia el archivo de ejemplo y ajusta la URL del backend si es necesario:

```bash
cp frontend/.env.example frontend/.env
```

### Ejecución en desarrollo

```bash
cd frontend
npm run dev
```

La app se abre en `http://localhost:5173`.

### Build para producción

```bash
cd frontend
npm run build
```

Los archivos estáticos quedan en `frontend/dist/`.

## Endpoints

| Método   | Ruta            | Descripción                                      |
|----------|-----------------|--------------------------------------------------|
| `POST`   | `/todos/`       | Crear un nuevo todo                              |
| `GET`    | `/todos/`       | Listar todos (filtro opcional `?completed=true`)  |
| `GET`    | `/todos/{id}`   | Obtener un todo por ID                           |
| `PUT`    | `/todos/{id}`   | Actualizar un todo                               |
| `DELETE` | `/todos/{id}`   | Eliminar un todo                                 |

## Ejemplos

Crear un todo:

```bash
curl -X POST http://localhost:8000/todos/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Comprar leche", "description": "En el supermercado"}'
```

Listar todos:

```bash
curl http://localhost:8000/todos/
```

Actualizar un todo:

```bash
curl -X PUT http://localhost:8000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

Eliminar un todo:

```bash
curl -X DELETE http://localhost:8000/todos/1
```
