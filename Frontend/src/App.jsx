// import "./app.css";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LandingPage from "./pages/LandingPage";
// import Authentication from "./pages/Authentication";
// import { AuthProvider } from "./contexts/AuthContext";
// import Videomeet from "./pages/Videomeet";
// import History from "./pages/History";
// import HomePage from "./pages/HomePage";
// import ProtectedRoute from "./pages/ProtectedRoute.jsx"; // ✅ import

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <Routes>
//           {/* PUBLIC ROUTES */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/auth" element={<Authentication />} />
//           <Route path="/home" element={<HomePage />} />

//           {/* PROTECTED ROUTES */}

//           <Route
//             path="/history"
//             element={
//               <ProtectedRoute allowGuest={false}>
//                 <History />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/:url"
//             element={
//               <ProtectedRoute allowGuest={true}>
//                 <Videomeet />
//               </ProtectedRoute>
//             }
//           />

//           {/* FALLBACK — redirect unknown routes */}
//           <Route path="*" element={<LandingPage />} />
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;



import "./app.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Authentication from "./pages/Authentication";
import { AuthProvider } from "./contexts/AuthContext";
import Videomeet from "./pages/Videomeet";
import History from "./pages/History";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/home" element={<HomePage />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

          {/* VIDEO MEET — accessible to guests too */}
          <Route
            path="/:url"
            element={
              <ProtectedRoute>
                <Videomeet />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
