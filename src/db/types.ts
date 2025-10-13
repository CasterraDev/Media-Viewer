import { InferSelectModel } from "drizzle-orm";
import * as schema from "./schema"
import {
    type BuildQueryResult,
    type DBQueryConfig,
    type ExtractTablesWithRelations
} from "drizzle-orm";

export type Media = typeof schema.media.$inferSelect;
export type MediaInsert = typeof schema.media.$inferInsert;

export type Album = typeof schema.album.$inferSelect;
export type AlbumInsert = typeof schema.album.$inferInsert;

export type MediaToAlbums = typeof schema.mediasToAlbums.$inferSelect;
export type MediaToAlbumsInsert = typeof schema.mediasToAlbums.$inferInsert;

export type MediaAlbums = InferQueryModel<"media", {with: {albums: {with:{album:true}}}}>

type TSchema = ExtractTablesWithRelations<typeof schema>;

export type QueryConfig<TableName extends keyof TSchema> = 
  DBQueryConfig<"one" | "many", boolean, TSchema, TSchema[TableName]>;


/* EXAMPLE
type Result = InferQueryModel<
  "logs",
  {
    columns: { id: true },
    with: {
      character: {
        columns: { id: true }
      }
    }
  }
>;

type Result = { id: string; character: { id: string; } }
*/
export type InferQueryModel<
  TableName extends keyof TSchema, 
  QBConfig extends QueryConfig<TableName> = {}
> = BuildQueryResult<
    TSchema,
    TSchema[TableName],
    QBConfig
>;
