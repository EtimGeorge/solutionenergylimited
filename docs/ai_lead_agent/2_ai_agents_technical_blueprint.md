This blueprint is designed for immediate implementation, focusing on security, scalability, and leveraging the **Google Gemini API** for core intelligence.

---

## Technical Blueprint: Hybrid-Stack AI Integration

### 1. Lead Agent Triggering Architecture

#### Evaluation: Periodic Polling vs. `LISTEN`/`NOTIFY`

| Feature | Periodic Polling | PostgreSQL `LISTEN`/`NOTIFY` | Rationale |
| :--- | :--- | :--- | :--- |
| **Resilience** | Low (failure to poll loses data until next cycle) | High (event-driven, reliable queue) | |
| **Efficiency** | Very Low (Constant DB connection/query load) | High (Zero CPU load when idle) | |
| **Latency** | High (Dependent on poll interval, e.g., 30s) | Near Real-Time (Milliseconds) | |
| **Complexity** | Low | Moderate (Requires special DB connection logic) | |

#### Recommendation: PostgreSQL `LISTEN`/`NOTIFY`

We recommend using **PostgreSQL's `LISTEN`/`NOTIFY` feature**. This is the most efficient and architecturally sound pattern for real-time notification of internal services. It transforms the system from a load-intensive, time-delayed polling loop into a responsive, event-driven architecture.

**Implementation Steps:**

1.  **Node.js Backend (On `POST /submit-form`):** After successfully inserting the new lead row into `form_submissions`, the backend must execute a `SELECT pg_notify('new_lead_channel', id::text)` command, where `id` is the primary key of the new submission.
    ```sql
    -- Example DB logic
    INSERT INTO form_submissions (name, email, message, ...) VALUES (...);
    SELECT pg_notify('new_lead_channel', LASTVAL()::text);
    ```
2.  **Python Lead Agent:** The agent uses a persistent connection via `psycopg2-binary` to `LISTEN` on the channel named `new_lead_channel`. When a notification is received, the agent immediately processes the payload (the Lead ID).

---

### 2. Secure Data Exchange & Status Update

#### A. Data Fetching (Agent to DB)

The Python Lead Qualification Agent will connect directly to the PostgreSQL database using a dedicated, read-only service account.

1.  **Trigger:** The agent receives a `NOTIFY` signal containing the `lead_id`.
2.  **Connection:** Uses `psycopg2-binary` and a secure connection string (stored in a Docker Secret/K8s Secret/Vault and exposed as an environment variable).
3.  **Action:** Executes a `SELECT * FROM form_submissions WHERE id = %s AND qualification_status = 'pending'` query to retrieve the full, un-qualified lead data.

#### B. Status Update API (Agent to Node.js Backend)

A new, secure API endpoint is required for the agent to report the qualification result back to the core system.

| Detail | Specification | Security Mechanism |
| :--- | :--- | :--- |
| **Method/Route** | `PATCH /api/v1/leads/:id/status` | **Dedicated API Key** |
| **Authorization** | The Node.js server requires an `X-API-Key` header with a pre-shared, environment-scoped secret key (`AGENT_API_KEY`). This key must be verified before processing the request. | |
| **Request Body** | JSON payload containing the qualification results. | |
| **Node.js Action** | 1. Validate `X-API-Key`. 2. Update the `form_submissions` table: `UPDATE form_submissions SET qualification_status = $1, qualification_notes = $2 WHERE id = $3`. 3. Respond with `200 OK`. | |

**Example Request Body (from Python Agent):**

```json
{
  "status": "qualified",
  "qualification_notes": "High priority: Mentioned 'immediate tender deadline'. Primary interest classified as 'Solar PV'.",
  "gemini_classification_score": 0.92
}
```

---

### 3. Gemini-Powered Qualification Logic

The core of the Lead Agent uses the Gemini model to perform complex, language-based qualification.

#### A. Lead Schema (Pydantic)

A robust Pydantic model ensures data integrity and provides clear structure for the Gemini output instructions.

