ALTER TABLE "Media" ALTER COLUMN "mediaType" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Media" ALTER COLUMN "mediaSize" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Media" ADD COLUMN "mediaFilePath" text NOT NULL;