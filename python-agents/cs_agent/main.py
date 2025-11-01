from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn

# Import the RAG logic from our new handler
from rag_handler import answer_query

app = FastAPI(
    title="SEESL Customer Service Agent",
    description="An AI agent for answering customer questions based on a knowledge base.",
    version="1.0.0"
)

# --- Pydantic Models for API ---
class ChatRequest(BaseModel):
    user_query: str
    conversation_id: str = None # Optional: for maintaining context

class ChatResponse(BaseModel):
    answer: str
    source: str = "No source found"

# --- API Endpoints ---

@app.post("/chat", response_model=ChatResponse)
async def handle_chat(request: ChatRequest):
    """Handles a user's chat query using the RAG handler."""
    print(f"Received query: {request.user_query}")
    
    # Use the real RAG logic to get an answer
    answer, source = await answer_query(request.user_query)
    
    if not answer:
        raise HTTPException(status_code=500, detail="Failed to generate an answer.")

    return ChatResponse(answer=answer, source=source)

@app.get("/health")
def health_check():
    """A simple health check endpoint."""
    return {"status": "ok"}

# --- Main Execution ---

if __name__ == "__main__":
    print("Starting Customer Service Agent server...")
    # The server will run on http://127.0.0.1:8001
    uvicorn.run(app, host="127.0.0.1", port=8001)
