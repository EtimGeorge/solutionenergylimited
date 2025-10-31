# AI Agent Integration: Unified Technical Blueprint

**Author:** Principal Integration Architect
**Date:** 2025-10-31
**Status:** Final
**Version:** 2.0

## Introduction

This document outlines the definitive architectural and implementation plan for integrating two distinct Python-based AI agents into the Solution Energy Limited (SEESL) web application: a **Lead Qualification Agent** and a **Customer Service Agent**. This blueprint is designed for immediate implementation, focusing on security, resilience, real-time performance, and leveraging the Google Gemini API for core intelligence.

---

## 1. Lead Agent Triggering Architecture

To ensure the immediate processing of new leads, a real-time, event-driven approach is required.

#### Recommendation: PostgreSQL `LISTEN`/`NOTIFY`

The `LISTEN`/`NOTIFY` pattern is the most efficient and architecturally sound pattern for real-time notification. It transforms the system from a load-intensive polling loop into a responsive, event-driven architecture.

**Implementation Steps:**

1.  **Node.js Backend (`server.js`):** After a successful `INSERT` into the `form_submissions` table, the backend must execute a `NOTIFY` command.

    ```javascript
    // Assuming 'pool' is the existing pg.Pool instance
    // Inside the POST /submit-form route, after successful insertion...

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

2.  **Python Lead Agent (`lead_qualifier/main.py`):** The agent will use `psycopg2` to listen on the `new_lead_channel`. The connection must be set to autocommit mode to handle asynchronous notifications.

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
        curs.execute("LISTEN new_lead_channel;")
        print("Listening for new leads...")

        while True:
            if select.select([conn], [], [], 5) == ([], [], []):
                continue
            conn.poll()
            while conn.notifies:
                notify = conn.notifies.pop(0)
                print(f"Received notification for lead ID: {notify.payload}")
                # Trigger lead processing logic
                process_lead(notify.payload)

    def process_lead(lead_id: str):
        print(f"Processing lead ID: {lead_id}")
        # Full implementation in subsequent sections
        pass

    if __name__ == "__main__":
        listen_for_leads()
    ```

---

## 2. Secure Data Exchange & Status Update

#### A. Data Fetching (Agent to DB)

The Python agent connects directly to the PostgreSQL database using a dedicated, read-only service account. On receiving a `lead_id`, it executes a `SELECT * FROM form_submissions WHERE id = %s` query to retrieve the full lead data.

#### B. Status Update API (Agent to Node.js Backend)

A new, secure API endpoint is required for the agent to report the qualification result.

| Detail | Specification |
| :--- | :--- |
| **Method/Route** | `PATCH /api/v1/leads/:id/status` |
| **Authentication** | The Node.js server requires an `X-API-Key` header with a pre-shared secret key. |
| **Request Body** | JSON payload with structured qualification results. |

**Example Request Body (from Python Agent):**
```json
{
  "status": "qualified",
  "qualification_notes": "High priority: Mentioned 'immediate tender deadline'. Primary interest classified as 'Solar PV'.",
  "gemini_classification_score": 0.92
}
```

**Implementation:**

1.  **Node.js Middleware (`middleware/authAgent.js`):**
    ```javascript
    const AGENT_API_KEY = process.env.AGENT_API_KEY;

    function authAgent(req, res, next) {
        const apiKey = req.get('X-API-Key');
        if (!apiKey || apiKey !== AGENT_API_KEY) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        next();
    }

    module.exports = authAgent;
    ```

2.  **Node.js Route (`server.js`):**
    ```javascript
    const authAgent = require('./middleware/authAgent');

    app.patch('/api/v1/leads/:id/status', authAgent, async (req, res) => {
        const { id } = req.params;
        const { status, qualification_notes, gemini_classification_score } = req.body;

        if (!['qualified', 'unqualified'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value.' });
        }

        try {
            // Assumes columns 'status', 'qualification_notes', 'gemini_score' exist
            const result = await pool.query(
                'UPDATE form_submissions SET status = $1, qualification_notes = $2, gemini_score = $3 WHERE id = $4 RETURNING id',
                [status, qualification_notes, gemini_classification_score, id]
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

The agent will use Gemini's structured output capability for efficient and reliable qualification.

#### A. Pydantic Schemas (`lead_qualifier/models.py`)

```python
from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class Lead(BaseModel):
    id: int
    name: str = Field(description="Full name of the lead.")
    email: EmailStr
    company: Optional[str] = Field(description="Lead's company name, if provided.")
    message: str = Field(description="The full, unstructured message/inquiry from the lead.")
    service_interest: Optional[str] = Field(description="The service category selected from the form.")
    
