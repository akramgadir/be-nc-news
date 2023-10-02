const express = require("express");
const {
  getTopics,
  getArticles,
  getArticleById,
} = require("./controllers/topics.controllers.js");
const endpoints = require("./endpoints.json");

const app = express();

// check api is running ok
// app.get("/api/topics", (req, res) => {
//   res.status(200).send({ message: "getting topics, 200 successful" });
// });

app.get("/api/topics", getTopics);

app.get("/api", (req, res, next) => {
  res.json(endpoints);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

module.exports = app;
// module.exports = { app };
