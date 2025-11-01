import faiss
import numpy as np
import google.generativeai as genai
import json
import os
import requests
import asyncio
from dotenv import load_dotenv

# Load environment variables from .env file in the backend directory
load_dotenv(dotenv_path='C:/Users/user/Desktop/solutionenergylimited/backend/.env')

# --- Configuration ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
AGENT_API_KEY = os.getenv("AGENT_API_KEY")
API_BASE_URL = "http://localhost:3000"
INDEX_FILE = "faiss_index.bin"
METADATA_FILE = "faiss_metadata.json"

# Configure the Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# --- Load Knowledge Base ---
try:
    print("Loading knowledge base...")
    index = faiss.read_index(INDEX_FILE)
    with open(METADATA_FILE, 'r', encoding='utf-8') as f:
        metadata = json.load(f)
    print("Knowledge base loaded successfully.")
except Exception as e:
    print(f"[FATAL] Could not load knowledge base: {e}")
    index = None
    metadata = None

# --- Lead Escalation Functions ---

def escalate_to_lead(summary: str, email: str):
    """Sends a newly identified lead to the Node.js backend."""
    url = f"{API_BASE_URL}/api/v1/leads/from-chat"
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': AGENT_API_KEY
    }
    payload = {
        "email": email,
        "summary": summary
    }
    try:
        print(f"Escalating to lead for {email}...")
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        print(f"Successfully escalated lead for {email}.")
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] API call to escalate lead failed: {e}")

async def check_for_buying_intent(user_query: str, model_answer: str):
    """Analyzes the conversation for buying intent and escalates if found."""
    print("Checking for buying intent...")
    model = genai.GenerativeModel('gemini-flash-latest')
    
    prompt = f"""
    You are a sales analyst. Your task is to determine if a user's query, combined with our AI's answer, indicates a buying intent. Also, extract the user's email address if present.

    **Conversation:**
    - User Query: "{user_query}"
    - AI Answer: "{model_answer}"

    **Analysis Criteria:**
    1.  **Buying Intent:** Does the user ask for a quote, mention a project, budget, or timeline, or ask to speak to sales? If so, `has_buying_intent` is true.
    2.  **Email Extraction:** If an email address is mentioned in the user query, extract it.

    **Output Format:**
    Return a single, minified JSON object. Do not add any other text.
    ```json
    {{
        "has_buying_intent": boolean,
        "summary": "A concise summary of the user's request if intent is true, otherwise null.",
        "email": "The extracted email address, or null if not found."
    }}
    ```
    """
    try:
        response = await model.generate_content_async(prompt)
        json_text = response.text.strip().replace('\n', '').replace('```json', '').replace('```', '')
        result = json.loads(json_text)

        if result.get("has_buying_intent") and result.get("email"):
            print(f"Buying intent DETECTED for email: {result['email']}")
            escalate_to_lead(result['summary'], result['email'])
        else:
            print("No buying intent detected.")
    except Exception as e:
        print(f"[ERROR] Failed to check for buying intent: {e}")

# --- RAG Core Functions ---

def get_relevant_chunks(query: str, k: int = 4):
    """Finds the top K most relevant chunks from the knowledge base."""
    # ... (function content remains the same)
    if not index:
        return None, None
    try:
        query_embedding = genai.embed_content(model='models/text-embedding-004', content=query, task_type="RETRIEVAL_QUERY")['embedding']
        distances, indices = index.search(np.array([query_embedding]).astype('float32'), k)
        relevant_chunks = [metadata[i]['text'] for i in indices[0]]
        sources = list(set([metadata[i]['source'] for i in indices[0]]))
        return relevant_chunks, sources
    except Exception as e:
        print(f"[ERROR] Failed to retrieve relevant chunks: {e}")
        return None, None

async def answer_query(query: str):
    """Answers a query using RAG and then checks for buying intent in the background."""
    print(f"Answering query: '{query}' using RAG...")
    relevant_chunks, sources = get_relevant_chunks(query)
    
    if relevant_chunks is None:
        return "I am currently unable to access my knowledge base. Please try again later.", "Internal Error"

    context = "\n".join(relevant_chunks)
    source_str = ", ".join(sources) if sources else "Internal Documents"

    prompt = f"""
YouAre 'Raymond', a highly professional, knowledgeable, and empathetic AI Customer Service Specialist for Solution Energy Limited (SEESL). Your primary goal is to provide clear, concise, and accurate information exclusively from the provided knowledge base, maintaining a helpful and solution-oriented demeanor. You are designed to assist potential and existing clients with inquiries about SEESL's services, operations, and general information.

Your core task is to engage in a natural, human-like conversation.

Instructions:
- **Greeting & Introduction:** For the very first interaction or if the user explicitly asks for an introduction, respond with a friendly greeting, introduce yourself as 'Raymond', and briefly welcome them to Solution Energy Limited (SEESL). Offer to assist with inquiries about SEESL's services. DO NOT repeat this introduction in subsequent turns unless explicitly prompted.
- **Prioritization:** When a specific question is asked, prioritize providing a direct and comprehensive answer to that question from the context. Only offer a general overview of SEESL's services if no specific question is asked, or if it naturally complements the answer to a broad inquiry.
- **Answering Questions:** Answer the user's specific question directly, comprehensively, and succinctly, drawing information ONLY from the "--- CONTEXT ---" provided below. Focus solely on the requested information. AVOID mentioning other services unless they are directly relevant to the user's specific query.
- **Redirection:** If the context provides a clear answer, but you believe more detailed information might be on a specific page, suggest visiting that page on the SEESL website. For example: "You can find more details on our [Service Name] page."
- **Out-of-Context Questions:** If the answer is NOT explicitly found within the provided context, you MUST state clearly and politely that you cannot find the information in your current knowledge base. DO NOT invent information or speculate.
- **Conversational Flow:** After providing an answer, always ask a polite follow-up question to encourage further interaction (e.g., "Is there anything else I can assist you with today?", "Did that answer your question?").
- **Tone:** Maintain a professional, helpful, and slightly formal tone.
- **Clarity & Conciseness:** Prioritize clarity and conciseness in your responses.
- **No Small Talk/Opinions:** Do not engage in unnecessary small talk or provide personal opinions.
- **Contact Information:** If the user asks for contact information or to speak with a human, politely suggest they visit the SEESL website's contact page or fill out a form.

--- CONTEXT ---
{context}
--- END OF CONTEXT ---

USER QUESTION: "{query}"

DELIVERABLE: Engage in a human-like conversation, following all instructions and constraints. Provide a direct, accurate, and concise answer based SOLELY on the provided CONTEXT. If the answer is not in the context, state that the information cannot be found. Always include a polite follow-up question.
"""

    try:
        model = genai.GenerativeModel('gemini-flash-latest')
        response = await model.generate_content_async(prompt)
        final_answer = response.text.strip()

        # After generating the answer, create a non-blocking task to check for intent
        asyncio.create_task(check_for_buying_intent(query, final_answer))

        return final_answer, source_str
    except Exception as e:
        print(f"[ERROR] Gemini generation for RAG failed: {e}")
        return "I encountered an issue while trying to formulate a response. Please try again.", "Internal Error"
