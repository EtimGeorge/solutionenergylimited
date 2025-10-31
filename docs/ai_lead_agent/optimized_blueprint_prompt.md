You are a **Principal Integration Architect** specializing in hybrid-stack microservices and applied AI. Your core expertise lies in designing and deploying resilient, scalable systems that interface Python-based AI agents (powered by models like Google Gemini) with Node.js backend APIs. You have a deep, practical understanding of RAG (Retrieval-Augmented Generation), asynchronous communication patterns, and secure database interaction.

**TASK:** Architect a comprehensive, production-grade technical blueprint to integrate **two distinct Python-based AI agents** into the existing Solution Energy Limited web application: a **Lead Qualification Agent** and a **Customer Service Agent**.

**EXISTING SYSTEM CONTEXT:**
1.  **Primary Goal:** The new system must automate lead qualification and provide instant, AI-powered customer support.
2.  **Node.js Backend:** The existing Node.js/Express backend handles all form submissions via a `POST /submit-form` endpoint.
3.  **Database:** New leads are immediately inserted into a **PostgreSQL** database in a table named `form_submissions`.
4.  **Email Service:** The backend currently uses **Resend** for all transactional email.
5.  **Core AI Technology:** Both Python agents **must** use the `google-generativeai` Python library (the Gemini module) for their core intelligence.
6.  **Architectural Priority:** The design must prioritize **security, accuracy, resilience, and efficient database usage.**

**DELIVERABLE/BLUEPRINT REQUIREMENTS:**
Provide a detailed technical document that covers the following 6 stages.

1.  **Lead Agent Triggering Architecture:** Propose and recommend a method for the Python Lead Qualification Agent to become aware of new leads in the PostgreSQL `form_submissions` table. Evaluate **Periodic Polling** vs. **PostgreSQL's `LISTEN`/`NOTIFY` feature** and justify your final recommendation.

2.  **Secure Data Exchange & Status Update:** Detail the process for the Python agent to fetch lead data and for the Node.js backend to receive status updates.
    *   **Data Fetching:** The agent will connect directly to the PostgreSQL database to retrieve lead information.
    *   **Status Update API:** Define a new, secure API endpoint on the Node.js server (e.g., `PATCH /api/v1/leads/:id/status`) that the Python agent can call to update a lead's status (e.g., 'qualified', 'unqualified') and add qualification notes.

3.  **Gemini-Powered Qualification Logic:**
    *   **Lead Schema (Pydantic):** Define a Pydantic model for the lead object that exactly matches the `form_submissions` table structure (`name`, `email`, `company`, `message`, `service_interest`, etc.).
    *   **Advanced Gemini Criteria:** Provide **three distinct qualification criteria** that leverage the Gemini model's language understanding capabilities via the `google-generativeai` library.
        1.  **Urgency & Intent Analysis:** Use Gemini to analyze the `message` field to determine if the lead's intent is 'urgent' or 'high-priority' (e.g., mentioning deadlines, tenders, immediate needs).
        2.  **Service Matching:** Use Gemini to parse the `message` and categorize the lead's needs against a predefined list of SEESL's high-value services, even if not explicitly selected in the dropdown.
        3.  **Negative Filtering:** Use Gemini to identify and disqualify inquiries that are clearly spam, job applications, or otherwise irrelevant.

4.  **Automated Follow-up Integration with Resend:**
    *   **Technology Choice:** Specify that the Python agent must use the `resend` Python library. Detail the necessary environment variables.
    *   **Dynamic Content Generation:** Provide a Python code snippet for a function `send_qualified_lead_email(lead_data)`. This function should use the **Gemini module** to generate a short, personalized opening paragraph for the email based on the lead's inquiry before handing off to `resend` to send it.

5.  **AI Customer Service Agent (RAG Architecture):**
    *   **Knowledge Base Creation:** Describe a process to create a knowledge base from the website's content. This should involve scraping the text from `services/*.html` and `blog/index.html` pages and storing it in a searchable format (e.g., as embeddings in a vector store like FAISS).
    *   **Chat API Endpoint:** Define a new API endpoint in Node.js (e.g., `POST /api/v1/chat`) that the frontend can call. This endpoint will proxy requests to the Python Customer Service Agent.
    *   **RAG Workflow:** Detail the steps the Python agent will take upon receiving a user query: 
        1.  The agent receives the user's question.
        2.  It searches the knowledge base for the most relevant content snippets.
        3.  It passes the user's question and the retrieved snippets into a prompt for the Gemini model (`google-generativeai`).
        4.  It streams the generated answer back to the Node.js endpoint, which relays it to the user.

6.  **Complete Tool & Dependency Manifest:**
    *   **Python:** List all essential Python libraries: `google-generativeai`, `psycopg2-binary`, `resend`, `pydantic`, `python-dotenv`, `beautifulsoup4` (for scraping), and a library for vector embeddings (e.g., `numpy`, `faiss-cpu`).
    *   **Node.js:** State that no new major dependencies are required, but acknowledge the need for new API routes for chat and status updates.
