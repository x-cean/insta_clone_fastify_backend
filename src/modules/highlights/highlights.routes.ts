import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { highlightsService } from "./highlights.service";
import { CreateHighlightDto } from "./highlights.types";

const highlightsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const service = highlightsService(fastify);

  fastify.post<{ Body: CreateHighlightDto }>("/highlights", async (request, reply) => {
    const newHighlight = await service.create(request.body);

    // Return a 201 Created status code with the new highlight object
    return reply.code(201).send(newHighlight);
  });

  fastify.get("/highlights", async (request, reply) => {
    const allHighlights = await service.getAll();
    // Return a 200 Created status code with the all highlight object
    return reply.code(200).send(allHighlights);
  });

    fastify.get<{ Params: { id: number } }>("/highlights/:id", async (request, reply) => {
    const Highlight = await service.getById(request.params.id);
    // Return a 200 Created status code with the highlight object
    return reply.code(200).send(Highlight);
  });
};

export { highlightsRoutes };