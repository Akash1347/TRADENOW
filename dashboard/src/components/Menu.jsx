import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "./userContext";
import Profile from "./Profile";

function Menu() {
  const { isLoggedIn, userData } = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(false);
  const profileRef = useRef(null);

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setShowMenu(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="menu-container">
      <img src="logo.png" style={{ width: "50px" }} alt="Logo" />

      <div className="menus">
        <ul>
          <li><NavLink to="/" className="menu nav-link">Dashboard</NavLink></li>
          <li><NavLink to="/orders" className="menu nav-link">Orders</NavLink></li>
          <li><NavLink to="/holdings" className="menu nav-link">Holdings</NavLink></li>
          <li><NavLink to="/positions" className="menu nav-link">Positions</NavLink></li>
          <li><NavLink to="/funds" className="menu nav-link">Funds</NavLink></li>
          <li><NavLink to="/apps" className="menu nav-link">Apps</NavLink></li>
        </ul>

        <hr />

        <div
          className="profile"
          ref={profileRef}
          onClick={handleProfileClick}
        >
          <div className="avatar">
            {userData?.username
              ? userData.username.charAt(0).toUpperCase()
              : ""}
          </div>

          {showMenu && <Profile />}
        </div>
      </div>
    </div>
  );
}

export default Menu;
