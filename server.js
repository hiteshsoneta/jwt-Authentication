require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

const posts = [
  {
    username: "hitesh",
    title: "api",
  },
  {
    username: "Hitesh1",
    title: "jwt",
  },
];

app.get("/", authenticateToken, (req, res) => {
  res.json(posts.filter((posts) => posts.username === req.user.name));
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };
  // console.log("username:", username);
  // console.log("user:", user);

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
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

app.listen(3000);
