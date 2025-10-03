ALTER TABLE "Album" DROP CONSTRAINT "Album_thumbnail_Media_id_fk";
--> statement-breakpoint
ALTER TABLE "Album" ADD COLUMN "thumbnailID" uuid;--> statement-breakpoint
ALTER TABLE "Album" ADD CONSTRAINT "Album_thumbnailID_Media_id_fk" FOREIGN KEY ("thumbnailID") REFERENCES "public"."Media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Album" DROP COLUMN "thumbnail";