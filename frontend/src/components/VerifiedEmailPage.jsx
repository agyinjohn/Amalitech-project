import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const VerifiedEmailPage = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Null");
  useEffect(() => {
    console.log(token);
    axios
      .get(
        `https://amalitech-project-6652.onrender.com/api/verify-email/${token}`
      )
      .then((res) => setMessage(res.message))
      .catch((err) => setMessage(err.response.data.error));
  });
  return (
    <div>
      <p>{message}</p>
    </div>
  );
};

export default VerifiedEmailPage;
