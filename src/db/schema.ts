import { pgTable, text, timestamp, index, varchar, uuid, numeric, decimal } from "drizzle-orm/pg-core";
import { createUniqueId } from "./utils";

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
    mediaCreatedAt: timestamp("media_created_at", { mode: "string" }).notNull(),
    mediaUpdatedAt: timestamp("media_updated_at", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow().$onUpdate(() => new Date().toString()).notNull()
},
    (table) => ([
        index("media_title_idx").on(table.title),
    ])
);

export const schema = {
    media,
}

