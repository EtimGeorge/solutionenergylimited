import os
import google.generativeai as genai
import resend
from dotenv import load_dotenv

from models import Lead, QualificationResult

# Load environment variables dynamically
dotenv_path = os.getenv('DOTENV_PATH')
if dotenv_path:
    load_dotenv(dotenv_path=dotenv_path)
else:
    # Construct path for local development
    backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))
    load_dotenv(dotenv_path=os.path.join(backend_dir, '.env'))

# --- Configuration ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "SEESL Sales <sales@yourverifieddomain.com>") # Fallback email

genai.configure(api_key=GEMINI_API_KEY)
resend.api_key = RESEND_API_KEY
gemini_model = genai.GenerativeModel('gemini-pro')

def generate_personalized_opener(lead: Lead, qualification_result: QualificationResult) -> str:
    """Generates a personalized opening paragraph for a follow-up email."""
    print(f"Generating personalized email opener for lead {lead.id}...")
    
    prompt = f"""
    You are an expert sales assistant for Solution Energy Limited (SEESL). Your task is to write a warm, personalized, and concise opening paragraph (2-3 sentences) for an email to a newly qualified lead. 
    
    **Key Objectives:**
    - Acknowledge their specific inquiry.
    - Show that a human has reviewed their message.
    - Reassure them that a specialist is on the case.

    **Lead Information:**
    - Name: {lead.name}
    - Their Message: "{lead.message}"
    - Our Internal Analysis: "{qualification_result.qualification_notes}"

    **Instructions:**
    - Address the lead by their first name.
    - Do NOT try to answer their questions directly.
    - Focus on acknowledging their request and setting the expectation that a specialist will follow up.
    - Maintain a professional and helpful tone.

    **Example Output:**
    "Thank you for reaching out to us about your asset management needs. We've reviewed the details of your inquiry and understand the importance of your upcoming project."
    """

    try:
        response = gemini_model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"[ERROR] Gemini generation for email opener failed for lead {lead.id}: {e}")
        # Return a safe, generic fallback
        return "Thank you for reaching out to Solution Energy Limited. We've received your inquiry and are reviewing the details you provided."

def send_qualified_lead_email(lead: Lead, qualification_result: QualificationResult):
    """Constructs and sends a personalized follow-up email to a qualified lead."""
    print(f"Preparing to send follow-up email to {lead.email}...")
    
    personalized_opener = generate_personalized_opener(lead, qualification_result)
    service_match = qualification_result.primary_service_match
    
    email_subject = f"Regarding your inquiry about {service_match} with SEESL"
    
    email_body = f"""
    <p>Dear {lead.name.split()[0]},</p>
    <p>{personalized_opener}</p>
    <p>To ensure you get the most accurate information, a specialist from our {service_match} team will be reviewing your request. They will reach out to you directly within one business day to discuss your specific needs.</p>
    <p>We appreciate your interest in Solution Energy Limited.</p>
    <p>Sincerely,<br>The SEESL Team</p>
    """

    try:
        resend.Emails.send(
            from_=FROM_EMAIL,
            to=[lead.email],
            subject=email_subject,
            html=email_body
        )
        print(f"Successfully sent follow-up email to {lead.email} for lead {lead.id}.")
    except Exception as e:
        print(f"[ERROR] Failed to send email via Resend for lead {lead.id}: {e}")
