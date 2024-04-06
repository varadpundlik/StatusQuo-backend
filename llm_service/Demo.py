import os
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.response.pprint_utils import pprint_response
from fastapi import FastAPI, HTTPException, Query, File, UploadFile
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

# Get API key from environment variable
api_key = os.getenv("OPENAI_API_KEY")
print(api_key)
os.environ['OPENAI_API_KEY'] = api_key

# Ensure the 'Pdfs' directory exists or create it if not
Pdfs_directory = "Pdfs"
os.makedirs(Pdfs_directory, exist_ok=True)

# Load documents and set up query engine
docs = SimpleDirectoryReader(Pdfs_directory).load_data()
idx = VectorStoreIndex.from_documents(docs, show_progress=True)
Qry_Engn = idx.as_query_engine()

# Create the FastAPI app
app = FastAPI()

# Endpoint for querying documents
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

# Endpoint for uploading files
@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        # Save the file in the 'Pdfs' directory
        with open(os.path.join(Pdfs_directory, file.filename), "wb") as f:
            f.write(contents)
        return JSONResponse(status_code=200, content={"message": "File uploaded"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": str(e)})
