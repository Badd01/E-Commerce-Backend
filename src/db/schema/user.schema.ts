import { pgTable as table, pgEnum } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("role_enum", ["User", "Admin"]);

export const users = table("users", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar({ length: 256 }).notNull(),
  email: t.varchar().notNull().unique(),
  password: t.text(), // If dont use google login
  googleId: t.text("google_id"),
  phoneNumber: t.varchar({ length: 11 }),
  address: t.text(),
  role: userRoleEnum().notNull().default("User"),
  createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: t.timestamp("updated_at", { withTimezone: true }).defaultNow(),
  refreshToken: t.text("refresh_token"),
});
