import React, { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"

function Signup() {
  const [state, setState] = useState("signUp");
  const [username ,setUserName] = useState("");
  const [email ,setEmail] = useState("");
  const [password ,setPassword] = useState("");
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (state === "signUp") {
        const response = await axios.post(backend_url+'api/auth/signin' ,{username ,email ,password}, { withCredentials: true });
        console.log(response.data);
        if (response.data.success) {
             
            localStorage.setItem('isLoggedIn', 'true');
            window.location.replace(import.meta.env.VITE_DASHBOARD_URL);

        }
    } else {
       

      const response = await axios.post(backend_url+'api/auth/login' ,{email ,password}, { withCredentials: true });
        console.log(response.data);
        if (response.data.success) {
            
            localStorage.setItem('isLoggedIn', 'true');
            window.location.replace(import.meta.env.VITE_DASHBOARD_URL);

        }
    }
  };
  const handleForgot = ()=> {
    navigate('/forgotpassword');
  }
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "400px" ,marginBottom:"110px" ,height:"460px" }}>
        <h3 className="text-center mb-4">
          {state === "signUp" ? "Create Account" : "Log In"}
        </h3>

        <form onSubmit={handleSubmit}>
          {state === "signUp" && (
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
          )}

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
            {state === "signUp" ? (
              <p className="text-muted mb-0 mt-2">
                Already have an account?{" "}
                <span
                  className="text-primary fw-semibold"
                  role="button"
                  onClick={() => setState("logIn")}
                >
                  Log In
                </span>
              </p>
            ) : (
              <>
              <p className="text-muted mb-0 mt-5 pt-5">
                Don’t have an account?{" "}
                <span
                  className="text-primary fw-semibold"
                  role="button"
                  onClick={() => setState("signUp")}
                >
                  Sign Up
                </span>
              </p>
              
              </>
            )}
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
            {state === "signUp" ? "Sign Up" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
