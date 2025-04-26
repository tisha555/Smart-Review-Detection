# 🚀 Smart Review Detection System

## Introduction
In today's digital era, the rise of fake, AI-generated reviews has severely impacted user trust and transparency across online platforms. **Smart Review Detection System** is a machine learning-based solution designed to **identify fake reviews in real-time**, empowering users with trustworthy feedback and promoting digital integrity.

Built using cutting-edge ML models like **LSTM**, **SGD**, **DistilBERT**, **LightGBM**, and **Random Forest**, this project aims to distinguish between genuine and fabricated reviews through advanced pattern recognition, linguistic analysis, and anomaly detection.

---

## ✨ Key Features
- **Real-Time Detection**: Instantly classify reviews with a color-coded system (Green = Genuine, Red = Suspicious).
- **Chrome Extension**: Seamlessly integrates into the user's browsing experience.
- **Backend Server**: Flask-based API serving real-time predictions securely.
- **High Accuracy**: Achieves an **AUC score of 0.994** with LSTM and Random Forest models.
- **Security First**: Implements CORS restrictions and encrypted communication to ensure user privacy.

---

## 📚 Techniques Used
- **Data Collection**: 10,091 reviews gathered (5,091 real from Amazon via API and 5,000 AI-generated using ChatGPT and Gemini).
- **Preprocessing**: Tokenization, stemming, lemmatization, duplicate removal, and category formatting.
- **Model Training**: Implemented and evaluated five models: **SGD**, **LSTM**, **Random Forest**, **LightGBM**, **DistilBERT**.
- **Feature Engineering**: Extracted meaningful textual features to boost model performance.
- **Evaluation**: Used metrics like Accuracy, Precision, Recall, F1-Score, and AUC.
- **Extension Building**: Popup interface showing real-time classification and confidence scores.

---

## 🎯 Project Objectives
- 📦 Prepare a high-quality dataset from real and AI-generated reviews.
- 🧐 Train ML models to distinguish between genuine and fake reviews.
- 🔍 Build a scalable, real-time detection system.
- 📈 Gain user trust by offering unbiased, authentic review analysis.
- 🌐 Promote transparency and fight misinformation in digital marketplaces.

---

## 🏗️ System Architecture
1. **Chrome Extension**  
   - Extracts reviews and displays classification results instantly.
2. **Flask Backend**  
   - Hosts ML models for secure, scalable review analysis.
3. **Secure API Communication**  
   - CORS restrictions and encryption to protect user data.
4. **Content Extraction Module**  
   - Utilizes DOM traversal to retrieve clean and accurate review text and ratings.

---

## 🔥 Results
- **LSTM** and **Random Forest** models demonstrated the best performance with an **AUC of 0.994**.
- Real-time detection within the Chrome extension enhances the browsing experience.
- High scalability potential with planned cloud migration.

---

## ⚡ Current Limitations
- Currently supports **only English-language** reviews.
- Operational on **Amazon.in** platform for now.
- Limited multilingual and cross-platform support.

---

## 🛠️ Future Work
- 🌎 Expand to global e-commerce platforms (e.g., Amazon.com, eBay, Flipkart).
- 👤 Add multilingual support.
- ☁️ Migrate backend to cloud infrastructure for scalability.
- ⚙️ Background auto-scanning of reviews without user interaction.
- 🔒 Advanced security measures for even stronger data protection.

---

## 📝 Summary
The **Smart Review Detection System** addresses the growing challenge of AI-generated fake reviews by blending cutting-edge machine learning techniques with a real-world, user-centric application. It enhances **consumer trust**, **safeguards online transparency**, and leads toward a **more credible and reliable digital ecosystem**.

---

## 📸 Demo

| Real Review (Genuine) | Fake Review (Suspicious) |
| :-------------------: | :----------------------: |
| ![green indicator](https://via.placeholder.com/150x50?text=Genuine+-+Green) | ![red indicator](https://via.placeholder.com/150x50?text=Suspicious+-+Red) |

---
Live Demo

Watch the live working demo here: (https://drive.google.com/file/d/1dujkJ9pxFSxPFkgQmQT0KAfyRjSMvRiS/view?usp=sharing)
