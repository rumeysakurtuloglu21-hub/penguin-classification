# 🐧 Penguin Classification

A machine learning web application that predicts penguin species using the Palmer Penguins dataset.

## ✨ Features

- Predicts penguin species based on physical measurements.
- Provides a React-based user interface.
- Uses a FastAPI backend to serve predictions.
- Applies preprocessing with a trained scaler.
- Features an aurora-inspired background.

## 🛠️ Technologies

**Machine Learning**
- Python
- PyTorch
- scikit-learn
- Palmer Penguins dataset

**Backend**
- FastAPI
- Uvicorn

**Frontend**
- React
- Vite
- JavaScript
- CSS

## 🐧 Supported Species

- Adelie
- Chinstrap
- Gentoo

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd PenguenSınıflandırma
```

Replace `YOUR_REPOSITORY_URL` with your GitHub repository URL.

### 2. Run the backend

Navigate to the backend directory, activate your Python environment, install the required dependencies, and start the FastAPI server.

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Run the frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 📌 Project Status

This project is developed as a machine learning and web development learning project.

## 👩‍💻 Author

Created as a personal machine learning project.

## Model Training

The model was trained using PyTorch and the Palmer Penguins dataset.

The training notebook covers data preprocessing, model training, and evaluation.

[View the training notebook](notbook/penguin_classification.ipynb)