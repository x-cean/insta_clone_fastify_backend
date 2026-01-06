import Fastify from "fastify";
import { highlightsRoutes } from "./highlights.routes";


describe("GET /highlights", () => {
  it("should get all highlighted posts and return them with a 200 status code", async () => {
    const app = Fastify();

    const mockHighlights = [
      {
        id: 1,
        cover_image_url: "http://example.com/image1.jpg",
        title: "First highlight",
      },
      {
        id: 2,
        cover_image_url: "http://example.com/image1.jpg",
        title: "Second highlight",
      },
      {
        id: 3,
        cover_image_url: "http://example.com/image1.jpg",
        title: "Highlights",
      },
    ];

    // mock the database

    // adds a fake transactions object to Fastify
    // this time for the GET all highlights route
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
        getAll: jest.fn(),
        create: jest.fn(),
      },
      highlights: {
        getAll: jest.fn().mockResolvedValue(mockHighlights),
        getById: jest.fn(),
        create: jest.fn(),
      },
    });

    app.register(highlightsRoutes);
    await app.ready();

    // make a test request
    const response = await app.inject({
      method: "GET",
      url: "/highlights",
    });

    // asset the results
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual(mockHighlights);
  });
});

describe("GET /highlights/:id", () => {
    it("should get a highlighted post by ID and return it with a 200 status code", async () => {
        const app = Fastify();
        const mockHighlight = {
            id: 1,
            cover_image_url: "http://example.com/image1.jpg",
            title: "First highlight",
        };

        // adds a fake transactions object to Fastify
        // this time for the GET highlight by ID route
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
                getAll: jest.fn(),
                create: jest.fn(),
            },
            highlights: {
                getAll: jest.fn(),
                getById: jest.fn().mockResolvedValue(mockHighlight),
                create: jest.fn(),
            },
        });

        app.register(highlightsRoutes);
        await app.ready();

        // make a test request
        const response = await app.inject({
            method: "GET",
            url: "/highlights/1",
        });

        // assert the results
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.payload)).toEqual(mockHighlight);
    });
});
