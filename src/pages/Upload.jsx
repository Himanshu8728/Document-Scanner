import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Upload() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Document Scanner
        </h1>

        <div className="button-group">
          {/* Auto Crop */}
          <button
            onClick={() => navigate("/autocrop")}
            className="auto-crop-button"
          >
            Auto‑Crop Document
          </button>

          {/* Gallery */}
          <button
            onClick={() => navigate("/gallery")}
            className="view-gallery-button"
          >
            View Gallery
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
