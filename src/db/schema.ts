import { pgTable, text, timestamp, index, varchar, uuid, numeric, decimal, integer, primaryKey } from "drizzle-orm/pg-core";
import { createUniqueId } from "./utils";
import { relations } from "drizzle-orm";

export function enumToPgEnum<T extends Record<string, any>>(
    myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
    return Object.values(myEnum).map((value: any) => `${value}`) as any
}

export const media = pgTable("Media", {
    id: uuid().$defaultFn(() => createUniqueId()).primaryKey(),
    title: varchar("title", { length: 100 }),
    description: varchar("description", { length: 5000 }),
    mediaType: text().notNull(),
    mediaMime: text().notNull(),
    mediaRoot: text().notNull(),
    mediaDir: text().notNull(),
    mediaFilename: text().notNull(),
    mediaFilePath: text().notNull(),
    mediaSize: numeric().notNull(),
    mediaWidth: integer().notNull(),
    mediaHeight: integer().notNull(),
    mediaDurationInSecs: integer(),
    mediaCreatedAt: timestamp("media_created_at", { mode: "string" }).notNull(),
    mediaUpdatedAt: timestamp("media_updated_at", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow().$onUpdate(() => new Date().toISOString()).notNull()
},
    (table) => ([
        index("media_title_idx").on(table.title),
    ])
);

export const mediaRelations = relations(media, ({ many }) => ({
    mediasToAlbums: many(mediasToAlbums),
}));

export const album = pgTable("Album", {
    id: uuid().$defaultFn(() => createUniqueId()).primaryKey(),
    title: varchar("title", { length: 100 }),
    description: varchar("description", { length: 5000 }),
    thumbnailID: uuid().references(() => media.id),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow().$onUpdate(() => new Date().toISOString()).notNull()
},
    (table) => ([
        index("album_title_idx").on(table.title),
    ])
);

export const albumRelations = relations(album, ({ one, many }) => ({
    mediasToAlbums: many(mediasToAlbums),
    thumbnail: one(media, { fields: [album.thumbnailID], references: [media.id] })
}));

export const mediasToAlbums = pgTable(
    'medias_to_albums',
    {
        mediaID: uuid()
            .notNull()
            .references(() => media.id),
        albumID: uuid()
            .notNull()
            .references(() => album.id),
    },
    (t) => [
        primaryKey({ columns: [t.mediaID, t.albumID] })
    ],
);

export const mediasToAlbumsRelations = relations(mediasToAlbums, ({ one }) => ({
    album: one(album, {
        fields: [mediasToAlbums.albumID],
        references: [album.id],
    }),
    media: one(media, {
        fields: [mediasToAlbums.mediaID],
        references: [media.id],
    }),
}));

export const schema = {
    media,
    album,
    mediasToAlbums,
    mediaRelations,
    albumRelations,
}
