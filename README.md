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
   LLM_API=...
   LLM_API_KEY=...
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

### Frontend

1. Go to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the dev server:
   ```bash
   pnpm dev
   ```

The app will be available at `http://localhost:5173`.

> Make sure the backend is running before starting the frontend.

## Discussion Questions

**1. AI Dev Stack:** What AI tools were used in this assignment? Which models do you use?

I used Claude (by Anthropic) as my primary AI assistant throughout this assignment. I normally use GitHub Copilot day-to-day, but I've been looking for a good opportunity to test Claude in a real development context - this assignment was a perfect fit.

**2. API discovery:** How did you find the model name? Walk through your process.

I appended `/v1/models` to the provided API base URL and called it directly in the browser. The response returned a list of available models, which revealed the model name `unsloth/Qwen3.5-9B`. The model name is also visible on the API's main page under the provided URL.

**3. Streaming architecture:** How does the LLM response flow from the API through your backend to the frontend? Draw the data path. What happens if the LLM API is slow or drops mid-stream?

...

**4. Database:** How did you structure the schema? What would you change if this needed to support thousands of tickets with full-text search?

...

**5. Credentials:** How did you handle API keys and database credentials in your code? What would you do differently in a production deployment?

...

**6. Tradeoffs:** What did you skip or simplify due to the time constraint? What would you add first if you had another 3 hours?

...

**7. Time spent:** How long did you actually spend? What took longer than expected?

...

