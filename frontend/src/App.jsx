import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import VideoPage from "./components/VideoPage";
import UploadPage from "./components/UploadPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import Layout from "./components/Layout";
import VerifiedEmailPage from "./components/VerifiedEmailPage";
import HomaPage from "./components/HomaPage";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/reset-password:token" element={<ResetPasswordPage />} />
            <Route
              path="/verify-email/:token"
              element={<VerifiedEmailPage />}
            />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomaPage />} />
              <Route path="/videos/video/:id" element={<VideoPage />} />
              <Route path="/upload" element={<UploadPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
