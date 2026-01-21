import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import AutoCrop from "./pages/AutoCrop";
import Gallery from "./pages/Gallery";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={!user ? <Login /> : <Navigate to="/upload" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/upload" />}
        />

        {/* Protected Routes */}
        <Route
          path="/upload"
          element={user ? <Upload /> : <Navigate to="/" />}
        />
        <Route
          path="/autocrop"
          element={user ? <AutoCrop /> : <Navigate to="/" />}
        />
        <Route
          path="/gallery"
          element={user ? <Gallery /> : <Navigate to="/" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
