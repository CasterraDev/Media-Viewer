CREATE TABLE "Settings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"mediaRoots" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
