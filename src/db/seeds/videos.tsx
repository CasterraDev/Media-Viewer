import videoJson from "./data/videos.json";
import { db } from "@/db/db";
import { users, videos } from "../schema";
import { eq } from "drizzle-orm";

export default async function videoSeed(db: db) {
    await Promise.all(
        videoJson.map(async (video) => {
            const user = await db.query.users.findFirst({
                where: eq(users.username, video.UserUploaded)
            })

            if (user) {
                const insertedVideo = await db.insert(videos).values({
                    ...video,
                    userId: user.id
                }).returning()
            } else {
                console.error("User not found. Skipping Video Seed")
            }
        })
    )
}
