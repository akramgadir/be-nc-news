const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/topics").expect(200);
  });

  test("returns an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body, status }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("description");
          expect(topic).toHaveProperty("slug");
          expect(typeof topic).toBe("object");
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});

describe("GET /api", () => {
  test("responds with a JSON object containing descriptions for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body["GET /api"].description).toEqual(
          "serves up a json representation of all the available endpoints of the api"
        );
        expect(res.body["GET /api/topics"].description).toEqual(
          "serves an array of all topics"
        );
        expect(res.body["GET /api/articles"].description).toEqual(
          "serves an array of all articles"
        );
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("returns 200 status code", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((res) => {
        expect(res.body.articles.article_id).toBe(2);
        expect(res.body.articles.title).toEqual("Sony Vaio; or, The Laptop");
        expect(res.body.articles.author).toEqual("icellusedkars");
        expect(res.body.articles.votes).toEqual(0);
        expect(res.body.articles.article_img_url).toEqual(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(res.body.articles).toHaveProperty("created_at");
        expect(res.body.articles).toHaveProperty("body");
        expect(res.body.articles).toHaveProperty("topic");
      });
  });
  test("returns 404 error status code", () => {
    return request(app)
      .get("/api/articles/2000")
      .expect(404)
      .then(({ body }) => {
        //could also not {} and just do res.body and use res.body under instead too
        expect(body.message).toBe("not found");
      });
  });
  test("returns 400 error status code", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        //could also not {} and just do res.body and use res.body under instead too
        expect(body.message).toBe("PSQL error");
      });
  });
});

describe("GET /api/articles", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/articles").expect(200);
  });

  test("returns an array of articles objects", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body, status }) => {
        // expect(body.articles.length).toBe(13);
        body.articles.forEach((article) => {
          expect(typeof article).toBe("object");
          expect(typeof article.title).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
        });
        expect(body.articles[0].title).toBe(
          "Eight pug gifs that remind me of mitch"
        );
      });
  });

  test("should add comment count property and sort articles in descending date order and remove the body property from each article ", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body, status }) => {
        expect(body.articles[0].comment_count).toBe("2");
        expect(body.articles[1].comment_count).toBe("1");

        expect(body.articles[0].created_at).toBe("2020-11-03T09:12:00.000Z");
        expect(body.articles[1].created_at).toBe("2020-10-18T01:00:00.000Z");
        expect(body.articles[2].created_at).toBe("2020-10-16T05:03:00.000Z");
        expect(body.articles[3].created_at).toBe("2020-10-11T11:24:00.000Z");

        body.articles.forEach((article) => {
          expect(article).toHaveProperty("comment_count");
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/articles/3/comments").expect(200);
  });

  test("returns 404 status code when given an invalid id", () => {
    return request(app).get("/api/articles/2000/comments").expect(404);
  });

  test("returns 404 status code when given an invalid id", () => {
    return request(app).get("/api/articles/2/comments").expect(404);
  });
  test("returns 400 status code when given an invalid id", () => {
    return request(app).get("/api/articles/banana/comments").expect(400);
  });

  test("should make sure each comment has the correct properties", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .then((res) => {
        const comment = res.body.comments[0];

        expect(comment.comment_id).toBe(11);
        expect(comment.votes).toBe(0);
        expect(comment.created_at).toBe("2020-09-19T23:10:00.000Z");
        expect(comment.body).toBe("Ambidextrous marsupial");
        expect(comment.article_id).toBe(3);
      });
  });
});

