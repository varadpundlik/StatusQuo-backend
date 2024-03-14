import os
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.response.pprint_utils import pprint_response
from fastapi import FastAPI, HTTPException, Query

os.environ['OPENAI_API_KEY'] = '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'

docs = SimpleDirectoryReader("Pdfs").load_data()
idx = VectorStoreIndex.from_documents(docs, show_progress = True)
Qry_Engn = idx.as_query_engine()

app = FastAPI()
@app.get("/query/")
async def query_documents(query: str = Query(..., title="Query", description="The query to be executed")):
    try:
        response = Qry_Engn.query(query)
        pprint_response(response, show_source=True)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
