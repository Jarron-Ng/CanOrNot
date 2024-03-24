"""
Create a virtual environment and install the required packages
activate the env using `{env-name}\Scripts\activate on windows`
`source {env-name}/bin/activate` on mac/linux

To start the backend server, run the following command:
`uvicorn main:app --reload`

"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import predict

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(predict.router)