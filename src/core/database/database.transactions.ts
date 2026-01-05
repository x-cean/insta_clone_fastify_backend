import type { Database } from "better-sqlite3";
import { CreatePostDto } from "src/modules/posts/posts.types";
import { CreateReelDto } from "src/modules/reels/reels.types";
import { CreateTaggedDto } from "src/modules/tagged/tagged.types";

// This factory function creates and returns our transaction helpers.
const createTransactionHelpers = (db: Database) => {
  // We use prepared statements for security and performance.
  const statements = {
    getPostById: db.prepare("SELECT * FROM posts WHERE id = ?"),
    getAllPosts: db.prepare("SELECT * FROM posts"),
    createPost: db.prepare(
      "INSERT INTO posts (img_url, caption) VALUES (@img_url, @caption) RETURNING *",
    ),

    getReelsById: db.prepare("SELECT * FROM reels WHERE id = ?"),
    getAllReels: db.prepare("SELECT * FROM reels"),
    createReel: db.prepare(
      "INSERT INTO reels (video_url, thumbnail_url, caption, views) VALUES (@video_url, @thumbnail_url, @caption, @views) RETURNING *",
    ),

    getTaggedPostById: db.prepare("SELECT * FROM tagged_posts WHERE id = ?"),
    getAllTaggedPosts: db.prepare("SELECT * FROM tagged_posts"),
    createTaggedPost: db.prepare(
      "INSERT INTO tagged_posts (img_url, caption, tagged_by_user) VALUES (@img_url, @caption, @tagged_by_user) RETURNING *",
    ),
  };

  const posts = {
    getById: (id: number) => {
      return statements.getPostById.get(id);
    },
    getAll: () => {
      return statements.getAllPosts.all();
    },
    create: (data: CreatePostDto) => {
      return statements.createPost.get(data);
    },
  };

  const reels = {
    getById: (id: number) => {
      return statements.getReelsById.get(id);
    },
    getAll: () => {
      return statements.getAllReels.all();
    },
    create: (data: CreateReelDto) => {
      return statements.createReel.get(data);
    },
  };

  const tagged_posts = {
    getById: (id: number) => {
      return statements.getTaggedPostById.get(id);
    },
    getAll: () => {
      return statements.getAllTaggedPosts.all();
    },
    create: (data: CreateTaggedDto) => {
      return statements.createTaggedPost.get(data);
    },
  };

  return {
    posts,
    reels,
    tagged_posts,
  };
};

export type TransactionHelpers = ReturnType<typeof createTransactionHelpers>;
export { createTransactionHelpers };