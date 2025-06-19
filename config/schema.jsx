import { boolean, integer, json, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  subscriptionId: varchar({ length: 255 }),
});

//courses table
export const coursesTable = pgTable("courses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cid: varchar({ length: 255 }).notNull().unique(),
  name: varchar(),
  description: varchar(),
  noOfChapiters: integer().notNull(),
  includeVideo: boolean().notNull().default(false),
  bannerImageUrl: varchar().default(""),
  level: varchar().notNull(),
  category: varchar(),
  couseJson: json(),
  courseContent: json().default({}),
  userEmail: varchar("userEmail")
    .references(() => usersTable.email, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
});
