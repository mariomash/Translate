from fastapi import APIRouter, Query, HTTPException
from loguru import logger
from backend.services.translation import translation

from fastapi import Body
from pydantic import BaseModel

from backend import config
from backend.models.api import (
    TranslationResponse
)
from backend.config import ALLOWED_LANGUAGES, MAX_TEXT_LENGTH

class TranslationRequest(BaseModel):
    lang: str
    text: str

router = APIRouter()

@router.post("/translate", response_model=TranslationResponse, name="translate:translate")
def translate(translationRequest: TranslationRequest):

# This was for a GET request... but we would be limited then by the max Url Length..
# Still, FastAPI has a nice way of validating params... it's a shame we cannot use it
# with POST requests
#def translate(lang: str, text: str = Query(..., min_length=1, max_length=MAX_TEXT_LENGTH)):

    if translationRequest.lang not in ALLOWED_LANGUAGES:
        msg = f"Language is not valid, must be one of {ALLOWED_LANGUAGES}"
        logger.error(msg)
        raise HTTPException(
            status_code=400,
            detail={
                "msg": msg
            },
        )

    if translationRequest.text.strip() == "":
        msg = f"Text cannot be empty"
        logger.error(msg)
        raise HTTPException(
            status_code=400,
            detail={"msg": msg},
        )

    if len(translationRequest.text) > MAX_TEXT_LENGTH:
        msg = f"Text cannot be more than {MAX_TEXT_LENGTH} chars"
        logger.error(msg)
        raise HTTPException(
            status_code=400,
            detail={"msg": msg},
        )

    translated_text = translation.translate(translationRequest.text.strip(), translationRequest.lang)

    return TranslationResponse(
        lang = translationRequest.lang,
        text = translationRequest.text,
        translated_text = translated_text
    )


@router.get("/getAvailableLanguages", response_model=list[str], name="translate:languages")
def getAvailableLanguages():
    return ALLOWED_LANGUAGES