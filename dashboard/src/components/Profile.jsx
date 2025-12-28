import { useContext } from "react";
import { UserContext, UserContextProvider } from "./userContext";
import "./profile.css"
import axios from "axios";
import {toast} from "react-toastify";
import { useNavigate } from "react-router-dom";



function Profile(){
    const {isLoggedIn ,userData ,setIsLoggedIn} = useContext(UserContext);
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
        await axios.post(
        `${backend_url}api/auth/logout`,
        {},
        { withCredentials: true }
        );
    } catch {
        // ignore backend failure
    } finally {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
        toast.success("Logged out");
        navigate("/");
    }
    };
    const handleLogIn = ()=> {
        window.location.replace(import.meta.env.VITE_FRONTEND_URL + 'signup');

    }

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
