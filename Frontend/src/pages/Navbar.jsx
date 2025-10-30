import React from "react";
import "./Navbar.css";
import { useAuth } from "../contexts/AuthContext";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Navbar() {
  const { handleLogout } = useAuth(); // ✅ access from context

  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Talkkr
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active btn" href="/home">
                <HomeIcon className="homeIcon" /> Home
              </a>
            </li>
           
          </ul>

          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link btn" href="/history">
                <HistoryIcon />
                History
              </a>
            </li>
            <li className="nav-item">
              {/* ✅ use onClick directly */}
              <a className="nav-link btn " href="#" onClick={handleLogout}>
                <LogoutIcon /> Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
