const db = require("../db/connection.js");

exports.fetchTopics = () => {
  //   console.log("you are in models");
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (id) => {
  //   console.log("you are in models");
  console.log("models, logging id:", id); //22po2?
  const articles = db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [id])
    .then((result) => {
      if (result.rowCount === 0) {
        console.log("models failed");
        return Promise.reject({ status: 404, message: "not found" });
      } else {
        console.log("models passed");
        return result.rows[0];
      }
    });
  console.log(articles);
  return articles;
};
