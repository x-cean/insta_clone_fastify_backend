import type {FastifyInstance} from "fastify";
import {CreateTaggedDto} from "./tagged.types";

const taggedService = (fastify: FastifyInstance) => {
  return {
    create: async (taggedPostData: CreateTaggedDto) => {
      fastify.log.info(`Creating a new tagged post`);
      // This will use the MOCK `transactions` in our test,
      // and the REAL `transactions` in our live application.
      return fastify.transactions.tagged_posts.create(taggedPostData);
    },
    getAll: async () => {
      fastify.log.info(`Getting all tagged posts`);
      return fastify.transactions.tagged_posts.getAll();
    },
  };
};

export { taggedService };