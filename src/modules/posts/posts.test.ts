import Fastify from "fastify";
import { postsRoutes } from "./posts.routes";

describe("POST /posts", () => {
  it("should create a new post and return it with a 201 status code", async () => {
    const app = Fastify();

    const newPostPayload = {
      img_url: "http://example.com/new-image.jpg",
      caption: "A brand new post from our test!",
    };

    const createdPost = { ...newPostPayload, id: 1 };

    // mock the database

    // adds a fake transactions object to Fastify
    // simulating database behavior without touching SQLite
    app.decorate("transactions", {
      posts: {
        getById: jest.fn(),
        getAll: jest.fn(),
        create: jest.fn().mockReturnValue(createdPost),
      },
    });

    app.register(postsRoutes);

    // make a test request. app.inject(): Fastify's built-in method to simulate an HTTP request
    const response = await app.inject({
      method: "POST",
      url: "/posts",
      payload: newPostPayload,
    });

    // asset the results
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.payload)).toEqual(createdPost);
  });
});