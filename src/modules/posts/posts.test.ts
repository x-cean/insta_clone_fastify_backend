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
      reels: {
        create: jest.fn(),
        getAll: jest.fn(),
        getById: jest.fn(),
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


describe("GET /posts", () => {
  it("should get all posts and return them with a 200 status code", async () => {
    const app = Fastify();

    const allPosts = [
      {
        id: 1,
        img_url: "http://example.com/image1.jpg",
        caption: "First test post",
      },
      {
        id: 2,
        img_url: "http://example.com/image1.jpg",
        caption: "First test post",
      },
      {
        id: 3,
        img_url: "http://example.com/image1.jpg",
        caption: "First test post",
      },
    ];

    // mock the database

    // adds a fake transactions object to Fastify
    // this time for the GET all posts route
    app.decorate("transactions", {
      posts: {
        getById: jest.fn(),
        getAll: jest.fn().mockReturnValue(allPosts),
        create: jest.fn(),
      },
      reels: {
        create: jest.fn(),
        getAll: jest.fn(),
        getById: jest.fn(),
      }
    });

    app.register(postsRoutes);
    await app.ready();

    // make a test request
    const response = await app.inject({
      method: "GET",
      url: "/posts",
    });

    // asset the results
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual(allPosts);
  });
});

