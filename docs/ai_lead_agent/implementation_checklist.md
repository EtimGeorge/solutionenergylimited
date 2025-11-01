# AI Agent Implementation Checklist

**Version:** 1.0
**Based on:** `ai_agents_unified_blueprint.md` (Version 3.0)

This document provides a step-by-step checklist to implement the integrated AI agent system. Mark each item as complete to track progress.

---

### Phase 1: Environment & Database Setup

- [x] **1.1: Create Python Agent Directory:**
  - [x] Create a new root directory named `python-agents`.

- [x] **1.2: Define Python Dependencies:**
  - [x] Create `python-agents/requirements.txt`.
  - [x] Add the required libraries to the file.

- [x] **1.3: Update Environment Variables:**
  - [x] Add agent-related keys to `backend/.env.example`.
  - [x] Create and populate `backend/.env` with actual secret keys.

- [x] **1.4: Update Database Schema:**
  - [x] Create `docs/database_migrations/002_alter_form_submissions.sql`.
  - [x] Apply this migration to the database.

---

### Phase 2: Node.js Backend API Development (`backend/`)

- [x] **2.1: Create Agent Authentication Middleware:**
  - [x] Create `backend/middleware/authAgent.js`.

- [x] **2.2: Update Form Submission Route:**
  - [x] In `server.js`, modify the form submission route to execute `NOTIFY`.

- [x] **2.3: Implement Lead Status Update Route:**
  - [x] In `server.js`, create the `PATCH /api/v1/leads/:id/status` endpoint.

- [x] **2.4: Implement Lead Creation from Chat Route:**
  - [x] In `server.js`, create the `POST /api/v1/leads/from-chat` endpoint.

- [x] **2.5: Implement Chat Proxy Route:**
  - [x] In `server.js`, create the `POST /api/v1/chat` endpoint and add the proxy logic.

---

### Phase 3: Python Lead Qualification Agent (`python-agents/lead_qualifier/`)

- [x] **3.1: Create Directory Structure:**
  - [x] Create the subdirectory `python-agents/lead_qualifier`.

- [x] **3.2: Implement Core Listener (`main.py`):**
  - [x] Create `python-agents/lead_qualifier/main.py` with the `LISTEN` loop.

- [x] **3.3: Define Data Models (`models.py`):**
  - [x] Create `python-agents/lead_qualifier/models.py` with Pydantic schemas.

- [x] **3.4: Implement Qualification Logic (`process_lead`):**
  - [x] Implement the full `process_lead` function in `main.py`.

- [x] **3.5: Implement Email Logic (`emailer.py`):**
  - [x] Create `python-agents/lead_qualifier/emailer.py` with email generation and sending logic.

---

### Phase 4: Python Customer Service Agent (`python-agents/cs_agent/`)

- [x] **4.1: Create Directory Structure:**
  - [x] Create the subdirectory `python-agents/cs_agent`.

- [x] **4.2: Implement Knowledge Base Builder (`build_kb.py`):**
  - [x] Create `python-agents/cs_agent/build_kb.py`.

- [x] **4.3: Implement Agent Server (`main.py`):**
  - [x] Create `python-agents/cs_agent/main.py` with FastAPI.

- [x] **4.4: Implement RAG Chat Endpoint:**
  - [x] Create `rag_handler.py` and integrate it with the FastAPI server.

- [x] **4.5: Implement Intent Recognition & Escalation:**
  - [x] Add intent recognition and lead escalation logic to `rag_handler.py`.

---

### Phase 5: Integration & Testing

- [x] **5.1: Document Operational Steps:**
  - [x] Create a `README.md` inside `python-agents` explaining setup and execution.

- [ ] **5.2: Test End-to-End Flow 1 (Web Form):**
  - [ ] Run the Node.js server and the Lead Qualification Agent.
  - [ ] Submit a form on the website.
  - [ ] Verify: The Lead Agent logs the notification, the database record is updated, and a follow-up email is received.

- [ ] **5.3: Test End-to-End Flow 2 (Chat Escalation):**
  - [ ] Run all three services (Node.js, Lead Agent, CS Agent).
  - [ ] Use the chat widget and have a conversation that shows clear buying intent.
  - [ ] Verify: The CS Agent logs intent detection, a new lead appears in the database, the Lead Agent logs the notification, and an email is received.
