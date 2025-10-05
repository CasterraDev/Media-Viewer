import * as schema from "./schema"

export type Media = typeof schema.media.$inferSelect;
export type MediaInsert = typeof schema.media.$inferInsert;

export type Album = typeof schema.album.$inferSelect;
export type AlbumInsert = typeof schema.album.$inferInsert;

export type MediaToAlbums = typeof schema.mediasToAlbums.$inferSelect;
export type MediaToAlbumsInsert = typeof schema.mediasToAlbums.$inferInsert;