class QualificationResult(BaseModel):
    is_qualified: bool = Field(description="True if the lead is a potential customer and not spam.")
    priority_level: str = Field(description="One of: 'High', 'Medium', 'Low'. Based on urgency analysis.")
    primary_service_match: str = Field(description="The single best service match from SEESL's offerings.")
    rejection_reason: Optional[str] = Field(description="If not qualified, the reason (e.g., 'Spam', 'Job Application').")
    qualification_notes: str = Field(description="A concise summary for the sales team.")
```

#### B. Advanced Gemini Criteria

A single call to the Gemini API will return a structured JSON object matching the `QualificationResult` model.

*   **Model Choice:** `gemini-pro` or a faster equivalent, leveraging its instruction-following for structured output.
*   **Prompt Strategy:** A detailed system prompt will instruct the model to analyze for urgency, match services, and filter irrelevant inquiries, all while formatting the output as a JSON object.

---

## 4. Automated Follow-up Integration with Resend

The agent will send personalized follow-up emails for qualified leads using the `resend` Python SDK.

#### Dynamic Content Generation (`lead_qualifier/emailer.py`)

```python
import os
import google.generativeai as genai
from resend import Resend
from .models import Lead # Assuming models are in the same directory

# Initialize clients
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
resend_client = Resend(api_key=os.getenv("RESEND_API_KEY"))
gemini_model = genai.GenerativeModel('gemini-pro')

def send_qualified_lead_email(lead: Lead, qualification_notes: str, service_match: str):
    """Generates a personalized opener and sends a follow-up email."""
    
    prompt = f"""
    You are an expert sales assistant for Solution Energy Limited. Based on the lead's message and our internal analysis, 
    generate a highly personalized, warm, and concise opening paragraph (3-4 sentences max).
    Acknowledge their specific need and show we've understood their inquiry.
    
    LEAD MESSAGE: "{lead.message}"
    INTERNAL NOTES: "{qualification_notes}"
    """
    
    try:
        response = gemini_model.generate_content(prompt)
        personalized_opener = response.text.strip()
    except Exception as e:
        print(f"Gemini generation failed: {e}")
        personalized_opener = "Thank you for reaching out to Solution Energy Limited. We've received your inquiry and are reviewing it."

    email_subject = f"Regarding your inquiry on {service_match}"
    
    email_body = f"""
    <p>Dear {lead.name},</p>
    <p>{personalized_opener}</p>
    <p>A specialist from our team focused on {service_match} solutions will review the details you provided and reach out to you within the next business day.</p>
    <p>Sincerely,<br>The SEESL Sales Team</p>
    """

    try:
        resend_client.emails.send(
            from_='SEESL Sales <sales@yourverifieddomain.com>',
            to=[lead.email],
            subject=email_subject,
            html=email_body
        )
        print(f"Sent follow-up email to {lead.email}")
    except Exception as e:
        print(f"Failed to send email via Resend: {e}")
```

---

## 5. AI Customer Service Agent (RAG Architecture)

The Customer Service Agent will use a Retrieval-Augmented Generation (RAG) approach.

#### A. Knowledge Base Creation

1.  **Scraping:** A Python script uses `beautifulsoup4` to scrape text from `services/*.html` and `blog/index.html`.
2.  **Chunking:** Text is split into small, semantically meaningful chunks.
3.  **Embedding:** Each chunk is converted into a vector embedding using a Google `text-embedding` model.
4.  **Vector Store:** Embeddings and text are stored in a `faiss-cpu` index, which is persisted to disk.

#### B. Chat API Endpoint (Node.js)

*   **Method/Route:** `POST /api/v1/chat`
*   **Request Body:** `{"user_query": "What is the ROI for solar?"}`
*   **Action:** The Node.js server proxies the `user_query` to the Python Customer Service Agent.

#### C. RAG Workflow (Python Agent)

The agent (built with FastAPI) executes the following on receiving a query:

1.  **Retrieve:** It creates an embedding for the `user_query` and performs a similarity search on the FAISS index to find the Top K (e.g., 4) most relevant text chunks.
2.  **Augment:** It injects the retrieved chunks (the "Context") into a prompt for Gemini.
    ```
    SYSTEM: You are the AI assistant for Solution Energy Limited. Answer the user's question using ONLY the provided context. If the answer is not in the context, state: "I cannot find that information in our documentation, but I can connect you with a specialist."

    CONTEXT:
    ---
    [Retrieved Snippet 1]
    [Retrieved Snippet 2]
    ---
    USER QUESTION: {user_query}
    ```
3.  **Generate & Stream:** The augmented prompt is sent to the Gemini model, and the response is streamed back to the Node.js proxy, which then relays it to the frontend for a real-time chat experience.

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
| `requests` | HTTP client for calling the status update API | Lead Agent |

#### Node.js (`backend/package.json`)

No new major dependencies are required. The work involves adding new routes and middleware to the existing Express application and modifying the form submission logic to include the `NOTIFY` command.
