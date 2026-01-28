import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        backend_url + 'api/auth/login',
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        localStorage.setItem('isLoggedIn', 'true');
        toast.success("Logged in successfully");
        window.location.replace(import.meta.env.VITE_DASHBOARD_URL);
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  const handleForgot = () => {
    navigate('/forgotpassword');
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "400px", marginBottom: "110px", height: "420px" }}>
        <h3 className="text-center mb-4">Log In</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="abc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-center mb-3">
            <p className="text-muted mb-0 mt-2">
              Don't have an account?{" "}
              <span
                className="text-primary fw-semibold"
                role="button"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </span>
            </p>
            <p className="text-muted mb-0 mt-2">
              Forgot your password?{" "}
              <span
                className="text-primary fw-semibold"
                role="button"
                onClick={handleForgot}
              >
                Reset here
              </span>
            </p>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;