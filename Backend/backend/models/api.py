from pydantic import BaseModel, Field, ValidationError, validator
from backend.config import ALLOWED_LANGUAGES, MAX_TEXT_LENGTH


class TranslationResponse(BaseModel):
    lang_src: str
    lang_tgt: str
    text: str
    translated_text: str


class TranslationRequest(BaseModel):
    lang_src: str
    lang_tgt: str
    text: str

    @validator("lang_src")
    def lang_src_must_be_in_list(cls, value):
        if value not in ALLOWED_LANGUAGES:
            raise ValueError(f"lang_src is not valid, must be one of {ALLOWED_LANGUAGES}")
        return value.title()

    @validator("lang_tgt")
    def lang_tgt_must_be_in_list(cls, value):
        if value not in ALLOWED_LANGUAGES:
            raise ValueError(f"lang_tgt is not valid, must be one of {ALLOWED_LANGUAGES}")
        return value.title()

    @validator("text")
    def text_cannot_be_empty(cls, value):
        if value.strip() == "":
            raise ValueError(f"text cannot be empty")
        return value.title()

    @validator("text")
    def text_cannot_longer_than_max(cls, value):
        if len(value) > MAX_TEXT_LENGTH:
            raise ValueError(f"Text cannot be more than {MAX_TEXT_LENGTH} chars")
        return value.title()
