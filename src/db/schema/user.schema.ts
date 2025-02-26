import { pgTable as table, pgEnum } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const userRoleEnum = pgEnum("role_enum", ["User", "Admin"]);

const users = table(
  "users",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    name: t.varchar({ length: 256 }).notNull(),
    email: t.varchar().notNull(),
    password: t.varchar().notNull(),
    phoneNumber: t.varchar({ length: 11 }).notNull(),
    address: t.text().notNull(),
    role: userRoleEnum().notNull().default("User"),
    createdAt: t
      .timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: t
      .timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    refreshToken: t.text("refresh_token"),
    passwordChangedAt: t.timestamp("password_changed_at"),
    passwordResetToken: t.text("password_reset_token"),
    passwordResetExpires: t.timestamp("password_reset_expires"),
  },
  (table) => [t.uniqueIndex("email_unique").on(table.email)]
);

export { users };
