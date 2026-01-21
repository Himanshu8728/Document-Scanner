import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/upload"); // go to upload page after signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signUp-page">
      <div className="signUp-container">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="set-email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="set-password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="create-account-button">
            Create Account
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
