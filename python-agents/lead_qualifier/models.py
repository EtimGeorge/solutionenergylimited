from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class Lead(BaseModel):
    """Represents the raw lead data fetched from the database."""
    id: int
    name: str = Field(description="Full name of the lead.")
    email: EmailStr
    company: Optional[str] = Field(description="Lead's company name, if provided.")
    message: str = Field(description="The full, unstructured message/inquiry from the lead.")
    service_interest: Optional[str] = Field(description="The service category selected from the form.")
    source: Optional[str] = Field(description="The origin of the lead (e.g., 'webform', 'chatbot').")

class QualificationResult(BaseModel):
    """Defines the structured output we expect from the Gemini API for qualification."""
    is_qualified: bool = Field(description="True if the lead is a potential customer and not spam.")
    priority_level: str = Field(description="One of: 'High', 'Medium', 'Low'. Based on urgency analysis.")
    primary_service_match: str = Field(description="The single best service match from SEESL's offerings.")
    rejection_reason: Optional[str] = Field(description="If not qualified, the reason (e.g., 'Spam', 'Job Application').")
    qualification_notes: str = Field(description="A concise summary for the sales team, highlighting key points from the lead's message.")
    gemini_score: float = Field(description="A confidence score from 0.0 to 1.0 on the quality of the lead.")
