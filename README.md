# 📄 Document Scanner Web App

A web‑based document scanner application that allows users to upload images, automatically detect and crop documents (CamScanner‑style), apply perspective correction, and manage scanned documents using Firebase.

---

## 📌 About the Project

Document scanning is an essential part of digitizing paperwork.  
This project provides a **browser‑based document scanner** that works without any native mobile application.

The application uses **computer vision techniques with OpenCV.js** to automatically detect documents from images, crop them accurately, and generate a clean scanned output.

---

## 🧠 Key Features

- 🔐 User Authentication (Login & Sign Up)
- 📷 Upload document images
- ✂️ Automatic document detection & cropping
- 📐 Perspective correction (top‑down scan)
- 💾 Save original and processed images
- 🖼️ Gallery view for scanned documents
- ⬇️ Download processed images
- 🗑️ Delete images from gallery
- ☁️ Cloud‑based storage using Firebase

---

## 🏗️ Architecture Overview

### Frontend
- React (Vite)
- Custom CSS for UI
- OpenCV.js for client‑side image processing

### Backend / Cloud Services
- Firebase Authentication
- Firebase Storage
- Cloud Firestore
- Firebase Hosting

---

## 🔁 Data Flow

1. User signs up or logs in using **Firebase Authentication**
2. User uploads an image from the local system
3. Image is processed in the browser using **OpenCV.js**
4. Original and processed images are uploaded to **Firebase Storage**
5. Image metadata (URLs, timestamp, userId) is stored in **Cloud Firestore**
6. Gallery fetches and displays user‑specific documents
7. User can download or delete scanned documents

---

## ✂️ How Auto‑Crop Works (Algorithm)

The auto‑crop functionality is inspired by popular scanner apps like **CamScanner**.

### Algorithm Steps:
- Convert image to grayscale
- Apply Gaussian Blur to reduce noise
- Perform Canny Edge Detection
- Strengthen edges using morphological operations
- Detect contours in the image
- Select the largest document‑like contour
- Detect document corner points
- Apply perspective transformation
- Generate a clean cropped document
- Use fallback center crop if document detection fails

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18 or later)
- Firebase account
- Git

### Installation
```bash
git clone https://github.com/Himanshu8728/Document-Scanner.git
cd Document-Scanner
npm install
Environment Variables (.env)
env
Copy code
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
Run Locally
bash
Copy code
npm run dev
Build & Deploy
bash
Copy code
npm run build
firebase deploy
🔗 Project Links
🌐 Public App URL (Firebase Hosting)
cpp
Copy code
https://<your-project-id>.web.app
🔐 Test Credentials
graphql
Copy code
Email: testuser@example.com
Password: Test@1234
📦 GitHub Repository
arduino
Copy code
https://github.com/Himanshu8728/Document-Scanner
📦 Libraries Used
React – UI framework (MIT License)

Vite – Build tool (MIT License)

Firebase – Authentication, Storage, Firestore, Hosting (Apache 2.0)

OpenCV.js – Image processing (Apache 2.0)

React Router – Routing (MIT License)

✅ All libraries used are open‑source and permitted for academic use.

⚖️ Trade‑offs & Future Improvements
Current Limitations
Auto‑crop accuracy depends on lighting and background

No manual corner adjustment

Client‑side processing may be slow on low‑end devices

Future Enhancements
Manual crop corner adjustment

Image enhancement (sharpening, thresholding)

Multi‑page document scanning

PDF export

Mobile camera capture

Server‑side image processing

👤 Author
Himanshu
Document Scanner Web Application
Academic Project

