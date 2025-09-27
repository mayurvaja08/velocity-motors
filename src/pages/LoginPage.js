import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./Auth.css";

export default function LoginPage({ setUserMode }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Hardcoded admin emails
  const adminEmails = ["test1@gmail.com", "test2@gmail.com"];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Only allow password "123456" for adminEmails
      if (adminEmails.includes(email) && password === "123456") {
        setUserMode("admin");
        navigate("/adminpage");
        return;
      }

      // For regular users, authenticate via Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;

      // Fetch user name from Firestore
      const docRef = doc(db, "Users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      let userName = currentUser.email;
      if (docSnap.exists()) {
        userName = docSnap.data().name;
      }

      setUserMode({ mode: "user", name: userName });
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  const handleGuest = () => {
    setUserMode({ mode: "guest" });
    navigate("/");
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>

      <button onClick={handleGuest} className="guest-btn">
        Go as Guest
      </button>

      <p className="auth-link">
        Don’t have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
