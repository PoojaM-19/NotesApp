import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Check whether a token already exists
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchProfile(token);
    }
  }, []);

  // Fetch the protected user profile
  const fetchProfile = async (token) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        localStorage.removeItem("token");
        setUser(null);
        setMessage("Session expired. Please log in again.");
        return;
      }

      setUser(data.user);
      setMessage("");
    } catch (error) {
      setMessage("Cannot connect to the server.");
    }
  };

  // Handle Login and Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const endpoint = isLogin ? "login" : "register";

    const body = isLogin
      ? { email, password }
      : { name, email, password };

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Something went wrong.");
        return;
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        await fetchProfile(data.token);
        setPassword("");
      } else {
        setMessage("Registration successful! Please log in.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (error) {
      setMessage("Cannot connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setMessage("You have logged out successfully.");
    setIsLogin(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {user ? (
          // Profile Screen
          <div className="profile-section">
            <div className="profile-icon">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <h1>Welcome, {user.name}!</h1>
            <p className="subtitle">You are successfully logged in.</p>

            <div className="profile-details">
              <p>
                <strong>Full Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Authentication:</strong> JWT Verified
              </p>
            </div>

            <button
              type="button"
              className="auth-button logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          // Login and Signup Screen
          <>
            <h1>{isLogin ? "Welcome Back!" : "Create Account"}</h1>

            <p className="subtitle">
              {isLogin
                ? "Login to continue to your account"
                : "Sign up to get started"}
            </p>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Login"
                  : "Create Account"}
              </button>
            </form>

            {message && <p className="message">{message}</p>}

            <p className="toggle-text">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                type="button"
                className="toggle-button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage("");
                  setPassword("");
                }}
              >
                {isLogin ? " Sign Up" : " Login"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;