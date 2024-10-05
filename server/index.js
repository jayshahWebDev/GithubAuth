const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;

app.get("/auth/github", (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}`;
  res.redirect(githubAuthUrl);
});

app.get("/auth/github/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      { headers: { accept: "application/json" } }
    );
    const accessToken = tokenResponse.data.access_token;

    const jwtToken = jwt.sign({ accessToken }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.redirect(`http://localhost:5173/dashboard?jwt=${jwtToken}`);
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    res.status(500).send("Authentication failed");
  }
});

app.get("/api/github/user", async (req, res) => {
  const jwtToken = req.headers.authorization?.split(" ")[1];

  try {
    const decoded = jwt.verify(jwtToken, JWT_SECRET);

    const githubResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${decoded.accessToken}` },
    });

    res.json(githubResponse.data);
  } catch (error) {
    res.status(401).json({ error: "Invalid token or unauthorized" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
