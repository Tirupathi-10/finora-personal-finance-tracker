import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet, UserRound, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import "./Auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:9911/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message || "Unable to connect to server");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-decoration auth-decoration-one"></div>
      <div className="auth-decoration auth-decoration-two"></div>

      <div className="auth-card">
        <Link to="/register" className="auth-brand">
          <span className="auth-brand-icon">
            <Wallet size={25} />
          </span>
          <span>Finora</span>
        </Link>

        <div className="auth-heading">
          <p className="auth-eyebrow">START YOUR JOURNEY</p>
          <h1>Create your account</h1>
          <p>Take control of your income, expenses and savings.</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          <label htmlFor="register-name">Full name</label>
          <div className="auth-input-wrap">
            <UserRound size={19} />
            <input
              id="register-name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <label htmlFor="register-email">Email address</label>
          <div className="auth-input-wrap">
            <Mail size={19} />
            <input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label htmlFor="register-password">Password</label>
          <div className="auth-input-wrap">
            <Lock size={19} />
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          <label htmlFor="confirm-password">Confirm password</label>
          <div className="auth-input-wrap">
            <Lock size={19} />
            <input
              id="confirm-password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <button type="submit" className="auth-submit">
            Create Account <ArrowRight size={19} />
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

        <p className="auth-footer">A smarter way to manage your money.</p>
      </div>
    </div>
  );
}

export default Register;