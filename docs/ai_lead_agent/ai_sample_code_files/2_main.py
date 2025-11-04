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

from models import Lead, QualificationResult
# Placeholder for the emailer function we will create in the next step
from emailer import send_qualified_lead_email

# Load environment variables from .env file in the backend directory
load_dotenv(dotenv_path='C:/Users/user/Desktop/solutionenergylimited/backend/.env')

# --- Configuration ---
DB_CONN_STRING = os.getenv("DATABASE_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
AGENT_API_KEY = os.getenv("AGENT_API_KEY")
API_BASE_URL = "http://localhost:3000" # Assuming Node.js server runs on port 3000

genai.configure(api_key=GEMINI_API_KEY)

# --- Core Functions ---

def get_lead_from_db(lead_id: str):
    """Fetches lead data from the database."""
    try:
        with psycopg2.connect(DB_CONN_STRING) as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as curs:
                curs.execute("SELECT id, name, email, company, message, service_interest, source FROM form_submissions WHERE id = %s", (lead_id,))
                record = curs.fetchone()
                if record:
                    print(f"Successfully fetched lead {lead_id} from DB.")
                    return Lead(**record)
    except Exception as e:
        print(f"[ERROR] Failed to fetch lead {lead_id} from DB: {e}")
    return None

def qualify_lead_with_gemini(lead: Lead) -> QualificationResult:
    """Uses Gemini API to qualify a lead with structured JSON output."""
    print(f"Qualifying lead {lead.id} with Gemini...")
    model = genai.GenerativeModel('gemini-pro')

    # Optimized System Prompt for Agent 2 (Lead Qualifier)
    prompt = f"""
YouAre a Level-5 Lead Scoring and Prioritization Engine for Solution Energy Limited (SEESL) Sales Development. Your analysis drives automated sales workflow and resource allocation.

MANDATORY CONSTRAINTS:
- Output MUST be valid, minified JSON matching the exact Pydantic schema
- Analysis must be objective, data-driven, and consistent across all lead sources
- primary_service_match MUST align exactly with one service from the SEESL Service List

SEESL SERVICE LIST (EXACT MATCH REQUIRED):
1. 'Asset Management Consulting'
2. 'ISO Certification & Compliance' 
3. 'Renewable Energy Project Management'
4. 'Oil & Gas Equipment Procurement'
5. 'Industrial Safety Audits'

LEAD SCORING RUBRIC (APPLY STRICTLY):
1.0 = Explicit budget, timeline, specific project scope, decision-maker identified
0.8-0.9 = Clear service need, timeline mentioned, budget implied
0.6-0.7 = Specific service interest, some project details, medium urgency  
0.4-0.5 = General inquiry about services, no clear timeline or budget
0.2-0.3 = Information gathering, early research phase
0.0-0.1 = Spam, job applications, irrelevant inquiries

QUALIFICATION CRITERIA:
- **Qualified**: Legitimate business inquiry with potential for SEESL services
- **Priority Assessment**: Based on urgency, project scale, and decision timeline
- **Service Matching**: Map inquiry to the most relevant SEESL service
- **Rejection Reasoning**: Clear explanation for unqualified leads

LEAD DATA:
- Name: {lead.name}
- Company: {lead.company or 'Not provided'}
- Service Interest: {lead.service_interest or 'Not specified'}
- Source: {lead.source or 'Unknown'}
- Message: "{lead.message}"

OUTPUT REQUIREMENT:
Return minified JSON only, strictly conforming to:
{{
    "is_qualified": boolean,
    "priority_level": "'High'|'Medium'|'Low'",
    "primary_service_match": "string (EXACT Service List match)",
    "rejection_reason": "string or null",
    "qualification_notes": "string",
    "gemini_score": float (0.0-1.0 per Rubric)
}}
"""

    try:
        response = model.generate_content(prompt)
        # Clean up the response to ensure it's valid JSON
        json_text = response.text.strip().replace('\n', '').replace('```json', '').replace('```', '')
        result_json = json.loads(json_text)
        print(f"Successfully received qualification data from Gemini for lead {lead.id}.")
        return QualificationResult(**result_json)
    except Exception as e:
        print(f"[ERROR] Gemini API call or JSON parsing failed for lead {lead.id}: {e}")
        return None

def update_lead_status(lead_id: int, result: QualificationResult):
    """Updates the lead status in the database via the Node.js API."""
    url = f"{API_BASE_URL}/api/v1/leads/{lead_id}/status"
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': AGENT_API_KEY
    }
    payload = {
        "status": "qualified" if result.is_qualified else "unqualified",
        "qualification_notes": result.qualification_notes,
        "gemini_score": result.gemini_score
    }

    try:
        print(f"Updating status for lead {lead_id} via API...")
        response = requests.patch(url, headers=headers, json=payload)
        response.raise_for_status() # Raises an HTTPError for bad responses (4xx or 5xx)
        print(f"Successfully updated status for lead {lead_id}.")
        return True
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] API call to update lead {lead_id} failed: {e}")
        return False

def process_lead(lead_id: str):
    """The main processing pipeline for a single lead."""
    print(f"--- PROCESSING LEAD ID: {lead_id} ---")
    lead = get_lead_from_db(lead_id)
    if not lead:
        return

    qualification_result = qualify_lead_with_gemini(lead)
    if not qualification_result:
        return

    update_success = update_lead_status(lead.id, qualification_result)
    if not update_success:
        return

    if qualification_result.is_qualified:
        print(f"Lead {lead.id} is QUALIFIED. Triggering follow-up email.")
        # This function will be implemented in the next step
        send_qualified_lead_email(lead, qualification_result)
    else:
        print(f"Lead {lead.id} is UNQUALIFIED. Reason: {qualification_result.rejection_reason}")
    
    print(f"--- FINISHED PROCESSING: {lead_id} ---")

def listen_for_leads():
    """Connects to the database and listens for new lead notifications."""
    print("Starting lead listener...")
    while True:
        try:
            conn = psycopg2.connect(DB_CONN_STRING)
            conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
            
            curs = conn.cursor()
            curs.execute("LISTEN new_lead_channel;")
            print("Listener connected and waiting for new leads...")

            while True:
                if select.select([conn], [], [], 5) == ([], [], []):
                    continue
                
                conn.poll()
                while conn.notifies:
                    notify = conn.notifies.pop(0)
                    print(f"\nReceived notification for lead ID: {notify.payload}")
                    process_lead(notify.payload)

        except (psycopg2.OperationalError, psycopg2.InterfaceError) as e:
            print(f"\nDatabase connection error: {e}. Reconnecting in 10 seconds...")
            time.sleep(10)
        except Exception as e:
            print(f"\nAn unexpected error occurred in listener: {e}")
            time.sleep(5)

if __name__ == "__main__":
    if not all([DB_CONN_STRING, GEMINI_API_KEY, AGENT_API_KEY]):
        print("[FATAL] One or more environment variables (DATABASE_URL, GEMINI_API_KEY, AGENT_API_KEY) are not set.")
    else:
        listen_for_leads()