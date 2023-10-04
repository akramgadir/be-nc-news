const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
} = require("../models/topics.models");

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
  fetchArticles()
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
