from backend.services.translation import translation
from fastapi import APIRouter

from backend.api.routes import translation

router = APIRouter()
router.include_router(translation.router, tags=["translation"], prefix="/translation")
