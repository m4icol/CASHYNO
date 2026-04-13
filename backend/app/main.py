from fastapi import FastAPI

app = FastAPI(title="Casino API")

@app.get("/")
def root():
    return {"message": "Casino API corriendo"}