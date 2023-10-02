const db = require("../db/connection.js");

exports.fetchTopics = () => {
  //   console.log("you are in models");
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};
