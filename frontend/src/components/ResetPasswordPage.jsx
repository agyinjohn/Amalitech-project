import React, { useState } from "react";
import authService from "../services/authService";

function ResetPasswordPage() {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    try {
      await authService.resetPassword(email);
      alert("Password reset email sent");
    } catch (error) {
      alert("Error sending password reset email");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleResetPassword}>
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPasswordPage;
