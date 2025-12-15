import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


function VerifyAccount() {
  const [otp, setOtp] = useState("");
  const [state ,setState] = useState("sendOtp")
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

   
  const handleSendOtp = async()=> {
    try{
        const response = await axios.post(backend_url+'/api/auth/sendverificationotp' ,{} ,{withCredentials:true});
        if(response.data.success){
            toast.success(response.data.message);
            setState("verifyOtp");
        }else{
            toast.error(response.data.message);
        }
    } catch (err) {
        toast.error(
        err.response?.data?.message || "Failed to send OTP"
        );
    }
  };

  const verifyOtp = async(e)=> {
    e.preventDefault(); 
    try{
        const response = await axios.post(backend_url+'/api/auth/verifyaccount' ,{otp} ,{withCredentials:true});
         
        if(response.data.success){
            toast.success(response.data.message);
             
            navigate('/')
        }else{
            toast.error(response.data.message);
        }
    }catch (err) {
        toast.error(
        err.response?.data?.message || "Failed to send OTP"
        );
    }

  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div className="card shadow-lg p-4 rounded-4" style={{ width: "380px" }}>

        {state === "sendOtp" ? (
        <>
            <h4 className="text-center mb-3">Verify Your Account</h4>
            <p className="text-center text-muted mb-4">
            Click the button to receive OTP
            </p>

            <button
            type="button"
            className="btn btn-primary w-100"
            onClick={handleSendOtp}
            >
            Send OTP
            </button>
        </>
        ) : (
        <>
            <h4 className="text-center mb-2">Enter OTP</h4>
            <p className="text-center text-muted mb-4">
            Enter the 6-digit OTP sent to your email
            </p>

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

            <p className="text-center mt-3 mb-0">
            Didn’t receive OTP?{" "}
            <span
                className="text-primary fw-semibold"
                role="button"
                //onClick={verifyOtp}
            >
                Resend
            </span>
            </p>
        </>
        )}

    </div>
    </div>

    
  );
}

export default VerifyAccount;
