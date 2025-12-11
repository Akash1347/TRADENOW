import React from "react";
import { NavLink } from "react-router-dom";

function Menu() {
  return (
    <div className="menu-container">
      <img src="logo.png" style={{ width: "50px" }} alt="Logo" /> 

      <div className="menus">
        <ul>

          <li>
            <NavLink to="/" className="menu nav-link" >
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="/orders" className="menu nav-link" >
              Orders
            </NavLink>
          </li>

          <li>
            <NavLink to="/holdings" className="menu nav-link" >
              Holdings
            </NavLink>
          </li>

          <li>
            <NavLink to="/positions" className="menu nav-link"  >
              Positions
            </NavLink>
          </li>

          <li>
            <NavLink to="/funds" className="menu nav-link" >
              Funds
            </NavLink>
          </li>

          <li>
            <NavLink to="/apps" className="menu nav-link" >
              Apps
            </NavLink>
          </li>

        </ul>

        <hr />

         
      </div>
    </div>
  );
}

export default Menu;
