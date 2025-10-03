import * as schema from "./schema"

export type Media = typeof schema.media.$inferSelect;
export type Album = typeof schema.album.$inferSelect;
export type MediaToAlbums = typeof schema.mediasToAlbums.$inferSelect;
export type MediaToAlbumsInsert = typeof schema.mediasToAlbums.$inferInsert;
