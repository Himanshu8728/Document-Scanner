import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setImages([]);
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "images"),
        where("userId", "==", user.uid)
      );

      const unsubGallery = onSnapshot(
        q,
        (snapshot) => {
          const list = snapshot.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort(
              (a, b) =>
                (b.createdAt?.seconds || 0) -
                (a.createdAt?.seconds || 0)
            );

          setImages(list);
          setLoading(false);
        },
        (error) => {
          console.error("Gallery error:", error);
          setLoading(false);
        }
      );

      return () => unsubGallery();
    });

    return () => unsubAuth();
  }, []);

  const deleteImage = async (img) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await deleteObject(ref(storage, img.originalURL));
      await deleteObject(ref(storage, img.croppedURL));
      await deleteDoc(doc(db, "images", img.id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
          My Gallery
        </h1>

        {loading && (
          <p className="text-center text-gray-500">
            Loading gallery...
          </p>
        )}

        {!loading && images.length === 0 && (
          <p className="text-center text-gray-500">
            No images uploaded yet
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-white p-4 rounded-xl shadow"
            >
              <img
                src={img.croppedURL}
                alt=""
                className="w-full h-[200px] object-contain border rounded"
              />

              <div className="flex justify-between mt-4">
                <a
                  href={img.croppedURL}
                  download
                  className="text-blue-600 text-sm"
                >
                  Download
                </a>

                <button
                  onClick={() => deleteImage(img)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/upload")}
            className="bg-gray-700 text-white px-6 py-2 rounded"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
