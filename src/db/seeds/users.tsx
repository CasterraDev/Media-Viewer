import usersJson from "./data/users.json";
import {db} from "@/db/db";
import { users } from "../schema";
import { hashPassword } from "@/lib/user";
import { UserRole } from "@/_types/auth";

export default async function userSeed(db: db) {
    await Promise.all(
        usersJson.map(async (user) => {
            const insertedUser = await db.insert(users).values({
                ...user,
                role: (UserRole.Admin === user.role) ? UserRole.Admin : UserRole.User,
                password: await hashPassword(user.password)
            }).returning()
        })
    )
}
