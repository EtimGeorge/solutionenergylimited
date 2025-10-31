# AI Agent Integration: Technical Blueprint

**Author:** Principal Integration Architect
**Date:** 2025-10-31
**Status:** Proposed

## Introduction

This document outlines the architectural and implementation plan for integrating two distinct Python-based AI agents into the Solution Energy Limited (SEESL) web application: a **Lead Qualification Agent** and a **Customer Service Agent**. The design prioritizes security, accuracy, resilience, and real-time performance by leveraging a hybrid-stack architecture consisting of the existing Node.js backend and a new Python microservice environment.

---

## 1. Lead Agent Triggering Architecture

To ensure the immediate processing of new leads from the `form_submissions` table, a real-time, event-driven approach is required.

### 1.1. Evaluation of Triggering Methods

*   **Periodic Polling:** The Python agent would query the database at a fixed interval. This method is simple but introduces latency, wastes database resources, and does not scale efficiently. It is not recommended for a production-grade system.
*   **PostgreSQL `LISTEN`/`NOTIFY`:** This feature allows the database to send instant, asynchronous notifications to listening clients over a named channel. The Node.js backend can send a `NOTIFY` payload upon a new lead insertion, and the Python agent can `LISTEN` for it.

### 1.2. Recommended Approach: `LISTEN`/`NOTIFY`

The `LISTEN`/`NOTIFY` pattern is the superior choice. It is highly efficient, provides true real-time processing capabilities, and minimizes the load on the PostgreSQL database.

#### 1.2.1. Node.js Backend Modification (`server.js`)

The existing form submission logic will be augmented to issue a `NOTIFY` command after a successful `INSERT` into the `form_submissions` table. The `pg` library in Node.js natively supports this.

```javascript
// Assuming 'pool' is the existing pg.Pool instance
// Inside the POST /submit-form route, after successful insertion...

const newLeadId = result.rows[0].id; // Get the ID of the newly inserted lead

try {
  // Notify the 'new_lead' channel, sending the new lead's ID as the payload
  await pool.query(`NOTIFY new_lead, '${newLeadId}'`);
  console.log(`[OK] Notification sent for lead ID: ${newLeadId}`);
} catch (err) {
  console.error('[FAIL] Error sending NOTIFY signal:', err);
  // The failure to notify should be logged but not fail the user request
}
```

#### 1.2.2. Python Agent Listener (`lead_qualifier/main.py`)

The Python agent will use the `psycopg2` library to listen on the `new_lead` channel. The connection must be set to autocommit mode to handle asynchronous notifications properly.

```python
import psycopg2
import psycopg2.extensions
import select
import os

DB_CONN_STRING = os.getenv("DATABASE_URL")

def listen_for_leads():
    conn = psycopg2.connect(DB_CONN_STRING)
    conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
    
    curs = conn.cursor()
    curs.execute("LISTEN new_lead;")
    print("Listening for new leads...")

    while True:
        if select.select([conn], [], [], 5) == ([], [], []):
            continue
        conn.poll()
        while conn.notifies:
            notify = conn.notifies.pop(0)
            print(f"Received notification: {notify.payload}")
            # Trigger lead processing logic with the received lead ID
            process_lead(notify.payload)

def process_lead(lead_id):
    print(f"Processing lead ID: {lead_id}")
    # Implementation details in subsequent sections
    pass

if __name__ == "__main__":
    listen_for_leads()
```

---

## 2. Secure Data Exchange & Status Update

### 2.1. Data Fetching

The Python agent will connect **directly** to the PostgreSQL database using a read-only database user/role where possible (except for any tables it may need to write to). This is secure and efficient, avoiding the need for a dedicated "get lead" API endpoint. The connection string will be provided via an environment variable: `DATABASE_URL`.

### 2.2. Status Update API

To allow the Python agent to report its findings, a new secure endpoint will be added to the Node.js backend.

*   **Endpoint:** `PATCH /api/v1/leads/:id/status`
*   **Authentication:** The Python agent must include a secret API key in the `Authorization` header (e.g., `Authorization: Bearer <AGENT_API_KEY>`). This key will be stored in the Node.js environment variables and validated by a middleware.

#### 2.2.1. Node.js Middleware for Agent Authentication

