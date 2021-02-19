from fastapi import APIRouter, Query, HTTPException
from loguru import logger
from backend.services.translation import translation

from backend import config
from backend.models.api import (
    TranslationResponse
)
from backend.config import ALLOWED_LANGUAGES, MAX_TEXT_LENGTH

router = APIRouter()

@router.post("/translate", response_model=TranslationResponse, name="translate:translate")
def index(lang: str, text: str = Query(..., min_length=1, max_length=MAX_TEXT_LENGTH)):

    if lang not in ALLOWED_LANGUAGES:
        msg = f"Language is not valid, must be one of {ALLOWED_LANGUAGES}"
        logger.error(msg)
        raise HTTPException(
            status_code=400,
            detail={
                "msg": msg
            },
        )

    if text.strip() == "":
        msg = f"Text cannot be empty"
        logger.error(msg)
        raise HTTPException(
            status_code=400,
            detail={"msg": msg},
        )

    if text:
        translated_text = translation.translate(text, lang)

    return TranslationResponse(
        lang = lang,
        text = text,
        translated_text = translated_text
    )


@router.get("/getAvailableLanguages", response_model=list[str], name="translate:languages")
def index():
    return ALLOWED_LANGUAGES