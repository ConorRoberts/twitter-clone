import type { InferModel } from "drizzle-orm";
import { relations, sql } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  likes: many(likes, { relationName: "users.likes" }),
  follows: many(follows, { relationName: "users.follows" }),
  tweets: many(tweets, { relationName: "users.tweets" }),
}));

export type User = InferModel<typeof users, "select">;
export type NewUser = InferModel<typeof users, "insert">;

export const tweets = sqliteTable(
  "tweets",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    content: text("content").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => ({
    idIdx: index("id_idx").on(table.id),
  })
);

export const tweetsRelations = relations(tweets, ({ one, many }) => ({
  author: one(users, { fields: [tweets.authorId], references: [users.id], relationName: "users.tweets" }),
  likedBy: many(users, { relationName: "users.likes" }),
}));

export type Tweet = InferModel<typeof tweets, "select">;
export type NewTweet = InferModel<typeof tweets, "insert">;

export const follows = sqliteTable(
  "follows",
  {
    userId: text("user_id").references(() => users.id),
    followedUserId: text("followed_user_id").references(() => users.id),
  },
  (table) => ({
    pk: primaryKey(table.userId, table.followedUserId),
  })
);

export const followsRelations = relations(follows, ({ one }) => ({
  user: one(users, { fields: [follows.userId], references: [users.id], relationName: "users.follows" }),
  followedUser: one(users, {
    fields: [follows.followedUserId],
    references: [users.id],
  }),
}));

export type Follow = InferModel<typeof follows, "select">;
export type NewFollow = InferModel<typeof follows, "insert">;

export const likes = sqliteTable(
  "likes",
  {
    userId: text("user_id"),
    likedTweetId: text("likedTweetId"),
  },
  (table) => ({
    pk: primaryKey(table.userId, table.likedTweetId),
  })
);

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, { fields: [likes.userId], references: [users.id], relationName: "users.likes" }),
  tweet: one(tweets, { fields: [likes.likedTweetId], references: [tweets.id] }),
}));

export type Like = InferModel<typeof likes, "select">;
export type NewLike = InferModel<typeof likes, "insert">;
