import "dotenv/config"; // Load environment variables from .env file
import Fastify from "fastify";
import cors from "@fastify/cors";
import { databasePlugin } from "./core/database/database.plugin";
import { postsRoutes } from "./modules/posts/posts.routes";
import { reelsRoutes } from "./modules/reels/reels.routes";
import { taggedRoutes } from "./modules/tagged/tagged.routes";
import { highlightsRoutes } from "./modules/highlights/highlights.routes";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";

const fastify = Fastify({
  logger: true,
});

// Register CORS to allow frontend access
fastify.register(cors, {
  origin: [
    "http://localhost:5173", // Vite dev server
    "https://insta-clone-react-frontend-alpha.vercel.app", // Deployed frontend
  ],
  credentials: true,
});

// Register multipart plugin
fastify.register(multipart);

// Register static file serving for uploads
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "..", "public", "uploads"),
  prefix: "/uploads/",
});

// Register our database plugin
fastify.register(databasePlugin);
// Register our new posts routes
fastify.register(postsRoutes);
// Register our new reels routes
fastify.register(reelsRoutes);
// Register our new tagged posts routes
fastify.register(taggedRoutes);
// Register our new highlights routes
fastify.register(highlightsRoutes);

// Declare a default route
fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

const port = parseInt(process.env.PORT || "3000", 10);
const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

fastify.listen({ port, host }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});