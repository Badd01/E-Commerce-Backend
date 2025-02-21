import { pgTable as table, pgEnum } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

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
    role: userRoleEnum().default("User"),
    revenue: t.bigint({ mode: "number" }).default(0),
    createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: t.timestamp("updated_at", { withTimezone: true }).defaultNow(),
    refreshToken: t.text("refresh_token"),
    passwordChangedAt: t.timestamp("password_changed_at", {
      withTimezone: true,
    }),
    passwordResetToken: t.text("password_reset_token"),
    passwordResetExpires: t.timestamp("password_reset_expires", {
      withTimezone: true,
    }),
  },
  (table) => [t.uniqueIndex("email_unique").on(table.email)]
);

export { users };
