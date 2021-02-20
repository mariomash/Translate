import sys
from fastapi import FastAPI, Request
from loguru import logger
from starlette.routing import Match
from starlette.middleware.cors import CORSMiddleware

from backend.api.routes.api import router as api_router
from backend.config import APP_NAME, DEBUG, VERSION, ALLOWED_HOSTS, API_PREFIX


def get_app() -> FastAPI:
    app = FastAPI(title=APP_NAME, debug=DEBUG, version=VERSION)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_HOSTS or ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix=API_PREFIX)
    return app


logger.remove()
logger.add(
    sys.stdout,
    colorize=True,
    format="<green>{time:HH:mm:ss}</green> | {level} | <level>{message}</level>",
)

app = get_app()


@app.middleware("http")
async def log_middle(request: Request, call_next):
    logger.debug(f"{request.method} {request.url}")
    routes = request.app.router.routes
    logger.debug("Params:")
    for route in routes:
        match, scope = route.matches(request)
        if match == Match.FULL:
            for name, value in scope["path_params"].items():
                logger.debug(f"\t{name}: {value}")
    logger.debug("Headers:")
    for name, value in request.headers.items():
        logger.debug(f"\t{name}: {value}")

    response = await call_next(request)
    return response
