const express = require("express");
const {
  getTopics,
  getArticles,
  getArticleById,
} = require("./controllers/topics.controllers.js");
const endpoints = require("./endpoints.json");
//ONCE PR IS APPROVED, MERGE ON GITHUB CHECKECOUT TO MAIN BRANCH AND THEN PULL
//MAKE THE NEW BRANCH FIRST THING AKRAM 4
const app = express();

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server Error!");
});

// check api is running ok
// app.get("/api/topics", (req, res) => {
//   res.status(200).send({ message: "getting topics, 200 successful" });
// });

app.get("/api/topics", getTopics);

app.get("/api", (req, res, next) => {
  res.json(endpoints);
});

module.exports = app;
// module.exports = { app };
