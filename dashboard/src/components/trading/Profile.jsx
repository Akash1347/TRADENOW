import { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import "./profile.css";
import axios from "axios";
import {toast} from "react-toastify";
import { useNavigate } from "react-router-dom";



function Profile(){
    const {isLoggedIn ,userData ,setIsLoggedIn, setUserData, setUserWatchlist} = useContext(UserContext);
    const navigate = useNavigate();
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const handleVerify = ()=> {
        if(userData.isVerified){
            toast.success("Already Account has been Verifed");
        }else{
            navigate('/verifyAccount');
        }
    }
    const handleLogOut = async () => {
        try {
            // Try to logout from backend
            await axios.post(
                `${backend_url}/api/auth/logout`,
                {},
                { 
                    withCredentials: true,
                    timeout: 5000
                }
            );
        } catch (error) {
            // Even if backend logout fails, still clear frontend state
            console.warn("Backend logout failed, but clearing frontend state:", error);
        } finally {
            // Always clear all user data on logout
            setIsLoggedIn(false);
            setUserData(null);
            setUserWatchlist([]);
            localStorage.removeItem("isLoggedIn");
            // Also clear any other potential localStorage items
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userToken");
            toast.success("Logged out successfully");
            navigate("/");
        }
    };
    const handleLogIn = ()=> {
        window.location.replace(import.meta.env.VITE_FRONTEND_URL + 'login');
    };

    return(
       <div className="profile-dropdown">
        <div className="card profile-card">
            <ul className="list-group list-group-flush">
            {isLoggedIn ? (
                <>
                <li className="list-group-item profile-item" >Profile</li>
              
                

             
                <li className="list-group-item profile-item">Settings</li>
                {!userData.isVerified && (
                    <li className="list-group-item profile-item" onClick={handleVerify}>Verify</li>
                )}  
                <li className="list-group-item profile-item" onClick={handleLogOut}>Logout</li>              
                </>
            ) : (
                <li className="list-group-item profile-item" onClick={handleLogIn}>Log In</li>
            )}
            </ul>
        </div>
       </div>


    )
}

export default Profile;
