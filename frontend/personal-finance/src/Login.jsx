import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wallet,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await fetch(
      "http://localhost:9911/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      }
    );

    const data = await response.json();

    console.log("LOGIN RESPONSE:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Invalid email or password"
      );
    }

    localStorage.setItem(
      "finoraUser",
      JSON.stringify(data)
    );

    if (data.token) {
      localStorage.setItem("finoraToken", data.token);
    }

    navigate("/", { replace: true });
  } catch (err) {
    console.error("Login error:", err);

    setError(
      err.message || "Unable to connect to the server"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-page">
      <div className="auth-decoration auth-decoration-one"></div>
      <div className="auth-decoration auth-decoration-two"></div>

      <div className="auth-card">
        <Link to="/login" className="auth-brand">
          <span className="auth-brand-icon">
            <Wallet size={25} />
          </span>
          <span>Finora</span>
        </Link>

        <div className="auth-heading">
          <p className="auth-eyebrow">WELCOME BACK</p>
          <h1>Sign in to Finora</h1>
          <p>Manage your money with clarity and confidence.</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <label htmlFor="login-email">Email address</label>

          <div className="auth-input-wrap">
            <Mail size={19} />

            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <label htmlFor="login-password">Password</label>

          <div className="auth-input-wrap">
            <Lock size={19} />

            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight size={19} />}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">Create account</Link>
        </p>

        <p className="auth-footer">
          Your finances, beautifully organized.
        </p>
      </div>
    </div>
  );
}

export default Login;