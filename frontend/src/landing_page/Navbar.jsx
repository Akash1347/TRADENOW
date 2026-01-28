import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg border-bottom"
      style={{ backgroundColor: "#FFF" }}
    >
      <div className="container p-2">

        <NavLink className="navbar-brand" to="/">
          <img
            src="/media/images/logo.svg"
            style={{ width: "25%" }}
            alt="Logo"
          />
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse row" id="navbarSupportedContent">
          <div className="col-3"></div>

          <form className="d-flex col-9" role="search">
            <ul className="navbar-nav mb-lg-0">

              <li className="nav-item ms-3" id="nav_custom_hover">
                {/* <NavLink className="nav-link" to="/login">
                  Login
                </NavLink> */}
                <NavLink className="nav-link" to="/signup">
                  Signup
                </NavLink>
              </li>

              <li className="nav-item ms-3" id="nav_custom_hover">
                <NavLink className="nav-link" to="/about">
                  About
                </NavLink>
              </li>

              <li className="nav-item ms-3" id="nav_custom_hover">
                <NavLink className="nav-link" to="/product">
                  Product
                </NavLink>
              </li>

              <li className="nav-item ms-3" id="nav_custom_hover">
                <NavLink className="nav-link" to="/pricing">
                  Pricing
                </NavLink>
              </li>

              <li className="nav-item ms-3" id="nav_custom_hover">
                <NavLink className="nav-link" to="/support">
                  Support
                </NavLink>
              </li>

            </ul>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
