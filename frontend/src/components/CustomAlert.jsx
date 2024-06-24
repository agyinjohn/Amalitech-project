import React, { useState, useEffect } from "react";
// Import the CSS file for the alert styles

function CustomAlert({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Adjust the duration as needed
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return <div className={`custom-alert ${show ? "show" : ""}`}>{message}</div>;
}

export default CustomAlert;
