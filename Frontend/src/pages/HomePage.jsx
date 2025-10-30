import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Navbar from "./Navbar";

export default function HomePage() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleJoinCall = () => {
    // trim() ensures no extra spaces
    if (!meetingCode || meetingCode.trim() === "") {
      setErrorMessage("⚠️ Please enter a valid room code.");
      return;
    }

    // clear error and navigate
    setErrorMessage("");
    navigate(`/${meetingCode}`);
  };

  return (
    <div className="container">
      <Navbar />

      <div className="box row">
        <div className="text col-md-6 col-12 text-center">
          <h3>Providing Quality Video Call Just Like Quality Education</h3>

          <label htmlFor="floatingInputGrid" className="form-label mt-3">
            Enter Room Code
          </label>

          <input
            type="text"
            className="form-control w-75 mx-auto"
            id="floatingInputGrid"
            placeholder="123456"
            value={meetingCode}
            onChange={(e) => setMeetingCode(e.target.value)}
          />

          {/* Error message display */}
          {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}

          <button
            type="button"
            className="btn btn-outline-info mt-3"
            onClick={handleJoinCall}
          >
            Connect
          </button>
        </div>

        <div className="img col-md-6 col-12"></div>
      </div>
    </div>
  );
}
