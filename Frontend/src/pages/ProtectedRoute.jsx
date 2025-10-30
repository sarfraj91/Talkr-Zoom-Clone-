// import React from "react";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("token");

//   // ✅ if not logged in, redirect to login
//   if (!token) {
//     return <Navigate to="/auth" replace />;
//   }

//   // ✅ else, show the page
//   return children;
// }



// src/pages/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // ✅ Allow guest access to some routes
  const publicPathsForGuests = ["/", "/auth", "/home"];
  const isVideoMeet = /^\/[a-zA-Z0-9_-]+$/.test(location.pathname); // matches /room123 or /meeting-xyz

  if (token) {
    // Logged-in users → always allowed
    return children;
  }

  if (publicPathsForGuests.includes(location.pathname) || isVideoMeet) {
    // Guests can access these pages
    return children;
  }

  // If not allowed → redirect to Landing
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;





