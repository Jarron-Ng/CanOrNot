from fastapi import APIRouter
from fastapi import UploadFile, File
import numpy as np
import io
import os
from PIL import Image
import joblib
import cv2
import time

from keras.models import load_model
from keras.applications.resnet50 import preprocess_input
router = APIRouter()

@router.get("/")
async def root():
    return {"message": "Hello World"}

def resize_image_and_process_input(image_bytes, size=(300, 300)):
    image = Image.open(io.BytesIO(image_bytes))
    cv2_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    resized_image = np.array(cv2.resize(cv2_image, size))
    processed_image = np.expand_dims(preprocess_input(resized_image), axis=0)
    return processed_image

def stack_models(model1, model2, image):
    resnet_prediction = model1.predict(image)
    vgg16_prediction = model2.predict(image)
    return np.concatenate((resnet_prediction, vgg16_prediction), axis=1)

@router.post("/predict")
async def predict(image: UploadFile = File(...)):
    # Process the image and run through the model
    # Detect whether the image is recyclable or not
    # Return the prediction result
    # Step 1: Load saved models
    #time.sleep(1000)
    models_directory = os.path.join(os.getcwd(), 'models')
    resnet_model_path = os.path.join(models_directory, 'model_resnet.h5')
    vgg16_model_path = os.path.join(models_directory, 'model_vgg16.h5')
    meta_model_path = os.path.join(models_directory, 'meta_model.pkl')

    model_resnet_loaded = load_model(resnet_model_path)
    model_vgg16_loaded = load_model(vgg16_model_path)

    loaded_meta_model = joblib.load(meta_model_path)
    print(loaded_meta_model)

    image_bytes = await image.read()
    # # Resize the image
    resized_image_array = resize_image_and_process_input(image_bytes)

    # # Step 2: Make predictions using each model
    stacked_predictions = stack_models(model_resnet_loaded, model_vgg16_loaded, resized_image_array)

    # # # Step 3: Make predictions using the meta model
    final_predictions = loaded_meta_model.predict(stacked_predictions)

    # # Step 5: Get the final prediction
    # final_prediction = final_predictions_resnet_bagging[0]  # Assuming you have only one image

    # print(f"Predicted class index: {final_prediction}")
    #return {"result": "Recyclable"}  # Replace with the actual prediction result
    return final_predictions[0].item()





