import os
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.response.pprint_utils import pprint_response
from constants import OA_Key

os.environ['OPENAI_API_KEY'] = OA_Key
docs = SimpleDirectoryReader("Pdfs").load_data()
idx = VectorStoreIndex.from_documents(docs, show_progress = True)
Qry_Engn = idx.as_query_engine()

response = Qry_Engn.query("tell me about this project?")
pprint_response(response, show_source = True)