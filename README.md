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

```
User clicks "Generate Summary"
        |
        v
Frontend opens EventSource -> GET /api/tickets/{id}/summary
        |
        v
Backend fetches ticket from PostgreSQL
        |
        v
Backend sends streaming request to LLM API (stream=True)
        |
        v
LLM API returns tokens one by one
        |
        v
Backend yields each token as SSE event: "data: <token>\n\n"
        |
        v
Frontend receives each event and appends token to the summary text
        |
        v
Stream ends with "data: [DONE]\n\n" -> connection closed
```

If the LLM API is slow - tokens arrive less frequently but the connection stays open. The user sees the spinner and partial text as it comes in, with no timeout on our side (note: the token-by-token rendering does not work perfectly yet and requires further refinement).

If the LLM API drops mid-stream - the SSE connection triggers `onerror` on the frontend, which closes the `EventSource` and displays "Error during generating response. Please try again." The user can see whatever partial summary was already received and retry.

**4. Database:** How did you structure the schema? What would you change if this needed to support thousands of tickets with full-text search?

The schema is defined using SQLModel, which keeps the model and database schema in sync and makes future migrations straightforward - adding Alembic on top would be a natural next step for managing schema changes over time.

For full-text search at scale, there are two main options. The simpler one is using PostgreSQL's built-in full-text search. The more advanced option would be generating embeddings for each ticket using an embedding model and storing them in a vector database, which would enable semantic search - finding tickets by meaning rather than exact keywords.

**5. Credentials:** How did you handle API keys and database credentials in your code? What would you do differently in a production deployment?

For local development, credentials are stored in a `.env` file which is excluded from version control via `.gitignore`. In a production environment I would use a dedicated secret manager - either GitHub Secrets for CI/CD pipelines, or one of the major cloud provider solutions such as AWS Secrets Manager, Azure Key Vault, or GCP Secret Manager.

**6. Tradeoffs:** What did you skip or simplify due to the time constraint? What would you add first if you had another 3 hours?

All core requirements are implemented but kept in their simplest working form. Given another 3 hours I would focus on:

- Improving the token-by-token streaming to the frontend - it works but is not fully smooth yet
- Pagination on the ticket list - currently all tickets are fetched at once, which would not scale well
- A single automatic retry on LLM connection failure before showing the error to the user
- Code quality tooling - linting with Ruff and test coverage reporting

**7. Time spent:** How long did you actually spend? What took longer than expected?

I spent around 4 hours in total, including breaks for a dog walk, cooking and making tea, and watching a football match with one eye ;) - so I believe I stayed well within the 3-hour limit of actual work. Nothing caused me unexpected trouble, except for the LLM streaming which I am not fully satisfied with and would have spent more time on given the chance. The only minor setup friction was not having `psql` installed locally, but that I was able to resolve it quickly. Oh, and the dog walk took longer than expected ;).

---

# PS!!!

After finishing the assignment I realized the app should spin up with a single command. A `docker-compose.yml` file would fit here perfectly and it could be also used in prod very well - that's the first thing I would add if I had more time.

