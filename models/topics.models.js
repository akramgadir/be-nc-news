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
exports.fetchArticles = (topic) => {
  let query = `SELECT * FROM articles`;
  let params = [];
  if (topic) {
    query += ` WHERE articles.topic = \$1`;
    params.push(topic);
  }
  return db.query(query, params).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticles = (topic) => {
  let params = [];
  console.log(topic, "topic in models");

  let query = `
    SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
  `;
  if (topic) {
    console.log("articles models topic entered!!");
    query = `
    SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.topic = $1
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
  `;
    params.push(topic);
  }

  return db.query(query, params).then(({ rows }) => {
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

exports.addCommentById = (id, username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      message: "bad request; incorrect format",
    });
  } else {
    return db
      .query(
        `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`, //can't use %L here. need to use $ syntax
        [body, username, id]
      )
      .then((response) => {
        //console.log(response.rows, "response in MODEL");   //this custom error didnt work. used psql error handler instead.
        //   if (response.rows.length === 0) {
        //     return Promise.reject({
        //       status: 404,
        //       message: "article id not found",
        //     });
        //   } else {
        return response.rows[0];
        //  }
      });
  }
};

exports.updateArticleVotes = (id, inc_votes) => {
  console.log(id, "id in MODEL");
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      message: "no change in vote",
    });
  } else {
    return db
      .query(
        `UPDATE articles SET votes=votes + $2 WHERE article_id = $1 RETURNING *;`,
        [id, inc_votes]
      )
      .then((response) => {
        if (response.rows.length === 0) {
          return Promise.reject({
            status: 404,
            message: "article id not found",
          });
        }
        console.log("response rows 0 in updateArticleVotes", response.rows[0]);
        return response.rows[0];
      });
  }
};

// exports.insertComment = (newComment) => {
//   const { username, body, article_id } = newComment;
//   return db
//     .query(
//       "INSERT INTO comments (username, body, article_id) VALUES ($1, $2, $3) RETURNING *;",
//       [username, body, article_id]
//     )
//     .then(({ rows }) => rows[0]);
// };

//

//might need to add ALTER TABLE comments ADD COLUMN username VARCHAR(255);

// //delete this it didnt work
// exports.addComment = (req, res, next) => {
//   console.log("COMMENT TEST: req.body = ", req.body);
//   const { article_id } = req.params;
//   const { username, body } = req.body; //returning undefined
//   const query = `
//     INSERT INTO comments (username, body, article_id)
//     VALUES (\$1, \$2, \$3)
//     RETURNING *;
//   `;

//   db.query(query, [username, body, article_id])
//     .then((result) => {
//       res.status(201).send({ comments: result.rows[0] });
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
