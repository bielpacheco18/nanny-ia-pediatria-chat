from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from io import BytesIO
import uuid, os

from PyPDF2 import PdfReader
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import GPT4All

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).resolve().parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
VECTOR_PATH = DATA_DIR / "faiss_index"
EMBEDDINGS = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

vectorstore = None


def load_vectorstore():
    global vectorstore
    if vectorstore is None:
        if VECTOR_PATH.exists():
            vectorstore = FAISS.load_local(str(VECTOR_PATH), EMBEDDINGS, allow_dangerous_deserialization=True)
        else:
            vectorstore = None
    return vectorstore


def save_vectorstore(store: FAISS):
    store.save_local(str(VECTOR_PATH))


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    data = await file.read()
    reader = PdfReader(BytesIO(data))
    text = "".join(page.extract_text() or "" for page in reader.pages)
    file_id = str(uuid.uuid4())
    (DATA_DIR / f"{file_id}.txt").write_text(text, encoding="utf-8")

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = splitter.split_text(text)

    store = load_vectorstore()
    if store is None:
        store = FAISS.from_texts(docs, EMBEDDINGS)
    else:
        store.add_texts(docs)
    save_vectorstore(store)
    return {"message": "uploaded", "id": file_id}


@app.post("/chat")
async def chat(payload: dict):
    query = payload.get("message", "")
    store = load_vectorstore()
    if store is None:
        return {"response": "Nenhum documento disponível."}
    docs = store.similarity_search(query, k=3)
    model_path = os.environ.get("LOCAL_MODEL_PATH", "models/ggml-gpt4all-j.bin")
    llm = GPT4All(model=model_path, verbose=False)
    chain = load_qa_chain(llm, chain_type="stuff")
    answer = chain.run(input_documents=docs, question=query)
    return {"response": answer}

