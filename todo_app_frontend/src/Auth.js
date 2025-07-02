import React, { useState } from "react";
import { supabase } from "./supabaseClient";

/**
 * PUBLIC_INTERFACE
 * Minimal authentication component for Sign In and Sign Up using Supabase Auth.
 * Handles email/password authentication, error display, and toggling between modes.
 */
function Auth({ onAuth }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // PUBLIC_INTERFACE
  /** Handle form submit for sign in or sign up */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Email and password required.");
      setLoading(false);
      return;
    }

    let res;
    if (isSignUp) {
      res = await supabase.auth.signUp({ email, password });
    } else {
      res = await supabase.auth.signInWithPassword({ email, password });
    }

    if (res.error) {
      setError(res.error.message);
    } else {
      setError("");
      onAuth && onAuth(); // Callback for parent to re-fetch session
    }
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  /** Switch between Sign In and Sign Up mode */
  function toggleMode() {
    setIsSignUp((v) => !v);
    setError("");
    setPassword("");
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-header">
          {isSignUp ? "Create your account" : "Sign in"}
        </h2>
        <input
          autoFocus
          className="auth-input"
          type="email"
          placeholder="Email"
          aria-label="Email"
          value={email}
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          aria-label="Password"
          value={password}
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="auth-btn"
          type="submit"
          disabled={loading}
        >
          {isSignUp ? "Sign up" : "Sign in"}
        </button>
        {error && <div className="auth-error">{error}</div>}
      </form>
      <div className="auth-toggle">
        {isSignUp ? (
          <>
            <span>Already have an account?</span>{" "}
            <button className="auth-link" type="button" onClick={toggleMode} disabled={loading}>
              Sign in
            </button>
          </>
        ) : (
          <>
            <span>No account?</span>{" "}
            <button className="auth-link" type="button" onClick={toggleMode} disabled={loading}>
              Sign up
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Auth;
