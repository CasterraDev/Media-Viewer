CREATE TABLE "Media" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(100),
	"description" varchar(5000),
	"mediaRoot" text NOT NULL,
	"mediaDir" text NOT NULL,
	"mediaFilename" text NOT NULL,
	"media_created_at" timestamp NOT NULL,
	"media_updated_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "media_title_idx" ON "Media" USING btree ("title");