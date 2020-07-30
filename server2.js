require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());
let refreshTokens = [];

app.get("/", authenticateToken, (req, res) => {
  res.json(posts.filter((posts) => posts.username === req.user.name));
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };
  // console.log("username:", username);
  // console.log("user:", user);

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REQUEST_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REQUEST_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  //console.log("header", authHeader);
  //const token = authHeader;
  const token = authHeader && authHeader.split(" ")[1];

  //console.log("token:", token);
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
}

app.listen(4000);
