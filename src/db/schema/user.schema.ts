import { pgTable as table, pgEnum } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["User", "Admin"]);

const users = table(
  "users",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    name: t.varchar({ length: 256 }).notNull(),
    email: t.varchar().notNull(),
    password: t.varchar().notNull(),
    phoneNumber: t.varchar({ length: 10 }).notNull(),
    address: t.text().notNull(),
    role: userRoleEnum().default("User"),
    revenue: t.bigint({ mode: "number" }).default(0),
    createdAt: t.timestamp("created_at").defaultNow(),
    updatedAt: t.timestamp(),
    refreshToken: t.text(),
  },
  (table) => [t.uniqueIndex("email_unique").on(table.email)]
);

export { users };
