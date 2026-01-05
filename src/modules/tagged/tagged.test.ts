import Fastify from "fastify";
import { taggedRoutes } from "./tagged.routes";

describe("GET /tagged/grid", () => {
  it("should get all tagged posts and return them with a 200 status code", async () => {
    const app = Fastify();

    const mockTagged = [
      {
        id: 10,
        img_url: "http://example.com/image1.jpg",
        caption: "First test post",
        tagged_by_user: "vecna_pending123",
      },
      {
        id: 12,
        img_url: "http://example.com/image1.jpg",
        caption: "First test post",
        tagged_by_user: "stranger_things",
      },
      {
        id: 13,
        img_url: "http://example.com/image1.jpg",
        caption: "First test post",
        tagged_by_user: "wheeler_family",
      },
    ];

    // mock the database

    // adds a fake transactions object to Fastify
    // this time for the GET all posts route
    app.decorate("transactions", {
      posts: {
        getById: jest.fn(),
        getAll: jest.fn(),
        create: jest.fn(),
      },
      reels: {
        create: jest.fn(),
        getAll: jest.fn(),
        getById: jest.fn(),
      },
      tagged_posts: {
        getById: jest.fn(),
        getAll: jest.fn().mockReturnValue(mockTagged),
        create: jest.fn(),
      },
    });

    app.register(taggedRoutes);
    await app.ready();

    // make a test request
    const response = await app.inject({
      method: "GET",
      url: "/tagged/grid",
    });

    // assert the results
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual(mockTagged);
  });
});

