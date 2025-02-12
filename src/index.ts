import config from "./config";
import cors from "cors";
import express, { Request, Response } from "express";
import { ProductRoutes } from "./routes/product.routes";

const app = express();

// MIddleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/products", ProductRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Ecommerce server is running ...!");
});

async function main() {
  app.listen(config.port, () => {
    console.log(`Server is listening on port ${config.port}`);
  });
}

main();
