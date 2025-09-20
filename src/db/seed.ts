import { getTableName, sql, Table } from "drizzle-orm";
import { db } from "./db";
import { media } from "./schema";
// import mediaSeed from "./seeds/videos";

// async function resetTable(db: any, table: Table) {
//   return db.execute(
//     sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`)
//   );
// }
//
//
// async function init(){
//     for (const table of [
//         usersToLikedVideos,
//     videos,
//     sessions,
//     users
//     ]) {
//         // await db.delete(table); // clear tables without truncating / resetting ids
//         await resetTable(db, table);
//     }
//
//     await userSeed(db);
//     await videoSeed(db);
// }
//
// init();
