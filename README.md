# Agentica Help Desk

A help desk ticket viewer with AI-powered summaries.

## Setup

### Backend

1. Go to the backend directory:
   ```bash
   cd backend
   ```

2. Create `app/.env` with your database credentials:
   ```
   DB_HOST=...
   DB_PORT=...
   DB_USER=...
   DB_PASSWORD=...
   DB_NAME=...
   ```

3. Install dependencies:
   ```bash
   uv sync
   ```

4. Run the server:
   ```bash
   uv run uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`.  
Swagger docs: `http://localhost:8000/docs`

