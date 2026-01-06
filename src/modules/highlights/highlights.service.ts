import type {FastifyInstance} from "fastify";
import {CreateHighlightDto} from "./highlights.types";

const highlightsService = (fastify: FastifyInstance) => {
  return {
    create: async (highlightData: CreateHighlightDto) => {
      fastify.log.info(`Creating a new highlight`);
      // This will use the MOCK `transactions` in our test,
      // and the REAL `transactions` in our live application.
      return fastify.transactions.highlights.create(highlightData);
    },
    getAll: async () => {
      fastify.log.info(`Getting all highlights`);
      return fastify.transactions.highlights.getAll();
    },
    getById: async (id: number) => {
        fastify.log.info(`Getting highlight with id: ${id}`);
        return fastify.transactions.highlights.getById(id);
    }
  };
};

export { highlightsService };