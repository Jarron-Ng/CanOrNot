from fastapi import APIRouter
from fastapi import UploadFile, File
import time

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "Hello World"}

@router.post("/predict")
async def predict(image: UploadFile = File(...)):
    # Process the image and run through the model
    # Detect whether the image is recyclable or not
    # Return the prediction result
    time.sleep(5)  # Simulate a long running process
    #return {"result": "Recyclable"}  # Replace with the actual prediction result
    return {"filename": image.filename}