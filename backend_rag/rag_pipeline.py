"""
MultiModal RAG Pipeline
"""

import json
import os
from typing import List, Callable, Optional

from dotenv import load_dotenv

from unstructured.partition.pdf import partition_pdf
from unstructured.chunking.title import chunk_by_title

from langchain_core.documents import Document
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_chroma import Chroma

from google import genai

# Load environment variables
load_dotenv()


class MultiModalRAGPipeline:

    def __init__(
        self,
        db_path: str = "chroma_db",
        progress_callback: Optional[Callable] = None
    ):

        self.db_path = db_path
        self.db = None
        self.log = progress_callback or print
        self._stats = {}

    # ─────────────────────────────────────────────
    # Step 1: Partition PDF
    # ─────────────────────────────────────────────
    def partition_document(self, file_path: str):

        self.log(f"📄 Step 1/4 — Partitioning document: {file_path}")

        elements = partition_pdf(
            filename=file_path,
            strategy="fast"
        )

        self.log(f"✅ Extracted {len(elements)} raw elements")

        self._stats["total_elements"] = len(elements)

        return elements

    # ─────────────────────────────────────────────
    # Step 2: Chunking
    # ─────────────────────────────────────────────
    def chunk_elements(self, elements):

        self.log("✂️ Step 2/4 — Chunking elements by title …")

        chunks = chunk_by_title(
            elements,
            max_characters=2000,
            new_after_n_chars=1500,
            combine_text_under_n_chars=500,
        )

        self.log(f"✅ Created {len(chunks)} chunks")

        self._stats["total_chunks"] = len(chunks)

        return chunks

    # ─────────────────────────────────────────────
    # Separate content types
    # ─────────────────────────────────────────────
    def separate_content_types(self, chunk):

        content_data = {
            "text": chunk.text,
            "tables": [],
            "images": [],
            "types": ["text"],
        }

        if hasattr(chunk, "metadata") and hasattr(chunk.metadata, "orig_elements"):

            for element in chunk.metadata.orig_elements:

                element_type = type(element).__name__

                if element_type == "Table":

                    content_data["types"].append("table")

                    table_html = getattr(
                        element.metadata,
                        "text_as_html",
                        element.text
                    )

                    content_data["tables"].append(table_html)

                elif element_type == "Image":

                    if (
                        hasattr(element, "metadata")
                        and hasattr(element.metadata, "image_base64")
                    ):

                        content_data["types"].append("image")

                        content_data["images"].append(
                            element.metadata.image_base64
                        )

        content_data["types"] = list(set(content_data["types"]))

        return content_data

    # ─────────────────────────────────────────────
    # Step 3: Process chunks
    # ─────────────────────────────────────────────
    def process_chunks(self, chunks) -> List[Document]:

        self.log("🔬 Step 3/4 — Processing & enriching chunks …")

        documents = []

        stats = {
            "text_only": 0,
            "with_tables": 0,
            "with_images": 0
        }

        for i, chunk in enumerate(chunks):

            self.log(f"Processing chunk {i+1}/{len(chunks)} …")

            content_data = self.separate_content_types(chunk)

            has_tables = len(content_data["tables"]) > 0
            has_images = len(content_data["images"]) > 0

            # Use raw text directly
            page_content = content_data["text"]

            if has_tables:
                stats["with_tables"] += 1

            if has_images:
                stats["with_images"] += 1

            if not has_tables and not has_images:
                stats["text_only"] += 1

            original_content = json.dumps({
                "raw_text": content_data["text"],
                "tables_html": content_data["tables"],
                "images_base64": content_data["images"],
                "types": content_data["types"],
            })

            doc = Document(
                page_content=page_content,
                metadata={
                    "chunk_index": i,
                    "content_types": json.dumps(content_data["types"]),
                    "has_tables": has_tables,
                    "has_images": has_images,
                    "original_content": original_content,
                },
            )

            documents.append(doc)

        self._stats.update(stats)

        self.log(f"✅ Processed {len(documents)} documents")

        return documents

    # ─────────────────────────────────────────────
    # Step 4: Create Vector Store
    # ─────────────────────────────────────────────
    def create_vector_store(self, documents: List[Document]):

        self.log("🔮 Step 4/4 — Creating embeddings & storing in ChromaDB …")

        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )

        self.db = Chroma.from_documents(
            documents=documents,
            embedding=embeddings,
            persist_directory=self.db_path,
        )

        self.log(f"✅ Vector store saved to {self.db_path}")

        return self.db

    # ─────────────────────────────────────────────
    # Run Pipeline
    # ─────────────────────────────────────────────
    def run(self, file_path: str):

        elements = self.partition_document(file_path)

        chunks = self.chunk_elements(elements)

        documents = self.process_chunks(chunks)

        self.create_vector_store(documents)

        self.log("🎉 Pipeline completed successfully!")

        return self.db

    # ─────────────────────────────────────────────
    # Query
    # ─────────────────────────────────────────────
    def query(self, query: str, k: int = 3) -> dict:

        if self.db is None:
            raise RuntimeError("Vector store not initialized.")

        # Retriever
        retriever = self.db.as_retriever(
            search_kwargs={"k": k}
        )

        chunks = retriever.invoke(query)

        # Prompt
        prompt_text = f"""
You are a helpful AI assistant.

Answer the user's question ONLY using the provided context.

If the answer is not present in the context, say:
"I could not find the answer in the document."

USER QUESTION:
{query}

CONTEXT:
"""

        retrieved_docs = []

        for i, chunk in enumerate(chunks):

            prompt_text += f"\n--- Document {i+1} ---\n"

            prompt_text += chunk.page_content + "\n"

            doc_info = {
                "index": i + 1,
                "content": chunk.page_content,
                "has_tables": chunk.metadata.get(
                    "has_tables",
                    False
                ),
                "has_images": chunk.metadata.get(
                    "has_images",
                    False
                ),
                "preview": chunk.page_content[:300]
            }

            retrieved_docs.append(doc_info)

        # Gemini Client
        client = genai.Client(
            api_key=os.getenv("GOOGLE_API_KEY")
        )

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt_text,
        )

        answer = response.text

        return {
            "answer": answer,
            "retrieved_chunks": retrieved_docs,
            "query": query,
        }

    # ─────────────────────────────────────────────
    # Stats
    # ─────────────────────────────────────────────
    def get_stats(self) -> dict:
        return self._stats