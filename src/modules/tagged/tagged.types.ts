import { z } from "zod";

// First, we define the zod schemas
const createTaggedDtoSchema = z.object({
  img_url: z.string().url(),
  caption: z.string().nullable().optional(),
  tagged_by_user: z.string(), // Username of the user who made the tag
});

const taggedSchema = z.object({
  id: z.number(),
  img_url: z.string().url(),
  caption: z.string().nullable(),
  tagged_by_user: z.string(),
  created_at: z.string(), // SQLite returns DATETIME as a string by default
});

// This will be useful for validating the response from the `GET /posts` endpoint.
const taggedsSchema = z.array(taggedSchema);

// Then, we infer the TypeScript types directly from our Zod schemas.
// This avoids duplicating type definitions and ensures our types always match our validation rules.
type CreateTaggedDto = z.infer<typeof createTaggedDtoSchema>;
type Tagged = z.infer<typeof taggedSchema>;

export { createTaggedDtoSchema, taggedSchema, taggedsSchema, CreateTaggedDto, Tagged };