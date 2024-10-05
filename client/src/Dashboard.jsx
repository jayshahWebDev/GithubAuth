import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const jwtToken = params.get("jwt");

    if (jwtToken && params) {
      localStorage.setItem("jwt", jwtToken);

      axios
        .get("http://localhost:5000/api/github/user", {
          headers: { Authorization: `Bearer ${jwtToken}` },
        })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [location.search]);

  return (
    <div>
      <h1>Dashboard</h1>
      {userData ? (
        <div>
          <h2>Welcome, {userData.login}</h2>
          <img src={userData.avatar_url} alt="User Avatar" />
          <p>GitHub Profile: {userData.html_url}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
