const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  fetchUsers,
  addCommentById,
  updateArticleVotes,
} = require("../models/topics.models");

const db = require("../db/connection.js");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      //   console.log(topics);
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((articles) => {
      res.status(200).send({ articles }); //when were ready to send something to the user use res.status
    })
    .catch((err) => {
      //if someone does an incorrect sql query in models it goes here bc it throws an sql error
      console.log("test3", err);

      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;
  fetchArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (request, response, next) => {
  //console.log(request.body, "request in CONTROLLER");
  const id = request.params.article_id;
  const username = request.body.username;
  const body = request.body.body;
  addCommentById(id, username, body)
    .then((addedComment) => {
      response.status(201).send({ comment: addedComment });
    })
    .catch((err) => {
      console.log(err, "custom err in CONTROLLER");
      next(err);
    });
};

exports.patchArticleById = (request, response, next) => {
  const id = request.params.article_id;
  const inc_votes = request.body.inc_votes;
  updateArticleVotes(id, inc_votes)
    .then((article) => {
      console.log("article in patch!: ", article);
      response.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

// exports.updateArticle = (req, res, next) => {
//   const { article_id } = req.params;
//   const { inc_votes } = req.body;

//   if (!inc_votes) {
//     return res.status(400).send({ error: "Bad Request: Missing inc_votes" });
//   }

//   const query = `
//     UPDATE articles
//     SET votes = votes + \$1
//     WHERE article_id = \$2
//     RETURNING *;
//   `;

//   db.query(query, [inc_votes, article_id])
//     .then((result) => {
//       if (result.rowCount === 0) {
//         return Promise.reject({ status: 404, message: "Not found" });
//       } else {
//         res.status(200).send({ articles: result.rows[0] });
//       }
//     })
//     .catch((err) => {
//       next(err);
//     });
// };

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  const query = `
    DELETE FROM comments
    WHERE comment_id = \$1
    RETURNING *;
  `;

  db.query(query, [comment_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, message: "Not found" });
      } else {
        res.status(204).send({ comments: result.rows[0] });
      }
    })
    .catch((err) => {
      next(err);
    });
};
