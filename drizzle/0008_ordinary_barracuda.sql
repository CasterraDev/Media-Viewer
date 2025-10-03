CREATE TABLE "Album" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(100),
	"description" varchar(5000),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medias_to_albums" (
	"mediaID" uuid NOT NULL,
	"albumID" uuid NOT NULL,
	CONSTRAINT "medias_to_albums_mediaID_albumID_pk" PRIMARY KEY("mediaID","albumID")
);
--> statement-breakpoint
ALTER TABLE "medias_to_albums" ADD CONSTRAINT "medias_to_albums_mediaID_Media_id_fk" FOREIGN KEY ("mediaID") REFERENCES "public"."Media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medias_to_albums" ADD CONSTRAINT "medias_to_albums_albumID_Album_id_fk" FOREIGN KEY ("albumID") REFERENCES "public"."Album"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "album_title_idx" ON "Album" USING btree ("title");