// /* eslint-disable no-unused-vars */
// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../contexts/AuthContext.jsx";
// import { useNavigate } from "react-router-dom";
// import Navbar from "./Navbar.jsx";
// import "./History.css";

// export default function History() {
//   const { getHistoryOfOffer } = useContext(AuthContext) || {}; // ✅ fallback to avoid crash if undefined
//   const [historyData, setHistoryData] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         if (typeof getHistoryOfOffer === "function") {
//           const history = await getHistoryOfOffer();
//           setHistoryData(Array.isArray(history) ? history : []);
//         } else {
//           console.warn("⚠️ getHistoryOfOffer is not available yet.");
//         }
//       } catch (error) {
//         console.error("Error fetching history:", error);
//       }
//     };
//     fetchHistory();
//   }, [getHistoryOfOffer]);

//   // ✅ Date formatter
//   const formatDate = (datestr) => {
//     if (!datestr) return "Unknown Date";
//     const date = new Date(datestr);
//     const day = date.getDate().toString().padStart(2, "0");
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   return (
//     <div className="history-wrapper container">
//       <Navbar />

//       <div className="history-box">
//         <h2>Offer Activity History</h2>

//         {historyData.length === 0 ? (
//           <p>No history found.</p>
//         ) : (
//           <ul>
//             {historyData.map((item, index) => (
//               <li key={index} className="history-item">
//                 <strong>{item.title || "Untitled Offer"}</strong> —{" "}
//                 {item.status || "N/A"}
//                 <br />
//                 Date: {formatDate(item.createdAt)}
//                 <br />
//                 Code: <strong>{item.code || "—"}</strong>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// src/pages/History.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

import HomeIcon from "@mui/icons-material/Home";
import "./History.css"; // ✅ add CSS import
import Navbar from "./Navbar";

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
 

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(Array.isArray(history) ? history : []);
      } catch (err) {
        console.error("Error loading history:", err);
      }
    };

    fetchHistory();
  }, [getHistoryOfUser]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div className="container history-container">
      {/* <button className="home-btn" onClick={() => navigate("/home")}>
        <HomeIcon fontSize="large" />
      </button> */}

      <Navbar/>

      <div className="history-box">
        <h2> Meeting History</h2>

        {meetings.length > 0 ? (
          <div className="history-list">
            {meetings.map((meeting, index) => (
              <div className="history-card" key={index}>
                <p>
                  <strong>Meeting Code:</strong> {meeting.meetingCode}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(meeting.date)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-history">No history found.</p>
        )}
      </div>
    </div>
  );
}
