# 🐧 Penguen Türü Sınıflandırması

Palmer Penguins veri setini kullanarak fiziksel ölçümler ve kategorik özellikler üzerinden penguen türlerini tahmin eden bir **derin öğrenme web uygulaması**.

## ✨ Özellikler

- Fiziksel ölçümler ve kategorik özelliklerden penguen türü tahmini yapar.
- PyTorch ile eğitilmiş bir sinir ağı modelini kullanır.
- React tabanlı bir kullanıcı arayüzü sunar.
- Model tahminlerini FastAPI aracılığıyla sunar.
- Eğitilmiş bir ölçekleyici ile verileri ön işler.
- Kutup ışıklarından ilham alan bir arayüz tasarımına sahiptir.

## 🛠️ Kullanılan Teknolojiler

**Derin Öğrenme ve Veri İşleme**
- Python
- PyTorch
- Pandas
- NumPy
- scikit-learn
- Palmer Penguins veri seti

**Arka Uç**
- FastAPI
- Uvicorn

**Ön Yüz**
- React
- Vite
- JavaScript
- CSS

## 🐧 Desteklenen Türler

- Adelie
- Chinstrap
- Gentoo

## 🧠 Model Eğitimi

Model, PyTorch kullanılarak Palmer Penguins veri seti üzerinde eğitilmiştir. Eğitim süreci; veri ön işleme, özelliklerin hazırlanması, model eğitimi ve performans değerlendirmesini kapsar.

📓 [Model eğitim not defterini inceleyin](https://github.com/rumeysakurtuloglu21-hub/penguin-classification/blob/main/notbook/penguin_classification.ipynb)

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- Python
- Node.js ve npm
- Git

### 1. Depoyu klonlayın

```bash
git clone https://github.com/rumeysakurtuloglu21-hub/penguin-classification.git
cd penguin-classification
```

### 2. Arka ucu çalıştırın

Proje ana dizininden:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Ön yüzü çalıştırın

Yeni bir terminal açarak proje ana dizinindeki `frontend` klasörüne gidin:

```bash
cd frontend
npm install
npm run dev
```

Vite tarafından gösterilen yerel adresi tarayıcınızda açın.

> Not: Arka uç ve ön yüzün birlikte çalışması için API adresinin ve CORS ayarlarının proje yapılandırmasıyla uyumlu olması gerekir.

## 📌 Proje Durumu

Bu proje, PyTorch ile derin öğrenme ve eğitilmiş bir modelin FastAPI ve React kullanılarak web uygulamasına entegre edilmesi konularında pratik yapmak amacıyla geliştirilmiştir.

## 👩‍💻 Yazar

Rümeysa Kurtuloğlu

