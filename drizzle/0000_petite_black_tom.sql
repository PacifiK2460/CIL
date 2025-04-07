CREATE TABLE `Fleet` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice` text,
	`departure` text,
	`destination` text,
	`status` text
);
--> statement-breakpoint
CREATE TABLE `Invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`order_key` text,
	`order_value` integer
);
--> statement-breakpoint
CREATE TABLE `Personal` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`address` text,
	`rol` text,
	`password` text
);
--> statement-breakpoint
CREATE TABLE `Products` (
	`id` text PRIMARY KEY NOT NULL,
	`provider` text,
	`name` text,
	`quantity` integer,
	`location` text
);
--> statement-breakpoint
CREATE TABLE `Providers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`address` text,
	`phone` text,
	`email` text
);
