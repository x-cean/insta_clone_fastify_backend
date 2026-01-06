import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import Database from "better-sqlite3";
import {
  createTransactionHelpers,
  type TransactionHelpers,
} from "./database.transactions";

declare module "fastify" {
  interface FastifyInstance {
    db: Database.Database;
    transactions: TransactionHelpers;
  }
}

async function databasePluginHelper(fastify: FastifyInstance) {
  const db = new Database("./database.db");
  fastify.log.info("SQLite database connection established.");

  // Create a simple table for testing if it doesn't exist
  db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    img_url TEXT NOT NULL,
    caption TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

  db.exec(`
  CREATE TABLE IF NOT EXISTS reels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    caption TEXT,
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

  // Create tagged_posts table
  db.exec(`
  CREATE TABLE IF NOT EXISTS tagged_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    img_url TEXT NOT NULL,
    caption TEXT,
    tagged_by_user TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

  // Seed tagged_posts if empty
  const taggedPostsCount = db.prepare('SELECT COUNT(*) as count FROM tagged_posts').get() as { count: number };
  if (taggedPostsCount.count === 0) {
    const insertTaggedPost = db.prepare(`
      INSERT INTO tagged_posts (img_url, caption, tagged_by_user)
      VALUES (?, ?, ?)
    `);

    const taggedPosts = [
      ['https://picsum.photos/400/400', 'Tagged in a beautiful sunset', '@mike_wheeler'],
      ['https://picsum.photos/400/400', 'Great memories with friends', '@djo'],
      ['https://picsum.photos/400/400', 'Adventure time!', '@el_eleven'],
    ];

    for (const post of taggedPosts) {
      insertTaggedPost.run(...post);
    }

    fastify.log.info(`Seeded ${taggedPosts.length} tagged posts.`);
  }

  db.exec(`
  CREATE TABLE IF NOT EXISTS highlights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cover_img_url TEXT NOT NULL,
    title TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

  // Seed highlights if empty
  const highlightsCount = db.prepare('SELECT COUNT(*) as count FROM highlights').get() as { count: number };
  if (highlightsCount.count === 0) {
    const insertHighlight = db.prepare(`
      INSERT INTO highlights (cover_img_url, title)
      VALUES (?, ?)
    `);

    const highlights = [
      ['https://picsum.photos/100/100', 'Travel'],
      ['https://picsum.photos/100/100', 'Food'],
      ['https://picsum.photos/100/100', 'Friends'],
      ['https://picsum.photos/100/100', 'Fitness'],
      ['https://picsum.photos/100/100', 'Music'],
    ];

    for (const highlight of highlights) {
      insertHighlight.run(...highlight);
    }

    fastify.log.info(`Seeded ${highlights.length} highlights.`);
  }


  const transactions = createTransactionHelpers(db);

  fastify.decorate("db", db);
  fastify.decorate("transactions", transactions);

  fastify.addHook("onClose", (instance, done) => {
    instance.db.close();
    instance.log.info("SQLite database connection closed.");
    done();
  });
}

const databasePlugin = fp(databasePluginHelper);

export { databasePlugin };