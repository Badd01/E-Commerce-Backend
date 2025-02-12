import { defineConfig } from "drizzle-kit";
import config from "./src/config";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/*",
  dialect: "postgresql",
  dbCredentials: {
    url: config.db_url!,
  },
});
