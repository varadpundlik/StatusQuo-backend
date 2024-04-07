import os
import requests
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.response.pprint_utils import pprint_response
from fastapi import FastAPI, HTTPException, Body, Query
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
print(api_key)
os.environ['OPENAI_API_KEY'] = api_key

Pdfs_directory = "Pdfs"
os.makedirs(Pdfs_directory, exist_ok=True)

Qry_Engn=None

# Function to download PDF from Cloudinary URL
def download_pdf_from_cloudinary(url: str, filename: str):
    response = requests.get(url)
    if response.status_code == 200:
        with open(filename, 'wb') as file:
            file.write(response.content)

app = FastAPI()

@app.post("/donwload_and_train/")
async def download_and_index_pdf(url: str = Body(..., embed=True), name: str = Body(..., embed=True)):
    try:
        global Qry_Engn
        filename = os.path.join(Pdfs_directory, f"{name}")
        download_pdf_from_cloudinary(url, filename)
        
        docs = SimpleDirectoryReader(Pdfs_directory).load_data()
        idx = VectorStoreIndex.from_documents(docs, show_progress=True)
        Qry_Engn = idx.as_query_engine()
        
        return {"message": "PDF downloaded and trained to model successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/query/")
async def query_documents(query: str = Query(..., title="Query", description="The query to be executed")):
    try:
        print(query)
        response = Qry_Engn.query(query)
        print(response)
        # pprint_response(response, show_source=True)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