```javascript
// middleware/authAgent.js
const AGENT_API_KEY = process.env.AGENT_API_KEY;

function authAgent(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    if (token !== AGENT_API_KEY) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    next();
}

module.exports = authAgent;
```

#### 2.2.2. Node.js Status Update Route

```javascript
// In your main routes file, e.g., server.js
const authAgent = require('./middleware/authAgent');

// ...
app.patch('/api/v1/leads/:id/status', authAgent, async (req, res) => {
    const { id } = req.params;
    const { status, qualification_notes } = req.body; // e.g., status: 'qualified', notes: '...'

    if (!['qualified', 'unqualified', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value.' });
    }

    try {
        // Assume a 'status' and 'qualification_notes' column exist on 'form_submissions'
        const result = await pool.query(
            'UPDATE form_submissions SET status = $1, qualification_notes = $2 WHERE id = $3 RETURNING id',
            [status, qualification_notes, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Lead not found.' });
        }

        res.status(200).json({ message: `Lead ${id} status updated successfully.` });
    } catch (err) {
        console.error('Error updating lead status:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
```

---

## 3. Gemini-Powered Qualification Logic

The core of the agent uses the `google-generativeai` library to perform intelligent analysis.

### 3.1. Lead Schema (Pydantic)

A Pydantic model ensures data integrity and provides type hinting.

```python
# lead_qualifier/models.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class Lead(BaseModel):
    id: int
    name: str
    email: EmailStr
    company: Optional[str] = None
    message: str
    service_interest: Optional[str] = None
    # Add any other fields from the form_submissions table
```

### 3.2. Advanced Gemini Criteria

The qualification function will use the Gemini API to evaluate leads.

```python
# lead_qualifier/qualifier.py
import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

SEESL_HIGH_VALUE_SERVICES = [
    "Advanced Technology Solutions",
    "Engineering Services",
    "Gas Conversion Technology",
    "Renewable Energy Services"
]

def qualify_lead(lead: Lead) -> (str, str):
    """
    Qualifies a lead using Gemini.
    Returns a tuple of (status, notes).
    """
    
    # 1. Negative Filtering
    prompt_filter = f"""
    Analyze the following inquiry to determine if it is spam, a job application, or otherwise irrelevant to a B2B energy services company.
    Respond with a single word: 'irrelevant' or 'relevant'.
    Inquiry: "{lead.message}"
    """
    response = model.generate_content(prompt_filter)
    if 'irrelevant' in response.text.lower():
        return ('unqualified', 'Filtered as irrelevant/spam.')

    # 2. Urgency & Intent Analysis
    prompt_urgency = f"""
    Analyze the urgency of the following business inquiry. Consider mentions of deadlines, tenders, immediate needs, or project start dates.
    Respond with a single word: 'urgent' or 'standard'.
    Inquiry: "{lead.message}"
    """
    urgency_response = model.generate_content(prompt_urgency)
    is_urgent = 'urgent' in urgency_response.text.lower()

    # 3. Service Matching
    prompt_service = f"""
    Analyze the following inquiry and identify which of these services is the best match, even if not explicitly stated.
    Services: {', '.join(SEESL_HIGH_VALUE_SERVICES)}.
    Respond with the service name or 'Other'.
    Inquiry: "{lead.message}"
    """
    service_response = model.generate_content(prompt_service)
    matched_service = service_response.text.strip()

    # Qualification Decision
    notes = f"Gemini Analysis:
- Urgency: {'Urgent' if is_urgent else 'Standard'}
- Matched Service: {matched_service}"
    
    if is_urgent or any(service in matched_service for service in SEESL_HIGH_VALUE_SERVICES):
        return ('qualified', notes)
    
    return ('qualified', notes) # Default to qualified if not filtered, can be adjusted
```

---

## 4. Automated Follow-up Integration with Resend

Upon successful qualification, the agent will trigger a personalized email.

### 4.1. Technology Choice & Configuration

The `resend` Python library will be used. The agent requires the following environment variable:
*   `RESEND_API_KEY`: The API key for the SEESL Resend account.

### 4.2. Dynamic Content Generation

Gemini will be used to draft a personalized opening line for the follow-up email, making the outreach feel less robotic.

