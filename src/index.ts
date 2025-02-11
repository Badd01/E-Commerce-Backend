import config from "./config";
import express, { Request, Response } from "express";
import { drizzle } from "drizzle-orm/node-postgres";

const app = express();
const db = drizzle(config.db_url!);

app.get("/", (req: Request, res: Response) => {
  res.send("Ecommerce server is running ...!");
});

async function main() {
  app.listen(config.port, () => {
    console.log(`Server is listening on port ${config.port}`);
  });
}

main();
