# AI Agent Integration: Unified Technical Blueprint

**Author:** Principal Integration Architect
**Date:** 2025-10-31
**Status:** Final
**Version:** 3.0

## Introduction

This document outlines the definitive architectural and implementation plan for integrating two **integrated** Python-based AI agents into the Solution Energy Limited (SEESL) web application: a **Lead Qualification Agent** and a **Customer Service Agent**. This blueprint details the architecture that enables a seamless, automated handover from a general customer inquiry to a qualified sales lead, ensuring no opportunity is lost. It is designed for immediate implementation, focusing on security, resilience, and real-time performance.

---

## 1. Lead Agent Triggering Architecture

To ensure the immediate processing of new leads, a real-time, event-driven approach is required.

#### Recommendation: PostgreSQL `LISTEN`/`NOTIFY`

The `LISTEN`/`NOTIFY` pattern is the most efficient and architecturally sound pattern for real-time notification. It transforms the system from a load-intensive polling loop into a responsive, event-driven architecture. This mechanism serves as the central nervous system for activating the Lead Qualification Agent, whether the lead originates from a web form or is escalated from the Customer Service Agent.

**Implementation Steps:**

1.  **Node.js Backend (`server.js`):** After a successful `INSERT` into the `form_submissions` table (from any source), the backend must execute a `NOTIFY` command.

    ```javascript
    // Assuming 'pool' is the existing pg.Pool instance
    // This logic is used in both the /submit-form and /api/v1/leads/from-chat routes

    const newLeadId = result.rows[0].id; // Get the ID of the newly inserted lead

    try {
      // Notify the 'new_lead_channel', sending the new lead's ID as the payload
      await pool.query(`NOTIFY new_lead_channel, '${newLeadId}'`);
      console.log(`[OK] Notification sent for lead ID: ${newLeadId}`);
    } catch (err) {
      console.error('[FAIL] Error sending NOTIFY signal:', err);
      // The failure to notify should be logged but not fail the user request
    }
    ```

2.  **Python Lead Agent (`lead_qualifier/main.py`):** The agent's core listening logic remains unchanged. It continuously listens for notifications and processes any new `lead_id` it receives.

    ```python
    # ... (psycopg2 connection and listening loop as before) ...
    while conn.notifies:
        notify = conn.notifies.pop(0)
        print(f"Received notification for lead ID: {notify.payload}")
        # Trigger lead processing logic
        process_lead(notify.payload)
    ```

---

## 2. Secure Data Exchange & Agent APIs

#### A. Data Fetching (Agent to DB)

The Python agent connects directly to the PostgreSQL database using a dedicated, read-only service account. On receiving a `lead_id`, it executes a `SELECT * FROM form_submissions WHERE id = %s` query to retrieve the full lead data.

#### B. Status Update API (Agent to Node.js Backend)

A secure API endpoint for the agent to report the qualification result.

| Detail | Specification |
| :--- | :--- |
| **Method/Route** | `PATCH /api/v1/leads/:id/status` |
| **Authentication** | `X-API-Key` header (see `middleware/authAgent.js`) |
| **Request Body** | JSON payload with structured qualification results. |

#### C. Lead Creation API from Chat (Agent to Node.js Backend)

A new, secure endpoint to allow the Customer Service Agent to create a lead.

| Detail | Specification |
| :--- | :--- |
| **Method/Route** | `POST /api/v1/leads/from-chat` |
| **Authentication** | `X-API-Key` header (reuses `middleware/authAgent.js`) |
| **Request Body** | `{"email": "user@example.com", "summary": "User needs a 500kW solar quote..."}` |

**Implementation (`server.js`):**
```javascript
const authAgent = require('./middleware/authAgent');

app.post('/api/v1/leads/from-chat', authAgent, async (req, res) => {
    const { email, summary } = req.body;

    if (!email || !summary) {
        return res.status(400).json({ error: 'Email and summary are required.' });
    }

    try {
        // Insert the chat-generated lead into the same submissions table
        const result = await pool.query(
            'INSERT INTO form_submissions (name, email, message, source) VALUES ($1, $2, $3, $4) RETURNING id',
            ['Lead from Chatbot', email, summary, 'chatbot']
        );

        // The NOTIFY command is triggered here (as shown in Section 1)
        const newLeadId = result.rows[0].id;
        await pool.query(`NOTIFY new_lead_channel, '${newLeadId}'`);
        console.log(`[OK] Chat lead created and notification sent for lead ID: ${newLeadId}`);

        res.status(201).json({ message: `Lead created successfully with ID: ${newLeadId}` });
    } catch (err) {
        console.error('Error creating lead from chat:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
```

---

## 3. Gemini-Powered Qualification Logic

(No changes to this section. The Lead Agent qualifies any lead it receives, regardless of source.)

---

## 4. Automated Follow-up Integration with Resend

(No changes to this section. The Lead Agent emails any lead that it qualifies.)

---

## 5. AI Customer Service Agent (RAG) & Lead Escalation

The Customer Service Agent uses a Retrieval-Augmented Generation (RAG) approach and is now empowered to escalate conversations into qualified leads.

#### A. Knowledge Base Creation

(No changes to this section.)

#### B. Chat API Endpoint (Node.js)

(No changes to this section. The user-facing endpoint remains `POST /api/v1/chat`.)

#### C. RAG & Escalation Workflow (Python Agent)

The agent (built with FastAPI) executes the following on receiving a query:

1.  **Retrieve:** It creates an embedding for the `user_query` and performs a similarity search on the FAISS index to find the Top K most relevant text chunks.
2.  **Augment:** It injects the retrieved chunks into a prompt for Gemini to answer the user's question.
3.  **Generate & Stream:** The augmented prompt is sent to the Gemini model, and the response is streamed back to the user.
4.  **Intent Recognition & Escalation (New Step):** After responding, the agent analyzes the conversation history to detect buying intent.
    *   **Internal Gemini Call:** It makes a second, non-blocking call to Gemini with a prompt like: `"Does this conversation indicate a clear and immediate intent to purchase? Answer with a JSON object: {"has_buying_intent": boolean, "summary": "A concise summary of the user's request.", "email": "Extract the user's email if provided, otherwise null."}"`
    *   **Escalate:** If `has_buying_intent` is `true` and an email is present, the agent makes a `POST` request to the `/api/v1/leads/from-chat` endpoint on the Node.js server, sending the extracted email and summary. This action injects the high-quality lead directly into the qualification pipeline.

---

## 6. Complete Tool & Dependency Manifest

#### Python (`python-agents/requirements.txt`)

| Library | Role | Service |
| :--- | :--- | :--- |
| `google-generativeai` | Core AI intelligence (Gemini API) | Both Agents |
| `psycopg2-binary` | PostgreSQL interaction (`LISTEN`/`NOTIFY`) | Lead Agent |
| `resend` | Transactional email delivery | Lead Agent |
| `pydantic` | Data validation and schema definition | Lead Agent |
| `fastapi` & `uvicorn` | Web server for Customer Service Agent | CS Agent |
| `beautifulsoup4` | HTML parsing for knowledge base creation | CS Agent (KB Builder) |
| `faiss-cpu` | Vector store for RAG retrieval | CS Agent |
| `python-dotenv` | Environment variable management | Both Agents |
| `requests` | HTTP client for API calls to Node.js | Both Agents |

#### Node.js (`backend/package.json`)

No new major dependencies are required. The work involves adding new routes (`/api/v1/leads/from-chat`) and middleware to the existing Express application, and ensuring the `NOTIFY` command is consistently used.
