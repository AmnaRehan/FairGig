from fastapi import FastAPI
from mangum import Mangum

from main import app  # your real FastAPI app

handler = Mangum(app)