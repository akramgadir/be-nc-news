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
        console.log("articles body test:", body);
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
        console.log("test17", body.articles);
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
