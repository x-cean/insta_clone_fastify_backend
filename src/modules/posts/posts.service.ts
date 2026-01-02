import type {FastifyInstance} from "fastify";
import {CreatePostDto} from "./posts.types";

const postsService = (fastify: FastifyInstance) => {
  return {
    create: async (postData: CreatePostDto) => {
      fastify.log.info(`Creating a new post`);
      // This will use the MOCK `transactions` in our test,
      // and the REAL `transactions` in our live application.
      return fastify.transactions.posts.create(postData);
    },
    getAll: async () => {
      fastify.log.info(`Getting all posts`);
      return fastify.transactions.posts.getAll();
    },
  };
};

export { postsService };