```python
from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class Lead(BaseModel):
    id: int
    name: str = Field(description="Full name of the lead.")
    email: EmailStr
    company: Optional[str] = Field(description="Lead's company name, if provided.")
    message: str = Field(description="The full, unstructured message/inquiry from the lead.")
    service_interest: str = Field(description="The high-level service category selected (e.g., 'Solar', 'Battery Storage', 'Consulting').")
    
class QualificationResult(BaseModel):
    is_qualified: bool = Field(description="True if the lead meets basic criteria and is not spam/irrelevant.")
    priority_level: str = Field(description="One of: 'High (Urgent)', 'Medium', 'Low'. Based on urgency analysis.")
    primary_service_match: str = Field(description="The single best match from SEESL's services (e.g., 'Solar PV', 'Energy Audit', 'O&M'). Default to 'General Inquiry' if unsure.")
    rejection_reason: Optional[str] = Field(description="If not qualified, state the reason (e.g., 'Spam', 'Job Application', 'Irrelevant').")
    qualification_notes: str = Field(description="A concise summary of why this lead was classified this way.")

```

#### B. Advanced Gemini Criteria

We will utilize Gemini's structured output capability by defining a strong System Instruction and mapping the desired JSON output to the `QualificationResult` Pydantic model.

| Criterion | Implementation Strategy | Gemini Prompt Instruction Focus |
| :--- | :--- | :--- |
| **1. Urgency & Intent Analysis** | Analyze the `message` field for temporal constraints, emotional language (e.g., frustrated, desperate), and mentions of immediate needs (e.g., "ASAP", "deadline," "tender," "urgent"). | "Determine the **priority_level** (High/Medium/Low) based on explicit and implicit urgency in the message field. High priority requires a Human Sales follow-up within 1 hour." |
| **2. Service Matching** | Cross-reference the unstructured `message` against SEESL's known high-value offerings (e.g., Solar PV, Battery Storage, Energy Audits, O&M). | "Categorize the lead's intent into the single best value for **primary_service_match** from the following list: [Solar PV, Energy Audit, O&M, General Inquiry]. Use sophisticated contextual matching, not just keyword spotting." |
| **3. Negative Filtering** | Identify and flag non-sales inquiries such as job applications, vendor sales pitches, or clear spam/gibberish. | "Set **is_qualified** to False and provide the **rejection_reason** if the message is clearly spam, a job application, an unsolicited vendor pitch, or irrelevant to SEESL's core business." |

**Model Choice:** `gemini-2.5-flash` for its high speed, low latency, and excellent instruction-following capabilities, which are ideal for structured output qualification tasks.

---

### 4. Automated Follow-up Integration with Resend

The Python agent will handle personalized follow-up emails for qualified leads using the `resend` Python SDK.

#### Technology and Environment Variables

*   **Technology:** `resend` Python library.
*   **Environment Variable:** `RESEND_API_KEY` (must be securely stored).
*   **Data Flow:** Python Agent $\to$ Gemini (Personalization) $\to$ Resend SDK (Delivery).

#### Dynamic Content Generation (Python Snippet)

This function uses Gemini to generate a highly personalized, context-aware opening paragraph based on the lead's specific inquiry before the email is sent via Resend.

```python
import os
from google import genai
from resend import Resend

# Initialize clients using environment variables
GEMINI_CLIENT = genai.Client() 
RESEND_CLIENT = Resend(api_key=os.getenv("RESEND_API_KEY"))

def send_qualified_lead_email(lead_data: Lead, qualification_notes: str):
    """Generates a personalized opener and sends a follow-up email."""
    
    # 1. Use Gemini to generate a personalized opening paragraph
    prompt = f"""
    You are an expert sales assistant. Based on the following lead message and qualification notes, 
    generate a highly personalized, warm, and concise opening paragraph (3-4 sentences max) 
    that acknowledges their specific need and shows SEESL understood their inquiry.
    
    LEAD MESSAGE: "{lead_data.message}"
    QUALIFICATION NOTES: "{qualification_notes}"
    """
    
    try:
        response = GEMINI_CLIENT.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        personalized_opener = response.text.strip()
    except Exception as e:
        # Fallback to a generic message if AI fails
        print(f"Gemini generation failed: {e}")
        personalized_opener = "Thank you for reaching out to Solution Energy Limited. We've received your inquiry and are excited to help you."

    # 2. Construct the full email body
    email_subject = f"RE: Your Inquiry on {lead_data.primary_service_match} - Next Steps"
    
    email_body = f"""
    Dear {lead_data.name},
    
    {personalized_opener}
    
    A specialist from our team, who is focused on {lead_data.primary_service_match} solutions, 
    will review the details you provided and reach out to schedule a brief introductory call 
    within the next 4 business hours.
    
    In the meantime, feel free to review our case studies here: [Link].
    
    Sincerely,
    The SEESL Sales Team
    """

    # 3. Send the email via Resend
    RESEND_CLIENT.emails.send(
        from_='sales@solutionenergyltd.com',  # Must be a verified domain
        to=[lead_data.email],
        subject=email_subject,
        html=email_body.replace('\n', '<br>')
    )
    
    print(f"Sent follow-up email to {lead_data.email}")
```

