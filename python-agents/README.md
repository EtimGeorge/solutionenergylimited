# SEESL Python AI Agents

This directory contains the source code for two integrated AI agents that support the Solution Energy Limited website:

1.  **Lead Qualification Agent (`lead_qualifier/`):** A backend service that listens for new leads, qualifies them using AI, and sends automated follow-ups.
2.  **Customer Service Agent (`cs_agent/`):** A FastAPI server that provides real-time answers to user questions and can escalate conversations into new leads.

---

## Setup and Installation

### Prerequisites

1.  **Python:** Ensure you have Python 3.8 or newer installed.
2.  **Node.js Backend:** The main backend server in the `../backend` directory must be running (`npm start` or `node server.js`).
3.  **Environment File:** The `.env` file in the `../backend` directory must be fully populated with valid keys for `DATABASE_URL`, `GEMINI_API_KEY`, `AGENT_API_KEY`, and `RESEND_API_KEY`.
4.  **Database:** The database schema must be up-to-date. Ensure you have run all migrations from `docs/database_migrations/`.

### Installation Steps

1.  **Navigate to this directory:**
    ```sh
    cd python-agents
    ```

2.  **Create a virtual environment:**
    ```sh
    python -m venv venv
    ```

3.  **Activate the virtual environment:**
    -   On Windows:
        ```sh
        .\venv\Scripts\activate
        ```
    -   On macOS/Linux:
        ```sh
        source venv/bin/activate
        ```

4.  **Install dependencies:**
    ```sh
    pip install -r requirements.txt
    ```

---

## Running the Agents

### Step 1: Build the Knowledge Base

This is a one-time step that needs to be re-run only when the content of the main website changes. This script scrapes the website files, generates embeddings, and creates the `faiss_index.bin` file used by the Customer Service Agent.

```sh
python cs_agent/build_kb.py
```

### Step 2: Run the Agents

The two agents must be run in separate terminals.

**Terminal 1: Start the Lead Qualification Agent**

This agent listens for database notifications.

```sh
python lead_qualifier/main.py
```

**Terminal 2: Start the Customer Service Agent**

This agent runs a web server to handle chat requests.

```sh
python cs_agent/main.py
```

The server will be available at `http://127.0.0.1:8001`.

---

## Testing the Integration

Once all services (Node.js backend, Lead Agent, CS Agent) are running, you can perform the end-to-end tests outlined in `docs/implementation_checklist.md` (Tasks 5.2 and 5.3).
