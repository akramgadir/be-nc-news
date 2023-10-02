const { fetchTopics } = require("../models/topics.models");

fetchTopics;
exports.getTopics = (req, res) => {
  fetchTopics(req.query)
    .then((topics) => {
      //   console.log(topics);
      res.status(200).send({ topics });
    })
    .catch((err) => {
      //   console.error(err);
      res.status(500).send("Internal Server Error");
    });
};