---

### 5. AI Customer Service Agent (RAG Architecture)

The Customer Service Agent uses a **Retrieval-Augmented Generation (RAG)** approach to provide accurate, up-to-date answers based on the company's knowledge base.

#### A. Knowledge Base Creation

1.  **Scraping:** A dedicated Python script (one-time or scheduled) uses `requests` and `beautifulsoup4` to scrape text content from key web pages: `services/*.html` and `blog/index.html`.
2.  **Chunking:** The scraped text is split into small, semantically meaningful chunks (e.g., 256-512 tokens with overlap).
3.  **Embedding:** Each text chunk is converted into a vector embedding using Google's `text-embedding-004` model via the `google-genai` library.
4.  **Vector Store:** The text chunks and their corresponding embeddings are stored in a **FAISS** index (`faiss-cpu`) for efficient nearest-neighbor search. This index is persisted to disk and loaded into memory when the agent starts.

#### B. Chat API Endpoint (Node.js)

The Node.js backend acts as a lightweight proxy, handling authentication/session management before forwarding the request.

*   **Method/Route:** `POST /api/v1/chat`
*   **Request Body:** `{"session_id": "...", "user_query": "What is the expected ROI for solar PV?"}`
*   **Action:** The Node.js server validates the request and forwards the `user_query` to the Python Customer Service Agent (e.g., via an internal HTTP request or gRPC).

#### C. RAG Workflow (Python Agent)

The agent executes the following steps upon receiving a user query:

1.  **Receive Query:** Python Agent receives the `user_query` from the Node.js proxy.
2.  **Retrieval (Vector Search):** The agent takes the `user_query`, creates an embedding for it, and performs a similarity search against the loaded **FAISS** index. It retrieves the **Top K** (e.g., K=4) most relevant text chunks from the knowledge base.
3.  **Prompt Augmentation:** The retrieved text snippets (the **Context**) are injected into a specialized prompt template for Gemini.
    ```
    SYSTEM INSTRUCTION: You are the helpful, accurate, and concise AI Customer Service Agent for Solution Energy Limited. You MUST only answer questions using the provided context. If the context does not contain the answer, state, "I cannot find the answer in our documentation, but I will connect you with a specialist."
    
    CONTEXT:
    ---
    [Snippet 1 from Solar PV page]
    [Snippet 2 from ROI blog post]
    [Snippet 3 from O&M services page]
    ---
    
    USER QUESTION: {user_query}
    ```
4.  **Generation (Gemini):** The augmented prompt is sent to `gemini-2.5-flash` using the streaming API (`client.models.generate_content_stream`).
5.  **Streaming Response:** The Python agent streams the generated chunks of the answer back to the Node.js proxy. The Node.js proxy then streams this response directly to the frontend (e.g., using Server-Sent Events or a WebSocket connection) for a fast, responsive chat experience.

---

### 6. Complete Tool & Dependency Manifest

This manifest outlines the required libraries for each component, ensuring a complete and deployable system.

#### Python Agent Services (Lead Qualification & Customer Service)

| Library | Role | Service |
| :--- | :--- | :--- |
| **`google-generativeai`** | Core AI intelligence (Gemini API access, embedding, generation) | Both Agents |
| **`psycopg2-binary`** | Secure, event-driven PostgreSQL interaction (`LISTEN`/`NOTIFY`, data fetching) | Lead Agent |
| **`resend`** | Transactional email delivery API | Lead Agent |
| **`pydantic`** | Data validation and structured output schema definition | Lead Agent |
| **`beautifulsoup4`** | HTML parsing and knowledge base scraping | CS Agent (KB Builder) |
| **`faiss-cpu`** | High-performance vector store for RAG retrieval | CS Agent (RAG) |
| **`python-dotenv`** | Local environment variable management (for development) | Both Agents |
| **`requests`** | General HTTP client for status update API calls and web scraping | Both Agents |

#### Node.js Backend Services

| Component | Role | Changes Required |
| :--- | :--- | :--- |
| **Node.js/Express** | Backend API, form submission handling | **New Routes:** `PATCH /api/v1/leads/:id/status`, `POST /api/v1/chat` |
| **`pg` (or similar)** | PostgreSQL driver | Modification to `POST /submit-form` to execute `NOTIFY` command. |
| **No New Major Dependencies** | The existing framework is sufficient, focusing on API route creation and proxying. | |