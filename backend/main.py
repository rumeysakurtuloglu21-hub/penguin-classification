from contextlib import asynccontextmanager
from pathlib import Path
from typing import Literal

import joblib
import numpy as np
import torch
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from model.model import PenguenClasification

ROOT_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = ROOT_DIR / "models" / "penguen_classification_model.pth"
SCALER_PATH = Path(__file__).resolve().parent / "model" / "scaler.pkl"

CLASS_NAMES = ["Adelie", "Chinstrap", "Gentoo"]
ISLANDS = ("Biscoe", "Dream", "Torgersen")
SEXES = ("FEMALE", "MALE")

app_state: dict = {}


class PenguinFeatures(BaseModel):
    culmen_length_mm: float = Field(..., gt=0, le=100, description="Gaga uzunluğu (mm)")
    culmen_depth_mm: float = Field(..., gt=0, le=50, description="Gaga derinliği (mm)")
    flipper_length_mm: float = Field(..., gt=0, le=400, description="Palet uzunluğu (mm)")
    body_mass_g: float = Field(..., gt=0, le=15000, description="Vücut ağırlığı (g)")
    island: Literal["Biscoe", "Dream", "Torgersen"]
    sex: Literal["FEMALE", "MALE"]


class PredictResponse(BaseModel):
    species: str
    class_index: int
    probabilities: dict[str, float]


def _scaler_missing_detail() -> str:
    return (
        f"Scaler dosyası bulunamadı: {SCALER_PATH}. "
        "Eğitim kodunuzdaki aynı StandardScaler nesnesini yeniden fit etmeden kaydedin: "
        "import joblib; joblib.dump(scaler, 'scaler.pkl') "
        "Ardından dosyayı models/scaler.pkl konumuna koyun."
    )


def _load_artifacts() -> None:
    if not MODEL_PATH.is_file():
        raise FileNotFoundError(
            f"Model dosyası bulunamadı: {MODEL_PATH}. "
            "Eğittiğiniz .pth dosyasını models/ klasörüne koyun."
        )

    model = PenguenClasification()
    state = torch.load(MODEL_PATH, map_location="cpu", weights_only=True)
    model.load_state_dict(state)
    model.eval()
    app_state["model"] = model

    if SCALER_PATH.is_file():
        scaler = joblib.load(SCALER_PATH)
        if not hasattr(scaler, "transform"):
            raise TypeError("scaler.pkl geçerli bir sklearn scaler değil.")
        app_state["scaler"] = scaler
    else:
        app_state["scaler"] = None


def features_to_tensor(payload: PenguinFeatures) -> torch.Tensor:
    numeric = np.array(
        [
            [
                payload.culmen_length_mm,
                payload.culmen_depth_mm,
                payload.flipper_length_mm,
                payload.body_mass_g,
            ]
        ],
        dtype=np.float32,
    )

    if not np.isfinite(numeric).all():
        raise HTTPException(status_code=422, detail="Sayısal değerler sonlu olmalıdır.")

    scaled = app_state["scaler"].transform(numeric).astype(np.float32)

    island_one_hot = [1.0 if payload.island == name else 0.0 for name in ISLANDS]
    sex_one_hot = [1.0 if payload.sex == name else 0.0 for name in SEXES]

    vector = np.concatenate([scaled[0], island_one_hot, sex_one_hot]).astype(np.float32)
    return torch.from_numpy(vector).unsqueeze(0)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    _load_artifacts()
    yield
    app_state.clear()


app = FastAPI(
    title="Penguin Species Classifier",
    description="Palmer Penguins verisiyle eğitilmiş PyTorch modeli için tahmin API'si.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "model_loaded": app_state.get("model") is not None,
        "scaler_loaded": app_state.get("scaler") is not None,
        "scaler_path": str(SCALER_PATH),
    }


@app.post("/predict", response_model=PredictResponse)
def predict(payload: PenguinFeatures) -> PredictResponse:
    if app_state.get("scaler") is None:
        raise HTTPException(status_code=503, detail=_scaler_missing_detail())

    model: PenguenClasification = app_state["model"]

    try:
        x = features_to_tensor(payload)
        with torch.inference_mode():
            logits = model(x)
            probabilities = torch.softmax(logits, dim=1)[0]
            class_index = int(torch.argmax(probabilities).item())
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Tahmin sırasında hata: {exc}") from exc

    probs = {
        name: round(float(probabilities[i].item()), 4)
        for i, name in enumerate(CLASS_NAMES)
    }

    return PredictResponse(
        species=CLASS_NAMES[class_index],
        class_index=class_index,
        probabilities=probs,
    )
