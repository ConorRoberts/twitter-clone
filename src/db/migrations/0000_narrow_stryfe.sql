CREATE TABLE `follows` (
	`user_id` text,
	`followed_user_id` text,
	PRIMARY KEY(`user_id`, `followed_user_id`)
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`user_id` text,
	`likedTweetId` text,
	PRIMARY KEY(`user_id`, `likedTweetId`)
);
--> statement-breakpoint
CREATE TABLE `tweets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`author_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text
);
--> statement-breakpoint
CREATE INDEX `id_idx` ON `tweets` (`id`);