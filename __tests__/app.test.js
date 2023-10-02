const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index");
const devData = require("../db/data/development-data/index.js");

const { toLocaleString } = require("../db/data/development-data/articles.js");
beforeAll(() => seed(data));
afterAll(() => db.end());
const availableRoutes = require("../app.js");

describe("GET /api/topics", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/topics").expect(200);
  });

  test("returns an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body, status }) => {
        if (status === 404) {
          console.log("Error", status);
        }
        if (status === 500) {
          console.log("Internal server error", status);
        }
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

// describe("GET /api", () => {
//   //   test("returns 200 status code", () => {
//   //     return request(app).get("/api").expect(200);
//   //   });

//   test("returns an object describing all the available endpoints on your API", () => {
//     return request(app)
//       .get("/api/")
//       .then(({ body }) => {
//         console.log(body);

//       });
//   });
// });

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
