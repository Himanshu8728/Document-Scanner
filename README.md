📄 Document Scanner Web App
A web‑based document scanner application that allows users to upload images, automatically detect and crop documents (CamScanner‑style), apply perspective correction, and manage scanned documents using Firebase.

🔗 Project Links
🌐 Public App URL (Firebase Hosting)
https://<your-project-id>.web.app
🔐 Test Credentials
Email: testuser@example.com
Password: Test@1234
Users can also create their own accounts using the Sign Up page.

📦 GitHub Repository
https://github.com/Himanshu8728/Document-Scanner
🏗️ Architecture Overview & Data Flow
Frontend
React (Vite)

Custom CSS for UI

OpenCV.js for client‑side image processing

Backend / Cloud Services
Firebase Authentication

Firebase Storage

Cloud Firestore

Firebase Hosting

🔁 Data Flow
User signs up or logs in using Firebase Authentication

User uploads an image from local system

Image is processed in the browser using OpenCV.js

Original image and processed image are uploaded to Firebase Storage

Image metadata (URLs, userId, timestamp) is stored in Firestore

Gallery fetches and displays user‑specific images

User can download or delete processed images

✂️ How Auto‑Crop Works (Algorithm Steps)
The auto‑crop feature is inspired by popular scanner apps like CamScanner and Adobe Scan.

Algorithm Steps:
Load image into OpenCV matrix (cv.imread)

Convert image to grayscale

Apply Gaussian Blur to reduce noise

Detect edges using Canny Edge Detection

Strengthen edges using morphological dilation

Detect all contours in the image

Select the largest contour approximated to 4 points (document boundary)

Order detected corner points (top‑left, top‑right, bottom‑right, bottom‑left)

Apply perspective transformation (cv.getPerspectiveTransform)

Warp the image to get a top‑down scanned view

Fallback to center crop if document is not detected clearly

⚙️ Setup Instructions
Prerequisites
Node.js (v18+)

Firebase account

Git

Installation
git clone https://github.com/Himanshu8728/Document-Scanner.git
cd Document-Scanner
npm install
Environment Variables (.env)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
Run Locally
npm run dev
Build for Production
npm run build
📦 Libraries Used & Licenses
Library	Purpose	License
React	UI Framework	MIT
Vite	Build Tool	MIT
Firebase	Auth, DB, Storage, Hosting	Apache 2.0
OpenCV.js	Image Processing	Apache 2.0
React Router	Routing	MIT
✅ All libraries are open‑source and allowed for academic use.

⚖️ Trade‑offs & Future Improvements
Current Trade‑offs
Auto‑crop accuracy depends on lighting and background

Client‑side processing may be slower on low‑end devices

No manual corner adjustment

Future Improvements
Manual corner adjustment (drag points)

Image enhancement (binarization, sharpening)

Multi‑page scanning

PDF export

Camera capture for mobile

Server‑side image processing using Cloud Functions

✅ Conclusion
This project demonstrates:

Practical use of computer vision in the browser

Secure authentication and cloud storage

Real‑world document scanning workflow

Clean and user‑friendly UI

The application is fully functional, deployed, and ready for further enhancements.

👤 Author
Himanshu
Document Scanner Project

