import React, { useState } from "react";
import axios from "axios";
import CustomAlert from "./CustomAlert";
const API_URL = "http://localhost:8000/api/";
function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [alert, setAlert] = useState({ show: false, message: "" });

  const triggerAlert = (message) => {
    setAlert({ show: true, message: `${message}!` });
  };

  const closeAlert = () => {
    setAlert({ show: false, message: "" });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      triggerAlert("Please passwords do not much");
      return;
    }
    // Add your sign-up logic here
    axios
      .post(`${API_URL}/signup`, { email, password })
      .then((res) => {
        triggerAlert(res.data.message);
      })
      .catch((err) => {
        triggerAlert(err.response.data.error);
      });
  };

  return (
    <>
      <CustomAlert
        message={alert.message}
        show={alert.show}
        onClose={closeAlert}
      />
      <div className="signup-container">
        <div className="signup-card">
          <h2>Sign Up</h2>
          <form className="signup-form" onSubmit={handleSignUp}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUpPage;
