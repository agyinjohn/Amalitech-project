import React, { useState } from "react";
import axios from "axios";
import CustomAlert from "./CustomAlert";
import LoadingIndicator from "./LoadingIndicator";
const API_URL = "http://localhost:8000/api/login";
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const triggerAlert = (message) => {
    setAlert({ show: true, message: `${message}!` });
  };

  const closeAlert = () => {
    setAlert({ show: false, message: "" });
  };
  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here
    // onLogin(email, password);
    setIsLoading(true);
    axios
      .post(`${API_URL}`, { email, password })
      .then((res) => {
        setIsLoading(false);
        triggerAlert(res.data.message);
      })
      .catch((err) => {
        setIsLoading(false);
        triggerAlert(err.response.data.error);
      });
  };

  const handleForgotPassword = () => {
    //   onForgotPassword(email);
  };

  return (
    <>
      <CustomAlert
        message={alert.message}
        show={alert.show}
        onClose={closeAlert}
      />

      <div className="login-container">
        <div className="login-card">
          <h2>Login</h2>
          <form className="login-form" onSubmit={handleLogin}>
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
            <button type="submit">
              {isLoading ? <LoadingIndicator /> : "Login"}
            </button>
            <button
              type="button"
              className="forgot-password"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
