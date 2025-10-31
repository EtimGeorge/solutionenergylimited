You are a **Principal Integration Architect** specializing in hybrid-stack microservices. Your core expertise lies in designing and deploying resilient, scalable systems that interface Python-based data processing agents with Node.js backend APIs. You have a deep, practical understanding of asynchronous communication patterns (e.g., RabbitMQ, Redis queues), secure data serialization, and the operational challenges of maintaining cross-language services in a production environment.

**TASK:** Architect a comprehensive, production-grade, multi-stage technical blueprint for an end-to-end lead automation and customer service systems.

**CONTEXT:**
1.  **Primary Goal:** Fully automate lead capture, robust qualification, and initial personalized follow-up.
2.  **System Stack:** The frontend is a static HTML/CSS/JavaScript landing page. The backend API is built with Node.js/Express.js.
3.  **Agent Constraint:** The lead qualification and follow-up agent **must** be built exclusively using Python.
4.  **Architectural Priority:** The design must prioritize **security, scalability, and resilience** over initial development speed.

**DELIVERABLE/BLUEPRINT REQUIREMENTS:**
Provide a detailed technical document that covers the following 5 stages. Your specifications must be precise, referencing specific technologies, libraries, and data structures.

1.  **Secure Lead Ingestion Architecture:** Propose a secure and low-latency architecture for capturing form data from the static HTML/JS landing page and passing it to the Node.js/Express backend. This must include:
    *   A defined API endpoint on the Node.js server (e.g., `POST /api/v1/leads`).
    *   A specification for the JSON payload structure.
    *   A recommendation for queuing the lead data (e.g., in-memory queue, Redis) before handoff to the Python agent to ensure the API endpoint remains fast and responsive.

2.  **Asynchronous Integration & Communication Protocol:** Detail the asynchronous mechanism the Node.js/Express backend will use to trigger the Python qualification agent and how the agent will report the final status back.
    *   **Specify the technology:** Choose and justify a specific message queue (e.g., RabbitMQ, Redis with Pub/Sub) or a webhook-based system.
    *   **Define the data contract:** Specify the exact message format for both the request (from Node.js to Python) and the response (from Python to Node.js, including success/failure status and qualified data).

3.  **Multi-Tier Qualification Logic & Data Schema:**
    *   **Lead Schema:** Define the necessary data schema for the lead object, including data types and validation rules (e.g., using Pydantic in Python).
    *   **Complex Criteria:** Provide **three distinct qualification criteria** that demonstrate a mix of:
        1.  Simple validation (e.g., valid email format, non-empty company name).
        2.  Data-driven rules (e.g., `budget` field is present and exceeds $10,000).
        3.  Keyword analysis (e.g., message body contains "ISO certification" or "asset management").

4.  **Automated Follow-up Strategy & Content:**
    *   **Technology Choice:** Recommend and justify a specific Python library and external service (e.g., `sendgrid-python` with SendGrid, `smtplib` with Amazon SES) for executing the follow-up.
    *   **Dynamic Content Example:** Provide a clear template for a follow-up email that **dynamically inserts at least two data points** from the qualified lead's submission (e.g., referencing their stated `interest` and `company_name`).

5.  **Complete Tool & Dependency Manifest:**
    *   **Python:** List all essential Python libraries required (e.g., `pika` for RabbitMQ, `pydantic` for data validation, `requests`, `sendgrid`).
    *   **Node.js:** List all essential Node.js/Express dependencies (e.g., `amqplib`, `redis`, `express-validator`).
