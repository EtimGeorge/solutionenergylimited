import psycopg2
import psycopg2.extensions
import psycopg2.extras
import select
import os
import time
import json
import requests
import google.generativeai as genai
from dotenv import load_dotenv

# Import Pydantic models for type safety
from models import Lead, QualificationResult
# Placeholder for the emailer function (assumed to be implemented separately)
from emailer import send_qualified_lead_email

# Load environment variables from .env file
load_dotenv(dotenv_path='C:/Users/user/Desktop/solutionenergylimited/backend/.env')

# --- Configuration ---
DB_CONN_STRING = os.getenv("DATABASE_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
AGENT_API_KEY = os.getenv("AGENT_API_KEY")
# Base URL for the Node.js backend API
API_BASE_URL = "http://localhost:3000" 

# Configure the Gemini client with the API key
genai.configure(api_key=GEMINI_API_KEY)

# --- Core Functions ---

def get_lead_from_db(lead_id: str):
    """Fetches lead data from the PostgreSQL database using psycopg2."""
    try:
        # Connect to the database using the connection string
        with psycopg2.connect(DB_CONN_STRING) as conn:
            # Create a cursor that returns results as dictionaries (DictCursor)
            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as curs:
                # Execute the query to fetch the form submission data
                query = "SELECT id, name, email, company, message, service_interest, source FROM form_submissions WHERE id = %s"
                curs.execute(query, (lead_id,))
                record = curs.fetchone()
                if record:
                    print(f"Successfully fetched lead {lead_id} from DB.")
                    # Return a Pydantic Lead object
                    return Lead(**record)
    except Exception as e:
        print(f"[ERROR] Failed to fetch lead {lead_id} from DB: {e}")
    return None

def qualify_lead_with_gemini(lead: Lead) -> QualificationResult:
    """Uses Gemini API (Agent 2) to qualify a lead with structured JSON output."""
    print(f"Qualifying lead {lead.id} with Gemini...")
    # Initialize the LLM model for qualification
    model = genai.GenerativeModel('gemini-pro')

    # Agent 2 System Prompt: The Lead Scoring and Prioritization Engine (Master Analyst)
    prompt = f"""
You are a dedicated Lead Scoring and Prioritization Engine (a Level-5 Analyst) for the Solution Energy Limited (SEESL) Sales Development Team. Your output is non-negotiable and used directly for sales workflow automation. Your sole task is to analyze the provided lead data and produce a structured, flawless JSON object.

**NON-NEGOTIABLE CONSTANTS (Must be strictly adhered to):**

**SEESL SERVICE CATEGORIES (primary_service_match must be one of these):**
- Asset Management Consulting
- ISO Certification & Audits
- Renewable Energy Project Management
- Oil & Gas Equipment Procurement
- Industrial Safety & Process Audits

**GEMINI LEAD SCORING RUBRIC (gemini_score 0.0 to 1.0 - APPLY STRICTLY):**
- **0.0 - 0.1 (Spam/Irrelevant):** Spam, job applications, or nonsensical inquiries.
- **0.2 - 0.3 (Information Gathering):** Early research phase or broad information request without specific intent.
- **0.4 - 0.5 (Low Priority):** General inquiry about SEESL services, no clear timeline or budget mentioned.
- **0.6 - 0.7 (Medium Priority):** Specific service interest, some project details, medium urgency or request for general pricing.
- **0.8 - 0.9 (High Priority):** Clear service need, timeline or budget implied, mention of a future project.
- **1.0 (Sales Ready / Top Priority):** Explicit budget, defined timeline, specific project scope, tender mention, or decision-maker identified.

**Lead Information:**
- Name: {lead.name}
- Company: {lead.company or 'Not provided'}
- Service of Interest (Initial): {lead.service_interest or 'Not specified'}
- Source: {lead.source or 'Unknown'}
- Message: "{lead.message}"

**Your Actions:**
1.  **Qualification:** Determine if this is a legitimate business inquiry. Reject spam, job applications, or nonsensical messages by setting `is_qualified: false`.
2.  **Priority:** Assess the urgency and potential value.
3.  **Service Match:** Identify the single most relevant service SEESL can offer. The output for `primary_service_match` **MUST** be an exact match for one item in the **SEESL SERVICE CATEGORIES** list. If none match, use the most general category or 'Asset Management Consulting' as a default business service.
4.  **Summarization:** Create a concise, one-sentence summary for the sales team.
5.  **Scoring:** Provide a confidence score (`gemini_score`) from 0.0 to 1.0 that is a direct, honest application of the **GEMINI LEAD SCORING RUBRIC**.

**Output Format:**
Return a single, minified JSON object that strictly conforms to the Pydantic model. Do not include any explanation or additional text outside of the JSON.

```json
{{
    "is_qualified": boolean,
    "priority_level": "'High'|'Medium'|'Low'",
    "primary_service_match": "string (MUST be one of the defined SEESL SERVICE CATEGORIES)",
    "rejection_reason": "string or null",
    "qualification_notes": "string",
    "gemini_score": float (0.0 to 1.0, strictly applying the Rubric)
}}
```
"""
    
    try:
        # Generate content from the prompt
        response = model.generate_content(prompt)
        # Clean up the response: remove newlines, code block markers for reliable JSON parsing
        json_text = response.text.strip().replace('\n', '').replace('```json', '').replace('```', '')
        # Parse the cleaned JSON string
        result_json = json.loads(json_text)
        print(f"Successfully received qualification data from Gemini for lead {lead.id}.")
        # Return a Pydantic QualificationResult object
        return QualificationResult(**result_json)
    except Exception as e:
        print(f"[ERROR] Gemini API call or JSON parsing failed for lead {lead.id}: {e}")
        return None

def update_lead_status(lead_id: int, result: QualificationResult):
    """Updates the lead status in the database via the Node.js API endpoint."""
    url = f"{API_BASE_URL}/api/v1/leads/{lead_id}/status"
    # Headers include content type and the internal API key for authentication
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': AGENT_API_KEY
    }
    # Payload for the API patch request
    payload = {
        "status": "qualified" if result.is_qualified else "unqualified",
        "qualification_notes": result.qualification_notes,
        "gemini_score": result.gemini_score
    }

    try:
        print(f"Updating status for lead {lead_id} via API...")
        # Send a PATCH request to the backend API
        response = requests.patch(url, headers=headers, json=payload)
        # Check for HTTP errors (4xx or 5xx)
        response.raise_for_status() 
        print(f"Successfully updated status for lead {lead_id}.")
        return True
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] API call to update lead {lead_id} failed: {e}")
        return False

