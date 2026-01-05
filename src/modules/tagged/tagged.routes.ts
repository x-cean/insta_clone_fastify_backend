import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { taggedService } from "./tagged.service";
import { CreateTaggedDto } from "./tagged.types";

const taggedRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const service = taggedService(fastify);

  fastify.post<{ Body: CreateTaggedDto }>("/tagged/grid", async (request, reply) => {
    const newTaggedPost = await service.create(request.body);

    // Return a 201 Created status code with the new post object
    return reply.code(201).send(newTaggedPost);
  });

  fastify.get("/tagged/grid", async (request, reply) => {
    const allTaggedPost = await service.getAll();
    // Return a 200 Created status code with the all post object
    return reply.code(200).send(allTaggedPost);
  });

};

export { taggedRoutes };