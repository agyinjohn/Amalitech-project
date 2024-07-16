import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.resetPasswordRequest(email);
      alert("Password reset email sent");
      navigate("/");
    } catch (error) {
      setError("Error sending password reset email");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      padding: "20px",
    },
    formWrapper: {
      backgroundColor: "#fff",
      padding: "30px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      maxWidth: "400px",
      width: "100%",
      textAlign: "center",
    },
    header: {
      marginBottom: "20px",
      fontSize: "24px",
      color: "#333",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontSize: "14px",
      color: "#555",
    },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: "14px",
      borderRadius: "4px",
      border: "1px solid #ddd",
      disabled: loading,
    },
    button: {
      padding: "10px 20px",
      fontSize: "14px",
      color: "#fff",
      backgroundColor: "#007bff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginTop: "10px",
      disabled: loading,
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    error: {
      color: "red",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.header}>Reset Password</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              disabled={loading}
            />
          </div>
          <button
            type="button"
            onClick={handleResetPassword}
            style={styles.button}
            onMouseOver={(e) =>
              !loading &&
              (e.target.style.backgroundColor =
                styles.buttonHover.backgroundColor)
            }
            onMouseOut={(e) =>
              !loading &&
              (e.target.style.backgroundColor = styles.button.backgroundColor)
            }
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
