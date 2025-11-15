"use client";

import { useState } from "react";
import "./login.css";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseConfig";   
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // EMAIL/PASSWORD LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("⚠ Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/");    // send to dashboard
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithPopup(auth, provider);
      router.replace("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-grid"></div>
      <div className="scan-line"></div>

      <div className="login-container">
        <div className="logo">
          <i className="fas fa-shield-alt logo-icon"></i>
          <div className="brand">
            <h1 className="login-title">CALM GUARD</h1>
            <div className="brand-subtitle">AI Security</div>
          </div>
        </div>

        <div className="login-card">
          <form onSubmit={handleLogin}>
            <input
              type="email"
              className="login-input"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <input
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            {error && <div className="error-text">{error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              <div className="btn-content">
                <i className="fas fa-sign-in-alt"></i>
                <span>{loading ? "Signing In..." : "Sign In"}</span>
              </div>
            </button>
          </form>

          <button className="google-btn" disabled={loading} onClick={handleGoogleLogin}>
            <div className="btn-content">
              <i className="fab fa-google"></i>
              <span>{loading ? "Loading..." : "Sign in with Google"}</span>
            </div>
          </button>

          <div className="signup-text">
            Don't have an account? <a href="/signup">Sign up</a>
          </div>

          <div className="footer">
            Calm Guard AI Security System • Enterprise Grade Protection
          </div>
        </div>
      </div>
    </>
  );
}
