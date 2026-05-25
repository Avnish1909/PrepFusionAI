import os
import json
import shutil
import uuid
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from rag_pipeline import MultiModalRAGPipeline

app = FastAPI(title="MultiModal RAG API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
DB_DIR = Path("chroma_db")
UPLOAD_DIR.mkdir(exist_ok=True)
DB_DIR.mkdir(exist_ok=True)

# Global pipeline state
pipeline_state = {
    "pipeline": None,
    "current_file": None,
    "status": "idle",  # idle | processing | ready | error
    "progress": [],
    "stats": {}
}


class QueryRequest(BaseModel):
    query: str
    k: int = 3


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/status")
def get_status():
    return {
        "status": pipeline_state["status"],
        "current_file": pipeline_state["current_file"],
        "progress": pipeline_state["progress"],
        "stats": pipeline_state["stats"],
    }


@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # Clear old state
    pipeline_state["progress"] = []
    pipeline_state["status"] = "processing"
    pipeline_state["stats"] = {}

    file_id = str(uuid.uuid4())[:8]
    save_path = UPLOAD_DIR / f"{file_id}_{file.filename}"

    with open(save_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    pipeline_state["current_file"] = file.filename

    # Run pipeline synchronously (for simplicity; use BackgroundTasks for production)
    try:
        progress_log = []

        def log_progress(msg: str):
            progress_log.append(msg)
            pipeline_state["progress"] = list(progress_log)

        rag = MultiModalRAGPipeline(
            db_path=str(DB_DIR / file_id),
            progress_callback=log_progress
        )
        rag.run(str(save_path))
        pipeline_state["pipeline"] = rag
        pipeline_state["status"] = "ready"
        pipeline_state["stats"] = rag.get_stats()
        return {"message": "Pipeline completed successfully", "stats": rag.get_stats()}

    except Exception as e:
        pipeline_state["status"] = "error"
        pipeline_state["progress"].append(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/query")
async def query_document(req: QueryRequest):
    if pipeline_state["status"] != "ready" or pipeline_state["pipeline"] is None:
        raise HTTPException(status_code=400, detail="No document is indexed. Please upload a PDF first.")

    try:
        result = pipeline_state["pipeline"].query(req.query, k=req.k)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/reset")
def reset():
    pipeline_state["pipeline"] = None
    pipeline_state["current_file"] = None
    pipeline_state["status"] = "idle"
    pipeline_state["progress"] = []
    pipeline_state["stats"] = {}
    # Clean uploads and db
    for f in UPLOAD_DIR.iterdir():
        f.unlink(missing_ok=True)
    if DB_DIR.exists():
        shutil.rmtree(DB_DIR)
    DB_DIR.mkdir(exist_ok=True)
    return {"message": "Reset successful"}
