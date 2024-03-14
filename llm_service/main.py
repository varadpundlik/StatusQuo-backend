from fastapi import FastAPI
import uvicorn
app = FastAPI()

@app.get("/")
async def call_model():
    return {"message": f"Hello, ani!"}

@app.get("/model")
async def call_model_1(name: str):
    return {"message": f"Hello, {name}!"}

if __name__ == "__main__":
    uvicorn.run(app,host="127.0.0.1",port=8080)
