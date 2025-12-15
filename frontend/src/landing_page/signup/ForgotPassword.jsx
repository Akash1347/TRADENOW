import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./forgotPassword.css";

function ForgotPassword() {
  const [state, setState] = useState("sendOtp");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      const res = await axios.post(
        `${backend_url}api/auth/forgotpassword`,
        { email }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setState("verifyOtp");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to send OTP");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setState("updatePassword");
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    console.log(email);
    console.log(otp);
    console.log(password);
    console.log( `${backend_url}api/auth/resetpassword`);
    try {
      const res = await axios.post(
        
        `${backend_url}api/auth/resetpassword`,
        { email, otp, password }
      );
      if (res.data.success) {
        toast.success("Password updated");
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Password reset failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h4 className="text-center mb-3">Forgot Password</h4>

        {state === "sendOtp" && (
          <>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-primary w-100" onClick={sendOtp}>
              Send OTP
            </button>
          </>
        )}

        {state === "verifyOtp" && (
          
          <form onSubmit={verifyOtp}>
            <div className="d-flex justify-content-between mb-4">
                {[...Array(6)].map((_, index) => (
                <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="form-control text-center otp-input"
                    value={otp[index] || ""}
                    onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    const newOtp = otp.split("");
                    newOtp[index] = value;
                    setOtp(newOtp.join(""));
                    }}
                />
                ))}
            </div>

            <button type="submit" className="btn btn-primary w-100">
                Verify OTP
            </button>
            </form>
        )}

        {state === "updatePassword" && (
          <form onSubmit={updatePassword}>
            <input
              type="password"
              className="form-control mb-3"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary w-100">
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