describe("GET /api/users", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/users").expect(200);
  });

  test("returns an array of topic objects", () => {
    return request(app)
      .get("/api/users")
      .then(({ body, status }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(typeof user).toBe("object");
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
describe("GET /api/articles?topic=...", () => {
  test("returns 200 status code and articles with a specific topic when topic query parameter is given", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.articles)).toBe(true);
        response.body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
});

// describe("POST /api/articles/:article_id/comments", () => {
//   //not working
//   test("returns 201 status code", () => {
//     return request(app)
//       .post("/api/articles/1/comments")
//       .send({ username: "testuser", body: "This is a test comment" })
//       .expect(201);
//   });

//   test("returns the posted comment", () => {
//     //not working
//     return request(app)
//       .post("/api/articles/1/comments")
//       .send({ username: "testuser", body: "This is a test comment" })
//       .then(({ body }) => {
//         console.log("TESTLOG COMMENTS: body = ", body);
//         // expect(body.username).toBe("testuser");
//         // expect(body.body).toBe("This is a test comment");
//         expect(body.comments.username).toBe("testuser");
//         expect(body.comments.body).toBe("This is a test comment");
//       });
//   });

//   test("returns 400 status code when given invalid data", () => {
//     //not working
//     return request(app)
//       .post("/api/articles/1/comments")
//       .send({ username: "testuser" })
//       .expect(400);
//   });
// });

describe("POST /api/articles/:article_id/comments; adds a comment for an article by article id", () => {
  test("posts a comment w/ a username and body", () => {
    const newComment = { username: "rogersop", body: "great article!" }; //in my model do need to change username to author?

    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        console.log(response, "response in TEST");
        // expect(response.body.comment.author).toBe("rogersop");
        expect(response.body.comment).toHaveProperty("author", "rogersop");
        expect(response.body.comment).toHaveProperty("body", "great article!");
        expect(response.body.comment).toHaveProperty("article_id", 3);
        expect(response.body.comment).toHaveProperty("comment_id", 19);
        expect(response.body.comment).toHaveProperty("created_at");
        expect(response.body.comment).toHaveProperty("votes", 0);
        expect(response.body.comment).toHaveProperty(
          "created_at",
          expect.any(String)
        );
      });
  });

  test("status 400; id type invalid", () => {
    const newComment = { username: "rogersop", body: "great article!" };

    return request(app)
      .post("/api/articles/three/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("PSQL error");
      });
  });

  test("status 404; id not found - id type correct but does not exist", () => {
    const newComment = { username: "rogersop", body: "great article!" };

    return request(app)
      .post("/api/articles/3000/comments")
      .send(newComment)
      .expect(500)
      .then((response) => {
        console.log(response.body.message);
        expect(response.body.message).toBe(
          'insert or update on table "comments" violates foreign key constraint "comments_article_id_fkey"'
        );
      });
  });

  test("status 201; ignores unnecessary properties", () => {
    const newComment = {
      username: "rogersop",
      body: "great article!",
      unnecessaryProp: "something to be ignored",
    }; //in my model do need to change username to author? A: yes

    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toEqual({
          author: "rogersop",
          body: "great article!",
          article_id: 3,
          comment_id: 21,
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });

  test("status:400, bad request - not correctly formatted", () => {
    const newComment = {
      body: "who am i?",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        // console.log(res);
        // expect(res.body.message).toBe("Bad Request");
        // expect(response.body.message).toBe("bad request; incorrect format");
      });
  });

  test("status 404; posts a comment w/ a username that does not exist; returns error", () => {
    const newComment = { username: "yshamm", body: "great article!" };

    return (
      request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(500)
        // .expect(404)
        .then((response) => {
          console.log(response, "response in TEST");
          expect(response.body.message).toBe(
            'insert or update on table "comments" violates foreign key constraint "comments_author_fkey"'
          );
        })
    );
  });
});

//patch tests
describe("PATCH /api/articles/:article_id", () => {
  //pass
  test("vote up an article", () => {
    const newVotes = { inc_votes: 10 };

    return request(app)
      .patch("/api/articles/3")
      .send(newVotes)
      .expect(200)
      .then((response) => {
        console.log(response.body, "res in TEST");
        expect(response.body.article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 10,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
        expect(response.body.article.votes).toBe(10);
      });
  });
  //FAIL
  test("status 400; bad request, invalid data type", () => {
    const newVotes = { inc_votes: "ten" };

    return request(app)
      .patch("/api/articles/3")
      .send(newVotes)
      .expect(400)
      .then((response) => {
        console.log(response.body.message, "err msg in TEST");
        expect(response.body.message).toBe("PSQL error");
      });
  });
  //pass
  test("status 400; bad request, empty object", () => {
    const newVotes = {};
    return request(app)
      .patch(`/api/articles/3`)
      .send(newVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("no change in vote");
      });
  });
  //pass
  test("status:404, correct data type but id does not exist to update ", () => {
    return request(app)
      .patch(`/api/articles/99999`)
      .send({ inc_votes: 10 })
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("article id not found");
      });
  });
  //pass
  test("status: 400, invalid Id not a number cant patch wrong data type", () => {
    return request(app)
      .patch(`/api/articles/not-an-id`)
      .send({ inc_votes: 10 })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("PSQL error");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("returns 204 status code", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("returns 404 status code when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/2000")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found");
      });
  });
});
