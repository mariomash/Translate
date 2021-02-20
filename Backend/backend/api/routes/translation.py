from fastapi import APIRouter, Query, HTTPException
from loguru import logger
from backend.services.translation import translation

from fastapi import Body
from pydantic import BaseModel

from backend import config
from backend.models.api import (
    TranslationResponse,
    TranslationRequest
)
from backend.config import ALLOWED_LANGUAGES, MAX_TEXT_LENGTH

router = APIRouter()

@router.post("/translate", response_model=TranslationResponse, name="translate:translate")
def translate(translationRequest: TranslationRequest):

# This was for a GET request... but we would be limited then by the max Url Length..
# Still, FastAPI has a nice way of validating params... it's a shame we cannot use it
# with POST requests
#def translate(lang: str, text: str = Query(..., min_length=1, max_length=MAX_TEXT_LENGTH)):

    translated_text = translation.translate(translationRequest.text.strip(), translationRequest.lang)

    return TranslationResponse(
        lang = translationRequest.lang,
        text = translationRequest.text,
        translated_text = translated_text
    )


@router.get("/getAvailableLanguages", response_model=list[str], name="translate:languages")
def getAvailableLanguages():
    return ALLOWED_LANGUAGES