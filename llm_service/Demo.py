import os
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.response.pprint_utils import pprint_response
from fastapi import FastAPI, HTTPException, Query
import os
from dotenv import load_dotenv
load_dotenv()
# Get API key from environment variable
api_key = os.getenv("OPENAI_API_KEY")
print(api_key)
os.environ['OPENAI_API_KEY'] = api_key

docs = SimpleDirectoryReader("Pdfs").load_data()
idx = VectorStoreIndex.from_documents(docs, show_progress = True)
Qry_Engn = idx.as_query_engine()

app = FastAPI()
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
