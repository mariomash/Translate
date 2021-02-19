from pydantic import BaseModel, Field

class TranslationResponse(BaseModel):
    lang: str
    text: str
    translated_text: str