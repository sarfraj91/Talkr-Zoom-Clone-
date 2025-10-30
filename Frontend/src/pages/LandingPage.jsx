import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth"); // navigate to Authentication page
  };
  const handleGuest = () => {
    navigate("/home"); // navigate to Authentication page
  };
  return (
    <div className="LandingPageContainer">
      <nav className="navbar">
        <div className="navHeader logo">
          <h1>Talkr</h1>
        </div>
        <div className="navList">
          <p onClick={handleGuest}>join as Guest</p>
         

          <div role="buttom" onClick={handleGetStarted}>
            <p> Register/Login</p>
          </div>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div>
          <h1>
            <span style={{ color: "#ff9839" }}>Connect</span> Your digital hangout space
          </h1>
          <p>Cover a distance by <strong>Talkr</strong> video call App</p>
          <div className="homeButtom" role="buttom" onClick={handleGetStarted}>
            Get Start
          </div>
        </div>

        <div className="imgBox">
          <img src="/mobile.png" alt="mobile image" />
        </div>
      </div>
    </div>
  );
}