```python
# lead_qualifier/emailer.py
import resend
import os
import google.generativeai as genai

resend.api_key = os.getenv("RESEND_API_KEY")
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

def send_qualified_lead_email(lead: Lead):
    """
    Sends a personalized follow-up email to a qualified lead.
    """
    
    # Generate personalized opening
    prompt = f"""
    Based on the following lead's message, write a single, engaging opening sentence for a follow-up email from our sales team.
    The tone should be professional and acknowledge their specific interest.
    Message: "{lead.message}"
    """
    response = model.generate_content(prompt)
    opening_line = response.text.strip()

    html_body = f"""
    <p>{opening_line}</p>
    <p>Thank you for your interest in Solution Energy Limited. Our team has received your request and will be reviewing it shortly to connect you with the right expert.</p>
    <p>For your reference, your inquiry was regarding: <strong>{lead.service_interest or 'your recent message'}</strong>.</p>
    <p>Best regards,<br>The SEESL Team</p>
    """

    try:
        params = {
            "from": "SEESL Sales <sales@yourdomain.com>", # Replace with actual sender
            "to": [lead.email],
            "subject": f"Regarding your inquiry with Solution Energy Limited",
            "html": html_body,
        }
        email = resend.Emails.send(params)
        print(f"Email sent successfully to {lead.email}. ID: {email['id']}")
    except Exception as e:
        print(f"Failed to send email to {lead.email}: {e}")

```

---

## 5. AI Customer Service Agent (RAG Architecture)

To provide instant support, a second AI agent will use a Retrieval-Augmented Generation (RAG) architecture.

### 5.1. Knowledge Base Creation

A one-time script will be created to scrape text content from the SEESL website and build a vector knowledge base.

*   **Scraping:** Use `BeautifulSoup4` to parse the HTML of `services/*.html` and `blog/index.html` and extract all relevant text content (e.g., from `<p>`, `<h1>`, `<h2>`, `<li>` tags).
*   **Chunking:** Split the extracted text into smaller, semantically meaningful chunks (e.g., paragraphs).
*   **Embedding & Storage:** Use `google-generativeai`'s embedding model to convert each text chunk into a vector. Store these vectors and their corresponding text in a local `faiss-cpu` index file for fast similarity searches.

This process will generate a `knowledge_base.faiss` file and a corresponding `knowledge_base_content.json` file.

### 5.2. Chat API Endpoint (Node.js)

A new endpoint will proxy chat requests from the frontend to the Python Customer Service Agent.

*   **Endpoint:** `POST /api/v1/chat`
*   **Body:** `{ "query": "User's question here" }`
*   **Mechanism:** The Node.js server will make an HTTP request to the Python agent (running as a separate Flask/FastAPI server) and stream the response back to the client.

### 5.3. RAG Workflow (Python Customer Service Agent)

The agent will be a simple web server (e.g., using FastAPI) with a single endpoint.

1.  **Receive Query:** The agent receives a user's question from the Node.js backend.
2.  **Load Knowledge Base:** The agent loads the pre-built FAISS index and content from disk.
3.  **Search:** It generates an embedding for the user's query and uses FAISS to find the top 3-5 most relevant text chunks from the knowledge base.
4.  **Augment Prompt:** It constructs a prompt for the Gemini model, including the user's question and the retrieved text chunks as context.
    ```
    System: You are a helpful customer service assistant for Solution Energy Limited. Answer the user's question based *only* on the provided context. If the answer is not in the context, say "I'm sorry, I don't have that information."

    Context:
    - [Retrieved Chunk 1]
    - [Retrieved Chunk 2]
    - [Retrieved Chunk 3]

    User Question: [User's Question]
    ```
5.  **Generate & Stream:** It calls the `gemini-pro` model and streams the generated response back. FastAPI's `StreamingResponse` is ideal for this, allowing the Node.js backend to relay the tokens to the frontend as they are generated, creating a real-time chat effect.

---

## 6. Complete Tool & Dependency Manifest

### 6.1. Python (`python-agents/requirements.txt`)

```
# Core AI and communication
google-generativeai
python-dotenv

# Lead Qualification Agent
psycopg2-binary
resend
pydantic

# Customer Service Agent (RAG)
fastapi
uvicorn
beautifulsoup4
faiss-cpu
numpy 
```

### 6.2. Node.js (`backend/package.json`)

No new major dependencies are required, as `pg` for database access and a built-in `http` module (or `axios`/`node-fetch`) for proxying are sufficient. The new API routes will be added to the existing Express application.