def process_lead(lead_id: str):
    """The main processing pipeline for a single lead: Fetch -> Qualify -> Update Status -> Email."""
    print(f"--- PROCESSING LEAD ID: {lead_id} ---")

    # Step 1: Fetch lead data
    lead = get_lead_from_db(lead_id)
    if not lead:
        return

    # Step 2: Qualify the lead using the LLM (Agent 2)
    qualification_result = qualify_lead_with_gemini(lead)
    if not qualification_result:
        return

    # Step 3: Update the lead status in the backend system
    update_success = update_lead_status(lead.id, qualification_result)
    if not update_success:
        return

    # Step 4: Conditional follow-up action
    if qualification_result.is_qualified:
        print(f"Lead {lead.id} is QUALIFIED. Triggering follow-up email.")
        # Send an internal notification/email to the sales team
        send_qualified_lead_email(lead, qualification_result)
    else:
        print(f"Lead {lead.id} is UNQUALIFIED. Reason: {qualification_result.rejection_reason}")

    print(f"--- FINISHED PROCESSING: {lead_id} ---")

def listen_for_leads():
    """Connects to the database and listens for new lead notifications using PostgreSQL's LISTEN/NOTIFY."""
    print("Starting lead listener...")
    while True:
        try:
            # Establish database connection
            conn = psycopg2.connect(DB_CONN_STRING)
            # Set isolation level to allow LISTEN/NOTIFY (needs autocommit)
            conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)

            curs = conn.cursor()
            # Start listening on the specified channel
            curs.execute("LISTEN new_lead_channel;")
            print("Listener connected and waiting for new leads...")

            while True:
                # Use select.select to wait for data on the connection's file descriptor
                # Checks if the connection object (conn) is ready for reading, with a 5-second timeout
                if select.select([conn], [], [], 5) == ([], [], []):
                    # No notification received, continue the loop
                    continue
                
                # Poll the connection to update its status and retrieve pending notifications
                conn.poll()
                # Process all queued notifications
                while conn.notifies:
                    notify = conn.notifies.pop(0)
                    print(f"\nReceived notification for lead ID: {notify.payload}")
                    # Trigger the lead processing pipeline
                    process_lead(notify.payload)

        except (psycopg2.OperationalError, psycopg2.InterfaceError) as e:
            # Handle database connection loss (e.g., server restart)
            print(f"\nDatabase connection error: {e}. Reconnecting in 10 seconds...")
            time.sleep(10)
        except Exception as e:
            # Handle other unexpected errors
            print(f"\nAn unexpected error occurred in listener: {e}")
            time.sleep(5)

if __name__ == "__main__":
    # Ensure all critical environment variables are set before starting
    if not all([DB_CONN_STRING, GEMINI_API_KEY, AGENT_API_KEY]):
        print("[FATAL] One or more environment variables (DATABASE_URL, GEMINI_API_KEY, AGENT_API_KEY) are not set.")
    else:
        # Start the main lead listening loop
        listen_for_leads()

