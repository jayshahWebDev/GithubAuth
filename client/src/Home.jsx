import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const githubLoginUrl = `http://localhost:5000/auth/github`;

  return (
    <div>
      <h1>Welcome to GitHub OAuth App</h1>
      <Link to={githubLoginUrl}>
        <button>Login with GitHub</button>
      </Link>
    </div>
  );
};

export default Home;
