const db = require("../db/connection.js");

exports.fetchTopics = () => {
  //   console.log("you are in models");
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    //deconstructing rows from the results results object
    return rows;
  });
};

exports.fetchArticleById = (id) => {
  //   console.log("you are in models");
  console.log("models, logging id:", id); //22po2?
  let query = `SELECT * FROM articles WHERE article_id=$1;`;
  const articles = db.query(query, [id]).then((result) => {
    if (result.rowCount === 0) {
      // console.log("models failed");
      return Promise.reject({ status: 404, message: "not found" });
    } else {
      // console.log("models passed");
      return result.rows[0];
    }
  });
  console.log(articles);
  return articles;
};

exports.fetchArticles = () => {
  let query = `
    SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
  `;
  return db.query(query).then(({ rows }) => {
    rows.forEach((article) => {
      delete article.body;
    });
    return rows;
  });
};

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
      SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id 
      FROM comments 
      WHERE comments.article_id = $1
      ORDER BY comments.created_at DESC;
    `,
      [article_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        // console.log("models failed");
        return Promise.reject({
          status: 404,
          message: "Not found",
        });
      } else {
        // console.log("models passed");
        return result.rows;
      }
    });
};

exports.fetchUsers = () => {
  //   console.log("you are in models");
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    //deconstructing rows from the results object
    return rows;
  });
};
