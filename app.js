const express = require("express");
const {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  getUsers,
  addComment,
  deleteComment,
  updateArticle,
  postComment,
} = require("./controllers/topics.controllers.js");
const endpoints = require("./endpoints.json");
const {
  handle500Errors,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./error-handling");
const app = express();
const cors = require("cors");

app.use(cors());
// app.use(express.urlencoded({ extended: false }));
app.use(express.json()); //needed for post requests

// check api is running ok
// app.get("/api/topics", (req, res) => {
//   res.status(200).send({ message: "getting topics, 200 successful" });
// });

app.get("/api/topics", getTopics);

app.get("/api", (req, res, next) => {
  res.json(endpoints);
});

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);
//add property of: comment_count, which is the total count of all the comments with this article_id. You should make use of queries to the database in order to achieve this.

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.get("/api/users", getUsers);

// app.post("/api/articles/:article_id/comments", addComment);
app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", updateArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handle500Errors); //comes last as its the backup error, the order matters here not in the handling file

module.exports = app;
