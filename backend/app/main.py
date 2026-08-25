import time
import logging
from datetime import datetime, timezone
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .settings import settings
from .db import Base, engine, get_db
from .routers import careers, contractors, dashboard, letters, auth, analytics, admin

try:
    from .routers import projects
except Exception:
    projects = None

# Configure production logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("siidstarc")

# Ensure database tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    description="Enterprise API for SIID - Smart Innovation & Infrastructure Design platform",
    docs_url="/docs" if settings.ENABLE_DOCS else None,
    redoc_url="/redoc" if settings.ENABLE_DOCS else None,
)

# Production CORS Security Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware: Low-Latency Latency Tracking Header (X-Response-Time)
@app.middleware("http")
async def add_response_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Response-Time"] = f"{process_time:.4f}s"
    return response

# Global Error Handlers: Standardized Enterprise Error Payloads
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.status_code,
                "message": exc.detail,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        },
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Server Error on path {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": 500,
                "message": "An internal server error occurred. Please try again later.",
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        },
    )

# Production Health Check Endpoints for Load Balancers (AWS ALB / Kubernetes)
@app.get("/healthz", tags=["System Health"])
def healthz():
    """Liveness probe endpoint for load balancers."""
    return {"ok": True, "service": settings.APP_TITLE, "environment": settings.ENVIRONMENT}

@app.get("/api/v1/health", tags=["System Health"])
def health_check():
    """Readiness probe endpoint for application monitoring."""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# Register Production Router Modules
app.include_router(careers.router, prefix="/api/v1")
app.include_router(contractors.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(letters.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")

if projects is not None:
    app.include_router(projects.router, prefix="/api/v1")

@app.get("/", tags=["System Info"])
def root_info():
    return {
        "service": settings.APP_TITLE,
        "version": settings.APP_VERSION,
        "status": "online",
        "docs": "/docs" if settings.ENABLE_DOCS else "disabled"
    }
