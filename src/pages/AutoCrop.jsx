import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "../firebase";

export default function AutoCrop() {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const [file, setFile] = useState(null);
  const [src, setSrc] = useState(null);
  const [croppedReady, setCroppedReady] = useState(false);

  const navigate = useNavigate();
  const storage = getStorage();
  const db = getFirestore();

  // ================= LOAD IMAGE =================
  const loadImage = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setSrc(URL.createObjectURL(f));
    setCroppedReady(false);
  };

  // ================= UTILS =================
  const orderPoints = (pts) => {
    const rect = [];
    const sum = pts.map((p) => p.x + p.y);
    const diff = pts.map((p) => p.x - p.y);

    rect[0] = pts[sum.indexOf(Math.min(...sum))]; // TL
    rect[2] = pts[sum.indexOf(Math.max(...sum))]; // BR
    rect[1] = pts[diff.indexOf(Math.min(...diff))]; // TR
    rect[3] = pts[diff.indexOf(Math.max(...diff))]; // BL

    return rect;
  };

  // ================= AUTO CROP (SCANNER STYLE) =================
  const autoCrop = () => {
    if (!window.cv || !cv.imread) {
      alert("OpenCV not loaded");
      return;
    }

    const srcMat = cv.imread(imgRef.current);
    const gray = new cv.Mat();
    const blurred = new cv.Mat();
    const edged = new cv.Mat();

    cv.cvtColor(srcMat, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
    cv.Canny(blurred, edged, 50, 150);

    const kernel = cv.getStructuringElement(
      cv.MORPH_RECT,
      new cv.Size(5, 5)
    );
    cv.dilate(edged, edged, kernel);
    kernel.delete();

    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();

    cv.findContours(
      edged,
      contours,
      hierarchy,
      cv.RETR_LIST,
      cv.CHAIN_APPROX_SIMPLE
    );

    let docContour = null;
    let maxArea = 0;

    for (let i = 0; i < contours.size(); i++) {
      const cnt = contours.get(i);
      const area = cv.contourArea(cnt);

      const peri = cv.arcLength(cnt, true);
      const approx = new cv.Mat();
      cv.approxPolyDP(cnt, approx, 0.02 * peri, true);

      if (approx.rows === 4 && area > maxArea) {
        if (docContour) docContour.delete();
        docContour = approx;
        maxArea = area;
      } else {
        approx.delete();
      }
    }

    // ---------- FALLBACK ----------
    if (!docContour) {
      const mx = Math.round(srcMat.cols * 0.1);
      const my = Math.round(srcMat.rows * 0.1);
      const fallback = srcMat.roi(
        new cv.Rect(
          mx,
          my,
          srcMat.cols - mx * 2,
          srcMat.rows - my * 2
        )
      );

      canvasRef.current.width = fallback.cols;
      canvasRef.current.height = fallback.rows;
      cv.imshow(canvasRef.current, fallback);

      fallback.delete();
      srcMat.delete();
      gray.delete();
      blurred.delete();
      edged.delete();
      contours.delete();
      hierarchy.delete();

      setCroppedReady(true);
      return;
    }

    const pts = [];
    for (let i = 0; i < 4; i++) {
      pts.push({
        x: docContour.intPtr(i, 0)[0],
        y: docContour.intPtr(i, 0)[1],
      });
    }

    const ordered = orderPoints(pts);

    const widthA = Math.hypot(
      ordered[2].x - ordered[3].x,
      ordered[2].y - ordered[3].y
    );
    const widthB = Math.hypot(
      ordered[1].x - ordered[0].x,
      ordered[1].y - ordered[0].y
    );
    const maxWidth = Math.max(widthA, widthB);

    const heightA = Math.hypot(
      ordered[1].x - ordered[2].x,
      ordered[1].y - ordered[2].y
    );
    const heightB = Math.hypot(
      ordered[0].x - ordered[3].x,
      ordered[0].y - ordered[3].y
    );
    const maxHeight = Math.max(heightA, heightB);

    const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      ordered[0].x, ordered[0].y,
      ordered[1].x, ordered[1].y,
      ordered[2].x, ordered[2].y,
      ordered[3].x, ordered[3].y,
    ]);

    const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      0, 0,
      maxWidth, 0,
      maxWidth, maxHeight,
      0, maxHeight,
    ]);

    const M = cv.getPerspectiveTransform(srcTri, dstTri);
    const warped = new cv.Mat();

    cv.warpPerspective(
      srcMat,
      warped,
      M,
      new cv.Size(maxWidth, maxHeight)
    );

    canvasRef.current.width = warped.cols;
    canvasRef.current.height = warped.rows;
    cv.imshow(canvasRef.current, warped);

    srcMat.delete();
    gray.delete();
    blurred.delete();
    edged.delete();
    contours.delete();
    hierarchy.delete();
    srcTri.delete();
    dstTri.delete();
    M.delete();
    warped.delete();
    docContour.delete();

    setCroppedReady(true);
  };

  // ================= SAVE =================
  const saveToGallery = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return alert("Please login");

      const originalRef = ref(
        storage,
        `users/${user.uid}/original/${Date.now()}.jpg`
      );
      await uploadBytes(originalRef, file);
      const originalURL = await getDownloadURL(originalRef);

      const processedBlob = await new Promise((resolve) =>
        canvasRef.current.toBlob(resolve, "image/jpeg", 0.95)
      );

      const processedRef = ref(
        storage,
        `users/${user.uid}/processed/${Date.now()}.jpg`
      );
      await uploadBytes(processedRef, processedBlob);
      const processedURL = await getDownloadURL(processedRef);

      await addDoc(collection(db, "images"), {
        userId: user.uid,
        originalURL,
        croppedURL: processedURL,
        createdAt: serverTimestamp(),
      });

      alert("Saved to gallery ✔");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  const downloadProcessed = () => {
    const link = document.createElement("a");
    link.download = "processed-document.jpg";
    link.href = canvasRef.current.toDataURL("image/jpeg", 0.95);
    link.click();
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          Auto Crop Document
        </h1>

        <input type="file" accept="image/*" onChange={loadImage} />

        {src && (
          <>
            {/* SIDE BY SIDE VIEW */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <p className="font-semibold mb-2">Original</p>
                <div className="border rounded-lg p-2 bg-gray-50">
                  <img
                    ref={imgRef}
                    src={src}
                    className="mx-auto max-h-[350px] object-contain"
                  />
                </div>
              </div>

              <div className="text-center">
                <p className="font-semibold mb-2">Processed</p>
                <div className="border rounded-lg p-2 bg-gray-50">
                  <canvas
                    ref={canvasRef}
                    className="mx-auto max-h-[350px] object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6 justify-center flex-wrap">
              <button
                onClick={autoCrop}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                Auto Crop
              </button>

              {croppedReady && (
                <>
                  <button
                    onClick={downloadProcessed}
                    className="bg-purple-600 text-white px-6 py-2 rounded"
                  >
                    Download
                  </button>
                  <button
                    onClick={saveToGallery}
                    className="bg-green-600 text-white px-6 py-2 rounded"
                  >
                    Save to Gallery
                  </button>
                </>
              )}

              <button
                onClick={() => navigate("/gallery")}
                className="bg-gray-700 text-white px-6 py-2 rounded"
              >
                View Gallery
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
