import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Signup() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        backend_url + 'api/auth/signin',
        { username, email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        localStorage.setItem('isLoggedIn', 'true');
        toast.success("Account created successfully");
        window.location.replace(import.meta.env.VITE_DASHBOARD_URL);
      } else {
        toast.error(response.data.message || "Signup failed");
      }
    } catch (error) {
      toast.error("Signup failed. Please try again.");
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "400px", marginBottom: "110px", height: "460px" }}>
        <h3 className="text-center mb-4">Create Account</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

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
              Already have an account?{" "}
              <a href="/login" className="text-primary fw-semibold">
                Log In
              </a>
            </p>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
